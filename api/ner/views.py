from django.shortcuts import render
from django.http import JsonResponse

import spacy
import base64

# Create your views here.

def decode_base64(encoded_text: str) -> str:
    """Decode base64 encoded text and return decoded text as string."""
    return base64.b64decode(encoded_text).decode('utf-8')

def tag_entities(request, encoded_text: str) -> JsonResponse:
    """Tag entities in given text (given in base64 encoding) and return tagged entities in JSON."""
    text = decode_base64(encoded_text)
    nlp = spacy.load("en_core_web_sm")
    doc = nlp(text)
    entities = []
    for ent in doc.ents:
        entities.append({
            'text': ent.text,
            'label': ent.label_,
            'start': ent.start_char,
            'end': ent.end_char
        })
    return JsonResponse(entities, safe=False)