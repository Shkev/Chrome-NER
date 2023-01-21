from django.urls import path

from . import views

app_name = 'ner'
urlpatterns = [
    path('tag/', views.tag_entities, name='tag_entities'),
]