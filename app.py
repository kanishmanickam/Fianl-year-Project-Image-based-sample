from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3, os, uuid
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH  = os.path.join(BASE_DIR, "submissions.db")
IMG_DIR  = os.path.join(BASE_DIR, "images")

app = Flask(__name__, static_folder="static", static_url_path="/static")
CORS(app)

VALID_IDS = {f"IMG_{i:02d}" for i in range(1, 13)}

# ── DB init ────────────────────────────────────────────────────────────────────
def init_db():
    con = sqlite3.connect(DB_PATH)
    con.execute("""
        CREATE TABLE IF NOT EXISTS image_submissions (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id      TEXT,
            question_id     TEXT NOT NULL,
            selected_option TEXT NOT NULL,
            created_at      TEXT DEFAULT (datetime('now'))
        )
    """)
    con.commit()
    con.close()

init_db()

# ── Routes ─────────────────────────────────────────────────────────────────────
@app.route("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")

@app.route("/images/<path:filename>")
def serve_image(filename):
    return send_from_directory(IMG_DIR, filename)

@app.route("/api/image-submissions", methods=["POST"])
def submit():
    data = request.get_json(force=True)
    session_id = data.get("session_id") or str(uuid.uuid4())
    answers    = data.get("answers", [])

    for item in answers:
        qid = item.get("question_id", "")
        opt = item.get("selected_option", "")
        if qid not in VALID_IDS:
            return jsonify({"error": f"Unknown question_id: {qid}"}), 422
        if opt not in ("A", "B"):
            return jsonify({"error": f"Invalid selected_option: {opt}"}), 422

    con = sqlite3.connect(DB_PATH)
    for item in answers:
        con.execute(
            "INSERT INTO image_submissions (session_id, question_id, selected_option) VALUES (?,?,?)",
            (session_id, item["question_id"], item["selected_option"])
        )
    con.commit()
    con.close()
    return jsonify({"status": "ok", "saved": len(answers), "session_id": session_id}), 201

if __name__ == "__main__":
    print("\nCyberRisk Image-Based Questionnaire")
    print("   Running at: http://127.0.0.1:5000\n")
    app.run(debug=True, port=5000)
