from fastapi import FastAPI
from fastapi.responses import FileResponse
import os, pathlib

BASE = pathlib.Path(__file__).parent.parent
app  = FastAPI(title="Power Orb")

@app.get("/", include_in_schema=False)
async def index():
    return FileResponse(BASE / "www" / "index.html")
