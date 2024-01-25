from onnxruntime.quantization import quantize_dynamic, QuantType

model_input = "ner/model/model.onnx"
model_output = "ner/model/model_quant.onnx"
quantize_dynamic(model_input, model_output, weight_type=QuantType.QInt8)