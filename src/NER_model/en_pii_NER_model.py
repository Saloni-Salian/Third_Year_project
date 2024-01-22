from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
from spacy.displacy import render
from typing import List

class NERModel:
    '''
    Load the pii model that is based on distilbert and run the pipeline
    '''
    def __init__(self) -> None:
        self.model_checkpoint = "beki/en_spacy_pii_distilbert"
        self.torch_device = "cpu"
        print(f"Loading the {model_checkpoint} tokenizer and model...")
        self.tokenizer = AutoTokenizer.from_pretrained(model_checkpoint)
        self.model = AutoModelForTokenClassification.from_pretrained(model_checkpoint)
        self.id2label = self.model.config.id2label
        print("Model loaded!")
    
    def ner_pipeline(self, query: str) -> List[dict]:
        '''
        Build ner pipeline and output parsed model output
        :param query: query to pass to the model
        '''
        pipe = pipeline(model=self.model_checkpoint, tokenizer=self.tokenizer, task='ner',
            aggregation_strategy="simple")
        return pipe(query)

    def render_ner_results_html(self, query: str) -> None:
        """
        Visualize NER results using SpaCy render
        :param query: query to pass to the model
        """
        model_outputs = self.ner_pipeline(query)
        entities = []
        for model_output in model_outputs:
            entry = {}
            entry['start'] = model_output['start']
            entry['end'] = model_output['end']
            entry['label'] = model_output['entity_group']
            entities.append(entry)
        render_data = [{'text': query, 'ents': entities, 'title': None}]
        render(render_data, style="ent", manual=True, jupyter=True)

if __name__ == "__main__":
    query = "Jack Sparrow lives in New York!"
    model = NERModel()
    results = model.ner_pipeline(query)
    print(results)