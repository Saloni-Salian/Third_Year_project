from transformers import AutoTokenizer, pipeline
from optimum.onnxruntime import ORTModelForTokenClassification

class NEROnnxModel():
    def __call__(self, text: str) -> str:
        # load quantized model and tokenizers
        quantized_model = ORTModelForTokenClassification.from_pretrained("/Users/salonisalian/Desktop/University Files/Year 3/third_year_project/model-quantized")
        tokenizerdisq = AutoTokenizer.from_pretrained("/Users/salonisalian/Desktop/University Files/Year 3/third_year_project/model-quantized")

        # model_id='/Users/salonisalian/Desktop/University Files/Year 3/third_year_project/pii_onnx:/ner/model/model-quantized'
        # tokenizer_id='/Users/salonisalian/Desktop/University Files/Year 3/third_year_project/pii_onnx:'

        # tokenizer = AutoTokenizer.from_pretrained(tokenizer_id)
        # model = ORTModelForTokenClassification.from_pretrained(model_id)
        # tokenizer.model_input_names = ['input_ids', 'attention_mask']      
         
        #create transformers pipeline
        onnx_ner = pipeline("token-classification", model=quantized_model, tokenizer=tokenizerdisq, aggregation_strategy="first")
        # onnx_ner = pipeline("token-classification", model=model, tokenizer=tokenizer, aggregation_strategy="first")

        #run the pipeline and return the results
        pred = onnx_ner(text)
        pred = self.sanitise_data(text, pred)
        return pred
    
    def sanitise_data(self, text: str, entities: list) -> dict:
        return_entities=[]
        for entity in entities:
            santitise_entity={}
            santitise_entity['start'] = entity['start']
            santitise_entity['end'] = entity['end']
            santitise_entity['label'] = entity['entity_group']
            return_entities.append(santitise_entity)
        return {'text':text, 'ents':return_entities, 'title': None}
    
if __name__ == '__main__':
    text = "Jack Sparrow lives in New York!"
    pipe = NEROnnxModel()
    results = pipe(text)
    print(results)