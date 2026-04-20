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

    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully.")
