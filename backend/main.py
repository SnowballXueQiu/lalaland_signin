from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import httpx
import os
import secrets
import tomllib
import re
from datetime import date
from database import get_db, init_db
from contextlib import asynccontextmanager

WX_APPID = os.getenv("WX_APPID", "")
WX_SECRET = os.getenv("WX_SECRET", "")
DEFAULT_ADMIN_PASSWORD = "lalaland_admin_2024"

def load_admin_password() -> str:
    config_path = os.path.join(os.path.dirname(__file__), "config.toml")
    try:
        with open(config_path, "rb") as f:
            data = tomllib.load(f)
        value = data.get("admin_password")
        if isinstance(value, str) and value:
            return value
    except FileNotFoundError:
        pass
    except Exception:
        try:
            text = ""
            with open(config_path, "r", encoding="utf-8") as f:
                text = f.read()
            m = re.search(r'^\s*admin_password\s*=\s*"([^"]+)"\s*$', text, flags=re.MULTILINE)
            if m and m.group(1):
                return m.group(1)
        except Exception:
            pass
    return DEFAULT_ADMIN_PASSWORD

ADMIN_PASSWORD = load_admin_password()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(title="La La Land Signin API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class StudentCreate(BaseModel):
    student_no: str
    name: str
    group_name: Optional[str] = None

class StudentUpdate(BaseModel):
    id: int
    student_no: str
    name: str
    group_name: Optional[str] = None

class StudentDelete(BaseModel):
    student_id: int

class CourseCreate(BaseModel):
    name: str
    group_name: str
    teacher: Optional[str] = None
    start_date: Optional[date] = None
    total_lessons: int = 20

class CourseDelete(BaseModel):
    course_id: int

class EnrollmentCreate(BaseModel):
    student_id: int
    course_id: int

class AttendanceAction(BaseModel):
    student_id: int
    course_id: int
    attend_date: date

class ParentBind(BaseModel):
    openid: str
    student_no: str
    student_name: str

class ParentUnbind(BaseModel):
    openid: str
    student_id: int

class LoginRequest(BaseModel):
    code: str
    mock_openid: Optional[str] = None

class AdminPasswordLoginRequest(BaseModel):
    password: str

class GroupCreate(BaseModel):
    name: str

class GroupUpdate(BaseModel):
    id: int
    name: str

class GroupDelete(BaseModel):
    id: int

# --- Auth APIs ---
@app.post("/auth/login")
async def wechat_login(req: LoginRequest):
    if WX_APPID and WX_SECRET:
        url = f"https://api.weixin.qq.com/sns/jscode2session?appid={WX_APPID}&secret={WX_SECRET}&js_code={req.code}&grant_type=authorization_code"
        async with httpx.AsyncClient() as client:
            resp = await client.get(url)
            data = resp.json()
            openid = data.get("openid")
            if not openid:
                raise HTTPException(status_code=400, detail="Failed to get openid from WeChat")
    else:
        if req.mock_openid and re.fullmatch(r"[A-Za-z0-9_\-]{6,64}", req.mock_openid):
            openid = req.mock_openid
        elif req.code == "admin_code":
            openid = "mock_admin"
        else:
            openid = "mock_parent"
        
    conn = get_db()
    cursor = conn.cursor()
    
    # Check if admin
    cursor.execute("SELECT * FROM admin WHERE openid = ?", (openid,))
    admin = cursor.fetchone()
    if admin:
        conn.close()
        return {"openid": openid, "role": "admin"}
        
    # Check if parent
    cursor.execute("SELECT * FROM parent WHERE openid = ?", (openid,))
    parent = cursor.fetchone()
    conn.close()
    
    if parent:
        return {"openid": openid, "role": "parent"}
        
    return {"openid": openid, "role": "new_parent"}

@app.post("/auth/admin_password_login")
def admin_password_login(req: AdminPasswordLoginRequest):
    pwd = (req.password or "")
    if not ADMIN_PASSWORD or not secrets.compare_digest(pwd.encode("utf-8"), ADMIN_PASSWORD.encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid password")

    openid = "super_admin"
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO admin (openid, name) VALUES (?, ?) ON CONFLICT(openid) DO NOTHING",
        (openid, "超管"),
    )
    conn.commit()
    conn.close()
    return {"openid": openid, "role": "admin"}

# --- Student APIs ---
@app.post("/student/create")
def create_student(student: StudentCreate):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO student (student_no, name, group_name) VALUES (?, ?, ?)",
            (student.student_no, student.name, student.group_name)
        )
        conn.commit()
        return {"id": cursor.lastrowid, "message": "Student created successfully"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Student number already exists")
    finally:
        conn.close()

@app.get("/student/list")
def list_students(group_name: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    if group_name:
        cursor.execute("SELECT * FROM student WHERE group_name = ?", (group_name,))
    else:
        cursor.execute("SELECT * FROM student")
    students = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return students

@app.post("/student/update")
def update_student(payload: StudentUpdate):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE student SET student_no = ?, name = ?, group_name = ? WHERE id = ?",
            (payload.student_no, payload.name, payload.group_name, payload.id),
        )
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Student not found")
        conn.commit()
        return {"message": "Student updated successfully"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Student number already exists")
    finally:
        conn.close()

@app.post("/student/delete")
def delete_student(payload: StudentDelete):
    conn = get_db()
    cursor = conn.cursor()
    try:
        conn.execute("BEGIN")
        cursor.execute("DELETE FROM attendance WHERE student_id = ?", (payload.student_id,))
        cursor.execute("DELETE FROM enrollment WHERE student_id = ?", (payload.student_id,))
        cursor.execute("DELETE FROM parent_student WHERE student_id = ?", (payload.student_id,))
        cursor.execute("DELETE FROM student WHERE id = ?", (payload.student_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Student not found")
        conn.commit()
        return {"message": "Student deleted successfully"}
    except HTTPException:
        conn.rollback()
        raise
    finally:
        conn.close()

# --- Course APIs ---
@app.post("/course/create")
def create_course(course: CourseCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO course (name, group_name, teacher, start_date, total_lessons) VALUES (?, ?, ?, ?, ?)",
        (course.name, course.group_name, course.teacher, course.start_date, course.total_lessons)
    )
    conn.commit()
    course_id = cursor.lastrowid
    conn.close()
    return {"id": course_id, "message": "Course created successfully"}

@app.get("/course/list")
def list_courses():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM course")
    courses = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return courses

@app.post("/course/delete")
def delete_course(payload: CourseDelete):
    conn = get_db()
    cursor = conn.cursor()
    try:
        conn.execute("BEGIN")
        cursor.execute("DELETE FROM attendance WHERE course_id = ?", (payload.course_id,))
        cursor.execute("DELETE FROM enrollment WHERE course_id = ?", (payload.course_id,))
        cursor.execute("DELETE FROM course WHERE id = ?", (payload.course_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Course not found")
        conn.commit()
        return {"message": "Course deleted successfully"}
    except HTTPException:
        conn.rollback()
        raise
    finally:
        conn.close()

# --- Group APIs ---
@app.get("/group/list")
def list_groups(include_inactive: bool = False):
    conn = get_db()
    cursor = conn.cursor()
    if include_inactive:
        cursor.execute("SELECT id, name, is_active, sort_order FROM group_list ORDER BY sort_order ASC, name ASC")
    else:
        cursor.execute("SELECT id, name, is_active, sort_order FROM group_list WHERE is_active = 1 ORDER BY sort_order ASC, name ASC")
    groups = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return groups

@app.post("/group/create")
def create_group(payload: GroupCreate):
    name = (payload.name or "").strip()
    if not name:
        raise HTTPException(status_code=400, detail="Group name required")
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO group_list (name, is_active, sort_order) VALUES (?, 1, 0)", (name,))
        conn.commit()
        return {"id": cursor.lastrowid, "message": "Group created successfully"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Group name already exists")
    finally:
        conn.close()

@app.post("/group/update")
def update_group(payload: GroupUpdate):
    name = (payload.name or "").strip()
    if not name:
        raise HTTPException(status_code=400, detail="Group name required")
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT name FROM group_list WHERE id = ?", (payload.id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Group not found")
        old_name = row["name"]
        conn.execute("BEGIN")
        cursor.execute("UPDATE group_list SET name = ? WHERE id = ?", (name, payload.id))
        cursor.execute("UPDATE student SET group_name = ? WHERE group_name = ?", (name, old_name))
        cursor.execute("UPDATE course SET group_name = ? WHERE group_name = ?", (name, old_name))
        conn.commit()
        return {"message": "Group updated successfully"}
    except sqlite3.IntegrityError:
        conn.rollback()
        raise HTTPException(status_code=400, detail="Group name already exists")
    except HTTPException:
        conn.rollback()
        raise
    finally:
        conn.close()

@app.post("/group/delete")
def delete_group(payload: GroupDelete):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT name FROM group_list WHERE id = ? AND is_active = 1", (payload.id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Group not found")
        name = row["name"]
        cursor.execute("SELECT COUNT(1) as cnt FROM student WHERE group_name = ?", (name,))
        student_cnt = int(cursor.fetchone()["cnt"])
        cursor.execute("SELECT COUNT(1) as cnt FROM course WHERE group_name = ?", (name,))
        course_cnt = int(cursor.fetchone()["cnt"])
        if student_cnt > 0 or course_cnt > 0:
            raise HTTPException(status_code=400, detail="Group is in use")
        cursor.execute("UPDATE group_list SET is_active = 0 WHERE id = ?", (payload.id,))
        conn.commit()
        return {"message": "Group deleted successfully"}
    finally:
        conn.close()

@app.get("/course/detail")
def course_detail(course_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM course WHERE id = ?", (course_id,))
    course = cursor.fetchone()
    if not course:
        conn.close()
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Get enrolled students
    cursor.execute('''
        SELECT s.id, s.student_no, s.name, e.used_lessons
        FROM enrollment e
        JOIN student s ON e.student_id = s.id
        WHERE e.course_id = ?
    ''', (course_id,))
    students = [dict(row) for row in cursor.fetchall()]
    
    course_dict = dict(course)
    course_dict['students'] = students
    conn.close()
    return course_dict

# --- Enrollment APIs ---
@app.post("/course/addStudent")
def add_student_to_course(enrollment: EnrollmentCreate):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO enrollment (student_id, course_id) VALUES (?, ?)",
            (enrollment.student_id, enrollment.course_id)
        )
        conn.commit()
        return {"message": "Student added to course successfully"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Student already enrolled in this course")
    finally:
        conn.close()

@app.post("/course/removeStudent")
def remove_student_from_course(enrollment: EnrollmentCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM enrollment WHERE student_id = ? AND course_id = ?",
        (enrollment.student_id, enrollment.course_id)
    )
    conn.commit()
    conn.close()
    return {"message": "Student removed from course"}

# --- Attendance APIs ---
@app.post("/attendance/checkin")
def checkin(action: AttendanceAction):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("BEGIN TRANSACTION")
        
        # Insert attendance
        cursor.execute(
            "INSERT INTO attendance (student_id, course_id, attend_date) VALUES (?, ?, ?)",
            (action.student_id, action.course_id, action.attend_date)
        )
        
        # Update enrollment
        cursor.execute(
            "UPDATE enrollment SET used_lessons = used_lessons + 1 WHERE student_id = ? AND course_id = ?",
            (action.student_id, action.course_id)
        )
        if cursor.rowcount == 0:
            raise Exception("Student not enrolled in course")
            
        conn.commit()
        return {"message": "Check-in successful"}
    except sqlite3.IntegrityError:
        conn.rollback()
        raise HTTPException(status_code=400, detail="Already checked in for this date")
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

@app.post("/attendance/delete")
def delete_attendance(action: AttendanceAction):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("BEGIN TRANSACTION")
        
        cursor.execute(
            "DELETE FROM attendance WHERE student_id = ? AND course_id = ? AND attend_date = ?",
            (action.student_id, action.course_id, action.attend_date)
        )
        if cursor.rowcount == 0:
            raise Exception("Attendance record not found")
            
        cursor.execute(
            "UPDATE enrollment SET used_lessons = used_lessons - 1 WHERE student_id = ? AND course_id = ?",
            (action.student_id, action.course_id)
        )
        
        conn.commit()
        return {"message": "Attendance deleted successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

@app.get("/attendance/list")
def list_attendance(course_id: int, attend_date: Optional[date] = None):
    conn = get_db()
    cursor = conn.cursor()
    query = '''
        SELECT a.*, s.name, s.student_no 
        FROM attendance a
        JOIN student s ON a.student_id = s.id
        WHERE a.course_id = ?
    '''
    params = [course_id]
    if attend_date:
        query += " AND a.attend_date = ?"
        params.append(attend_date)
        
    cursor.execute(query, params)
    records = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return records

# --- Parent APIs ---
@app.post("/parent/bind")
def bind_parent(data: ParentBind):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("BEGIN TRANSACTION")
        
        # Find student
        cursor.execute(
            "SELECT id FROM student WHERE student_no = ? AND name = ?",
            (data.student_no, data.student_name)
        )
        student = cursor.fetchone()
        if not student:
            raise Exception("Student not found or name mismatch")
            
        # Get or create parent
        cursor.execute("SELECT id FROM parent WHERE openid = ?", (data.openid,))
        parent = cursor.fetchone()
        if not parent:
            cursor.execute("INSERT INTO parent (openid) VALUES (?)", (data.openid,))
            parent_id = cursor.lastrowid
        else:
            parent_id = parent['id']
            
        # Bind
        cursor.execute(
            "INSERT INTO parent_student (parent_id, student_id) VALUES (?, ?)",
            (parent_id, student['id'])
        )
        
        conn.commit()
        return {"message": "Bind successful"}
    except sqlite3.IntegrityError:
        conn.rollback()
        raise HTTPException(status_code=400, detail="Already bound")
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

@app.post("/parent/unbind")
def unbind_parent(data: ParentUnbind):
    conn = get_db()
    cursor = conn.cursor()
    try:
        # Get parent id
        cursor.execute("SELECT id FROM parent WHERE openid = ?", (data.openid,))
        parent = cursor.fetchone()
        if not parent:
            raise Exception("Parent not found")
            
        cursor.execute(
            "DELETE FROM parent_student WHERE parent_id = ? AND student_id = ?",
            (parent['id'], data.student_id)
        )
        if cursor.rowcount == 0:
            raise Exception("Binding not found")
            
        conn.commit()
        return {"message": "Unbind successful"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

@app.get("/parent/children")
def parent_children(openid: str):
    conn = get_db()
    cursor = conn.cursor()
    
    # Get parent
    cursor.execute("SELECT id FROM parent WHERE openid = ?", (openid,))
    parent = cursor.fetchone()
    if not parent:
        conn.close()
        return []
        
    # Get children and their courses
    cursor.execute('''
        SELECT s.id, s.student_no, s.name, s.group_name
        FROM parent_student ps
        JOIN student s ON ps.student_id = s.id
        WHERE ps.parent_id = ?
    ''', (parent['id'],))
    children = [dict(row) for row in cursor.fetchall()]
    
    for child in children:
        cursor.execute('''
            SELECT c.name as course_name, c.total_lessons, e.used_lessons, 
                   (c.total_lessons - e.used_lessons) as remaining_lessons
            FROM enrollment e
            JOIN course c ON e.course_id = c.id
            WHERE e.student_id = ?
        ''', (child['id'],))
        child['courses'] = [dict(row) for row in cursor.fetchall()]
        
    conn.close()
    return children

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
