import requests
from flask import Flask, jsonify, request
from scholarly import scholarly


app = Flask(__name__)


def _json_safe(obj):
    if isinstance(obj, dict):
        return {str(k): _json_safe(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple)):
        return [_json_safe(x) for x in obj]
    if isinstance(obj, (str, int, float, bool)) or obj is None:
        return obj
    return str(obj)


def _get_q():
    q = request.args.get("q")
    if q is None or (isinstance(q, str) and not q.strip()):
        body = request.get_json(silent=True) or {}
        q = body.get("q")
    return q


@app.get("/search")
def search():
    q = _get_q()
    if not isinstance(q, str) or not q.strip():
        return jsonify({"error": 'Parameter "q" is required (query string or JSON body).'}), 400

    q = q.strip()
    print(q)

    params = {
        "engine": "google_scholar",
        "q": q,
        "api_key": "3b00b2e1ae43ffaac2a73063a68f9edde49a0d9562021fe72982aa2c9a264e0a",
    }

    response = requests.get("https://serpapi.com/search", params=params, timeout=60)
    response.raise_for_status()
    data = response.json()

    authors = data["profiles"]["authors"]




    out = [
        {"authors": authors},
    ]
    return jsonify(out), 200


if __name__ == "__main__":
    app.run(debug=True)
