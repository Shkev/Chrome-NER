from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

import spacy

nlp = spacy.load("en_core_web_trf") # change to "en_core_web_sm" if too slow

# Create your views here.

@csrf_exempt
def tag_entities(request) -> JsonResponse:
    """Tag entities in given text (given in base64 encoding) and return tagged entities in JSON."""
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)
    
    text = request.body.decode('utf-8')
    # print(text)
    doc = nlp(text)
    entities = []
    for ent in doc.ents:
        entities.append({
            'text': ent.text,
            'label': ent.label_,
            'start': ent.start_char,
            'end': ent.end_char
        })
    response = JsonResponse(entities, safe=False)
    return response