from django.shortcuts import render, redirect, get_object_or_404
from .models import Aluno
from django.http import HttpResponse

# Create your views here.
def criar_aluno(request):
  if request.method == "GET":
    alunos = Aluno.objects.all()
    return render(request, 'criar_alunos.html', { 'alunos': alunos})
  elif request.method == "POST":
    nome = request.POST.get("nome")
    email = request.POST.get("email")

  aluno = Aluno(
    nome=nome,
    email=email,
  )

  aluno.save()

  return redirect('criar_aluno')

def deletar_aluno(request, id):
  aluno = get_object_or_404(Aluno, id=id)

  aluno.delete()

  return redirect('criar_aluno')

def atualizar_aluno(request, id):
  new_nome = request.POST.get("nome")
  new_email = request.POST.get("email")
   
  aluno = get_object_or_404(Aluno, id=id)

  aluno.nome = new_nome
  aluno.email = new_email

  aluno.save()
  

  return redirect('criar_aluno')