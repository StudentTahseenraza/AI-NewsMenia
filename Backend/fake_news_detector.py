from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)
classifier = pipeline("text-classification", model="distilbert-base-uncased-finetuned-sst-2-english")

@app.route("/detect-fake-news", methods=["POST"])
def detect_fake_news():
    data = request.json
    text = data.get("text", "")
    result = classifier(text)
    label = "Fake" if result[0]["label"] == "NEGATIVE" else "Real"
    return jsonify({"label": label, "confidence": result[0]["score"]})

if __name__ == "__main__":
    app.run(debug=True, port=5000)