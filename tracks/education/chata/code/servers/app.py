from flask import Flask, request, jsonify
from flask_cors import CORS
from models import GPT2, GPT3, Llama
from utils import QA_Data

app = Flask(__name__)
CORS(app)

gpt2 = GPT2()
gpt3 = GPT3()
# llama = Llama()
qastore = QA_Data()

@app.route('/')
def index(): return "Hello World! This is the backend server."

# API endpoints for gpt2/3 & llama2, ask model depending on the model variable
@app.route('/ask-model', methods=['POST'])
def ask_model():
    model, message = request.json['model'], request.json['message']
    if model == "gpt2":
        response = gpt2.get_response(message)
        print("responded from gpt2")
    elif model == "gpt3":
        response = gpt3.ask_gpt(message)
        print("responded from gpt3")
    elif model == "llama2":
        response = "TODO" # llama.get_response(message)
        print("responded from llama2")
        pass
    
    qastore.add_to_db(model, message, response)
    return jsonify({'response': response})

# store user feedback to json
@app.route('/api/submit_feedback', methods=["POST"])
def submit_feedback():
    key, update_dict = request.json["key"], request.json["update_dict"]
    # {"label": "unhelpful", "edit": "new answer"}
    d = qastore.update_db(key, update_dict)
    print("updated feedback: ", d)
    return {"status": "ok"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
