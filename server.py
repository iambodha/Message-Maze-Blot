from fastapi import FastAPI
from fastapi.responses import JSONResponse
import uvicorn
import messagemaze as mm

app = FastAPI()

@app.get("/getMaze")
async def get_maze(query: str):
    maze = mm.MessageSolutionPath(query).maze
    maze.generate_maze('rBFS')
    result = maze.export_maze()
    return JSONResponse(content={"result": result})

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)