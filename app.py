from flask import Flask, render_template, request, jsonify
import json
import re

app = Flask(__name__)

with open("data.json", "r") as f:
    DATA = json.load(f)

def detect_year(text):
    match = re.search(r'(1|2|3|4)', text)
    return match.group(1) if match else None

def detect_need(text):
    text = text.lower()
    if "syllabus" in text:
        return "syllabus"
    if "curriculum" in text:
        return "curriculum"
    if "faculty" in text or "teacher" in text:
        return "faculty"
    return None

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    message = request.json.get("message", "")
    year = request.json.get("year")

    found_year = detect_year(message)
    if found_year:
        year = found_year

    need = detect_need(message)

    if not year:
        return jsonify({
            "reply": "Please tell me which year you are in (1–4).",
            "year": None
        })

    if not need:
        return jsonify({
            "reply": "What do you need? (Curriculum / Syllabus / Faculty)",
            "year": year
        })

    link = DATA.get(year, {}).get(need)

    if link:
        return jsonify({
            "reply": f"Here is the {need} PDF for {year} year:\n{link}",
            "year": year
        })

    return jsonify({
        "reply": "Sorry, that document is not available.",
        "year": year
    })

if __name__ == "__main__":
    app.run()
