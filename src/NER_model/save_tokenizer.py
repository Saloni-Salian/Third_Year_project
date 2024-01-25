from transformers import AutoTokenizer

model_checkpoint = "elastic/distilbert-base-uncased-finetuned-conll03-english"
tokenizer = AutoTokenizer.from_pretrained(model_checkpoint)
tokenizer.save_pretrained("ner/tokenizer")