from django.apps import AppConfig

import spacy

class NerConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "ner"