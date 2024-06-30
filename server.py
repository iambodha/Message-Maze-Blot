from fastapi import FastAPI
from fastapi.responses import JSONResponse
import uvicorn
import messagemaze as mm
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

@app.get("/getMaze")
async def get_maze(query: str):
    maze = mm.MessageSolutionPath(query).maze
    maze.generate_maze('rBFS')
    result = maze.export_maze()
    return JSONResponse(content={"result": result})

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
