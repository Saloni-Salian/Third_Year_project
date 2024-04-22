from fastapi.testclient import TestClient

from main import app
from NER_model.pii_model import NEROnnxModel

client = TestClient(app)

def test_get_root():
    response = client.get("/")
    assert response.status_code == 200

def test_predict_input_ok():
    response = client.post("/results", json={"text":'I live in London.'})
    assert response.status_code == 200

def test_predict_input_not_ok():
    response = client.post("/results", json={"bad input":'I live in London.'})
    assert response.status_code == 422

def test_return_values():
    model = NEROnnxModel()
    text = 'I live in London.'
    check_value = {'text': text , 'ents': [{'start': 10, 'end': 16, 'label': 'LOC'}], 'title': None}
    result = model.sanitise_data(text=text, entities=[{'entity_group': 'LOC', 'score': 0.9999999, 'word': 'london', 'start': 10, 'end': 16}])
    assert result == check_value