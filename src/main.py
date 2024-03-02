from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from starlette.middleware.cors import CORSMiddleware

# from NER_model.en_pii_NER_onnx_model import NEROnnxModel
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
class RenderData(BaseModel):
    text: str
    ents: List
    title: None
class NERResponse(BaseModel):
    render_data: RenderData
class NERModelResponse(BaseModel):
    original: str
    name_entities: NERResponse

@app.get("/")
def get_root():
    return "This is the RESTful API for PrivacyDetection"

@app.post("/results", response_model=NERModelResponse)
async def predict(request: NERRequest):
    ner_text = NERResponse(render_data=ner_pipeline(request.text))
    return NERModelResponse(
        original=request.text,
        name_entities=ner_text
    )