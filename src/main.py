from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict
from starlette.middleware.cors import CORSMiddleware

from .NER_model.en_pii_NER_model import NEROnnxModel

# load distilbert NER model
print('Loading distilbert NER model & tokenizer...')
ner_pipeline = NEROnnxModel()
print('distilbert NER model & tokenizer loaded!')

app = FastAPI()

# allow CORS requests from any host so that the JavaScript can communicate with the server
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)

class Request(BaseModel):
    text: str    
class EntityData(BaseModel):
    start: int
    end: int
    label: str
class RenderData(BaseModel):
    text: str
    ents: List[EntityData]
    title: None
class NERResponse(BaseModel):
    render_data: RenderData
class NERModelResponse(BaseModel):
    original: str
    name_entities: NERResponse

@app.get("/")
def get_root():
    return "This is the RESTful API for PrivacyDetection"

@app.post("/predict", response_model=NERModelResponse)
async def predict(request: Request):
    ner_text = NERResponse(render_data=ner_pipeline(request.text))
    return NERModelResponse(
        original=request.text,
        name_entities=ner_text
    )