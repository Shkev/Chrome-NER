from django.urls import path

from . import views

app_name = 'ner'
urlpatterns = [
    path('tag/<str:encoded_text>', views.tag_entities, name='tag_entities'),
]