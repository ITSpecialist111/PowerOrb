from fastapi import FastAPI
from fastapi.responses import FileResponse
import os

app = FastAPI(title="Power Orb")

BASE_DIR = os.path.dirname(__file__)
INDEX = os.path.join(BASE_DIR, "..", "www", "index.html")

@app.get("/", include_in_schema=False)
async def root():
    return FileResponse(INDEX)
