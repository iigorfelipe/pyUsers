from django.shortcuts import render
from django.http import HttpResponse
from .models import Usuario

def home(request):
  if request.method == "GET":
    return render(request, 'home.html')
  else:
    nome = request.POST.get('nome')

    user = Usuario(
      nome=nome
    )

    user.save()
    
    return HttpResponse(nome)
