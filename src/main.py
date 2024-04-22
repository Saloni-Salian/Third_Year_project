import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from starlette.middleware.cors import CORSMiddleware

from NER_model.pii_model import NEROnnxModel

# load distilbert NER model
ner_pipeline = NEROnnxModel()
print('The distilbert NER model & tokenizer sucessfully loaded!')

app = FastAPI()

# allow CORS requests from any host so that the JavaScript can communicate with the server
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)

class NERRequest(BaseModel):
    text: str   
class DataKeys(BaseModel):
    text: str
    ents: List
    title: None
class NERData(BaseModel):
    data_keys: DataKeys
class NERResponse(BaseModel):
    original: str
    name_entities: NERData

@app.get("/")
def get_root():
    return "This is the RESTful API for PrivacyDetection"

@app.post("/results", response_model=NERResponse)
async def predict(request: NERRequest):
    ner_text = NERData(data_keys=ner_pipeline(request.text))
    return NERResponse(
        original=request.text,
        name_entities=ner_text
    )

if __name__ == "__main__":
    uvicorn.run(app, host='0.0.0.0', port = 8000)