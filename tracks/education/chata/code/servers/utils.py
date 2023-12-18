import os
import json
from hashlib import sha256
import random
# from pathlib import Path

def write_to_json(json_obj, file='dump_data.json'):
    # p = Path(directory)
    # p.mkdir(parents=True, exist_ok=True)
    if not os.path.exists(file): # create file not exist and write empty list
        with open(file , 'w+') as f:
            json.dump([], f)
    with open(file) as f:
        json_list = json.load(f)
        json_list.append(json_obj) # need to be not a dict
    with open(file, 'w') as f:
        json.dump(json_list, f, separators=(',', ': '), indent=4)

class QA_Data():
    def __init__(self, file='qa_data.json'):
        self.file = file
        self.qas = dict()
    
    def __len__(self):
        if len(self.qas) == 0:
            self.get_qas()
        return len(self.qas)
    
    def __repr__(self):
        return f"Total {len(self)} qa-pais."

    def retrieve_answer(self, q):
        if len(self.qas) == 0:
            self.get_qas()
        for k, d in self.qas.items():
            if d["question"] == q:
                return d["answer"]
        return None
    
    def get_random_qa(self):
        if len(self.qas) == 0:
            self.get_qas()
        k = random.choice(list(self.qas.keys()))
        d = self.qas[k]
        return k, d
    
    def hash_qa(self, model, q, a):
        return sha256(model.encode()+q.encode()+a.encode()).hexdigest()
    
    def get_qas(self):
        with open(self.file, "r") as f:
            data = json.load(f)
            for _, d in enumerate(data):
                k = self.hash_qa(d["model"], d["question"], d["answer"])
                d["hash"] = k
                self.qas[k] = d
        return self.qas

    def add_to_db(self, model, q, a):
        k = self.hash_qa(model, q, a)
        d = {"hash": k, "model": model, "question": q, "answer": a}
        self.qas[k] = d
        write_to_json(d, self.file)
        return k

    # incorrect/unhelpful/great vs. accept/reject vs. -1/0/1?
    def update_db(self, k, update_dict):
        d = self.qas[k]
        # update_dict = {"label": "unhelpful", "edit": "new answer"}
        d.update(update_dict)
        self.qas[k] = d
        write_to_json(d, 'label_qa.json')
        return d