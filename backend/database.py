import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'app.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Check if tables already exist
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='student'")
    table_exists = cursor.fetchone()
    
    if not table_exists:
        # Execute init.sql only if database is empty
        init_sql_path = os.path.join(os.path.dirname(__file__), 'init.sql')
        if os.path.exists(init_sql_path):
            with open(init_sql_path, 'r', encoding='utf-8') as f:
                sql_script = f.read()
                cursor.executescript(sql_script)
                print("Executed init.sql to initialize database")
    else:
        print("Database already initialized, skipping init.sql")

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS group_list (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            is_active INTEGER NOT NULL DEFAULT 1,
            sort_order INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
    """)

    try:
        cursor.execute("SELECT COUNT(1) as cnt FROM group_list")
        cnt = int(cursor.fetchone()["cnt"])
    except Exception:
        cnt = 0

    if cnt == 0:
        groups = set()
        try:
            cursor.execute("SELECT DISTINCT group_name FROM student WHERE group_name IS NOT NULL AND TRIM(group_name) <> ''")
            groups |= {row["group_name"] for row in cursor.fetchall() if row["group_name"]}
        except Exception:
            pass
        try:
            cursor.execute("SELECT DISTINCT group_name FROM course WHERE group_name IS NOT NULL AND TRIM(group_name) <> ''")
            groups |= {row["group_name"] for row in cursor.fetchall() if row["group_name"]}
        except Exception:
            pass

        if not groups:
            groups = {
                "少年团",
                "女声团",
                "混声团",
                "Dreamers",
                "童声2团",
                "童声3团",
                "启蒙1团",
                "启蒙2团",
                "启蒙3团",
                "启蒙4团",
                "启蒙5团",
                "启蒙6团",
            }

        for g in sorted(groups):
            cursor.execute(
                "INSERT INTO group_list (name, is_active, sort_order) VALUES (?, 1, 0) ON CONFLICT(name) DO NOTHING",
                (g,),
            )

    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully.")
