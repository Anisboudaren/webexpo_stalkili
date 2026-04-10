import requests
from flask import Flask, jsonify, request
from scholarly import scholarly
from urllib.parse import parse_qs, urlparse


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


def _scholar_id_from_serp_author(author):
    if not isinstance(author, dict):
        return None
    aid = author.get("author_id")
    if isinstance(aid, str) and aid.strip():
        return aid.strip()
    for key in ("link", "serpapi_link"):
        link = author.get(key)
        if not isinstance(link, str) or not link.strip():
            continue
        qs = parse_qs(urlparse(link.strip()).query)
        for param in ("user", "author_id"):
            vals = qs.get(param)
            if vals and vals[0]:
                return vals[0].strip()
    return None


def _scholarly_details_for_id(author_id):
    """Match test.py: search_author_id, fill, then fields that were printed."""
    filled = scholarly.search_author_id(author_id)
    filled = scholarly.fill(filled)
    return {
        "name": filled.get("name"),
        "url_picture": filled.get("url_picture"),
        "interests": filled.get("interests"),
        "citedby": filled.get("citedby"),
        "scholar_id": filled.get("scholar_id"),
        "affiliation": filled.get("affiliation"),
        "hindex": filled.get("hindex"),
    }


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

    scholarly_by_author = []
    for author in authors:
        sid = _scholar_id_from_serp_author(author)
        if not sid:
            scholarly_by_author.append(
                {
                    "author_id_used": None,
                    "error": "Could not determine Google Scholar author id from SerpAPI profile.",
                    "scholarly": None,
                }
            )
            continue
        try:
            scholarly_by_author.append(
                {
                    "author_id_used": sid,
                    "error": None,
                    "scholarly": _scholarly_details_for_id(sid),
                }
            )
        except Exception as e:
            scholarly_by_author.append(
                {
                    "author_id_used": sid,
                    "error": str(e),
                    "scholarly": None,
                }
            )
    print(scholarly_by_author)
    out = [
        {
            "authors": authors,
            "scholarly_by_author": scholarly_by_author,
        },
    ]
    return jsonify(_json_safe(out)), 200


if __name__ == "__main__":
    app.run(debug=True)
