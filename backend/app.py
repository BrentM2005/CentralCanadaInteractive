from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__, static_folder='static')
CORS(app, resources={r"/api/*": {"origins": "*"}})

DB_PATH = os.getenv('DB_PATH', 'data.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row 
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS quiz_runs (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, score INTEGER, total INTEGER)''')
    c.execute('''CREATE TABLE IF NOT EXISTS quiz_answers (id INTEGER PRIMARY KEY AUTOINCREMENT, run_id INTEGER, q_index INTEGER, answer TEXT, is_correct BOOLEAN, is_written BOOLEAN)''')
    c.execute('''CREATE TABLE IF NOT EXISTS poll_runs (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS poll_answers (id INTEGER PRIMARY KEY AUTOINCREMENT, run_id INTEGER, q_index INTEGER, answer TEXT, is_written BOOLEAN)''')
    conn.commit()
    conn.close()

init_db()

@app.route('/api/submit-quiz', methods=['POST'])
def submit_quiz():
    data = request.json
    conn = get_db()
    c = conn.cursor()
    
    c.execute("INSERT INTO quiz_runs (name, score, total) VALUES (?, ?, ?)", (data['name'], data['score'], data['total']))
    run_id = c.lastrowid
    
    for ans in data['answers']:
        c.execute("INSERT INTO quiz_answers (run_id, q_index, answer, is_correct, is_written) VALUES (?, ?, ?, ?, ?)",
                  (run_id, ans['q_index'], ans['answer'], ans['is_correct'], ans['is_written']))
                  
    conn.commit()
    conn.close()
    return jsonify({"status": "success"})

@app.route('/api/submit-poll', methods=['POST'])
def submit_poll():
    data = request.json
    conn = get_db()
    c = conn.cursor()
    
    c.execute("INSERT INTO poll_runs (name) VALUES (?)", (data['name'],))
    run_id = c.lastrowid
    
    for ans in data['answers']:
        c.execute("INSERT INTO poll_answers (run_id, q_index, answer, is_written) VALUES (?, ?, ?, ?)",
                  (run_id, ans['q_index'], ans['answer'], ans['is_written']))
                  
    conn.commit()
    conn.close()
    return jsonify({"status": "success"})

@app.route('/api/reports/quiz', methods=['GET'])
def get_quiz_report():
    conn = get_db()
    c = conn.cursor()
    c.execute('''
        SELECT q_index, answer, is_correct, is_written, COUNT(*) as count 
        FROM quiz_answers 
        GROUP BY q_index, answer, is_correct, is_written
        ORDER BY q_index ASC, count DESC
    ''')
    rows = c.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

@app.route('/api/reports/poll', methods=['GET'])
def get_poll_report():
    conn = get_db()
    c = conn.cursor()
    c.execute('''
        SELECT q_index, answer, is_written, COUNT(*) as count 
        FROM poll_answers 
        GROUP BY q_index, answer, is_written
        ORDER BY q_index ASC, count DESC
    ''')
    rows = c.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)