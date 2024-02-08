python3 -m transformers.onnx --model=elastic/distilbert-base-uncased-finetuned-conll03-english --feature=token-classification models/ner/model
# python3 quantize_ner_onnx.py