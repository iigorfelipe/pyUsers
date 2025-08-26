from django.urls import path
from . import views

app_name = "usuarios"

urlpatterns = [
  path("", views.usuario_list_create, name="home"),
  path("usuario/<int:id>/atualizar/", views.atualizar_usuario, name="atualizar_usuario"),
  path("usuario/<int:id>/deletar/", views.deletar_usuario, name="deletar_usuario"),
]
