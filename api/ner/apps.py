from django.apps import AppConfig

import spacy

class NerConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "ner"
    def ready(self) -> None:
        spacy.load("en_core_web_sm")
