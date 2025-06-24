import sys
import json
from transformers import pipeline

# Initialize the summarization pipeline
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_text(text, sentence_count=3):
    # Estimate the desired summary length (approximate sentence count)
    min_length = sentence_count * 10  # Roughly 10 words per sentence
    max_length = sentence_count * 20  # Roughly 20 words per sentence
    summary = summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)
    return summary[0]["summary_text"]

if __name__ == "__main__":
    # Read input from stdin
    input_data = sys.stdin.read()
    data = json.loads(input_data)
    text = data.get("text", "")

    # Summarize the text
    try:
        summary = summarize_text(text, sentence_count=3)
        result = {"summary": summary}
    except Exception as e:
        result = {"error": str(e)}

    # Output the result as JSON
    print(json.dumps(result))