from fastapi.testclient import TestClient

from main import app
from NER_model.pii_model import NEROnnxModel

client = TestClient(app)

def test_get_root():
    '''
    Test if a correct GET request returns 200
    '''
    response = client.get("/")
    assert response.status_code == 200

def test_predict_input_ok():
    '''
    Test if a correct POST request returns 200
    '''
    response = client.post("/results", json={"text":'I live in London.'})
    assert response.status_code == 200

def test_predict_input_not_ok():
    '''
    Test if an incorrect POST request returns 422 for an incorrect request format
    '''
    response = client.post("/results", json={"bad input":'I live in London.'})
    assert response.status_code == 422

def test_return_values():
    '''
    Test if the sanitise_data function returns the entities in the correct format
    '''
    model = NEROnnxModel()
    text = 'I live in London.'
    check_value = {'text': text , 'ents': [{'start': 10, 'end': 16, 'label': 'LOC'}], 'title': None}
    result = model.sanitise_data(text=text, entities=[{'entity_group': 'LOC', 'score': 0.9999999, 'word': 'london', 'start': 10, 'end': 16}])
    assert result == check_value