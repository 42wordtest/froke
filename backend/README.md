# froke Backend

FastAPI backend for froke.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 9090
```

Use `--host 0.0.0.0` when running the frontend from a physical phone.

Run tests:

```bash
pytest
```
