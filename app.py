from flask import Flask, render_template, request, jsonify
import json
import os
import re

app = Flask(__name__)

# Load data
with open("data.json", "r") as f:
    DATA = json.load(f)

def detect_year(text):
    match = re.search(r"\b(1|2)\b", text)
    return match.group(1) if match else None

def detect_branch(text):
    text = text.upper()
    for branch in ["CSE", "CIVIL", "ECE", "EEE", "ME", "AIML"]:
        if branch in text:
            return branch
    return None

def detect_need(text):
    text = text.lower()
    if "syllabus" in text:
        return "syllabus"
    if "faculty" in text or "staff" in text or "teacher" in text:
        return "faculty"
    return None

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    msg = request.json.get("message", "")
    year = request.json.get("year")
    branch = request.json.get("branch")

    y = detect_year(msg)
    b = detect_branch(msg)
    n = detect_need(msg)

    if y:
        year = y
    if b:
        branch = b

    if not year:
        return jsonify(reply="Which year you are in? (1 or 2)", year=None, branch=branch)

    if not branch:
        return jsonify(reply="Which branch you are in? (CSE, CIVIL, ECE, EEE, ME)", year=year, branch=None)

    if not n:
        return jsonify(reply="What do you need? (Syllabus / Faculty)", year=year, branch=branch)

    link = DATA.get(year, {}).get(branch, {}).get(n)

    if link:
        return jsonify(
            reply=f"Here is the {n.capitalize()} PDF for {branch}, {year} year:\n{link}",
            year=year,
            branch=branch
        )

    return jsonify(reply="Sorry, this document is not available.", year=year, branch=branch)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
