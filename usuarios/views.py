from django.shortcuts import render, redirect, get_object_or_404
from .models import Usuario
from .forms import UsuarioForm
from django.contrib import messages
from django.views.decorators.http import require_http_methods, require_POST
from django.db.models import Q

@require_http_methods(["GET", "POST"])
def usuario_list_create(request):
    if request.method == "POST":
        form = UsuarioForm(request.POST)
        if form.is_valid():
            try:
                form.save()
                messages.success(request, f"Usuário '{form.cleaned_data['nome']}' criado com sucesso.")
            except Exception:
                messages.error(request, "Email já cadastrado.")
        else:
            messages.error(request, "Preencha todos os campos corretamente.")
        return redirect("usuarios:home")

    query = request.GET.get("q", "").strip()
    usuarios = Usuario.objects.order_by("-criado_em")

    if query:
        usuarios = usuarios.filter(
            Q(nome__icontains=query) |
            Q(email__icontains=query) |
            Q(cidade__icontains=query) |
            Q(estado__icontains=query)
        )

    return render(request, "usuarios/usuarios.html", {"usuarios": usuarios, "q": query})


@require_POST
def deletar_usuario(request, id):
    usuario = get_object_or_404(Usuario, id=id)
    nome = usuario.nome
    usuario.delete()
    messages.success(request, f"Usuário '{nome}' removido.")
    return redirect("usuarios:home")


@require_POST
def atualizar_usuario(request, id):
    usuario = get_object_or_404(Usuario, id=id)
    form = UsuarioForm(request.POST, instance=usuario)
    if form.is_valid():
        try:
            form.save()
            messages.success(request, f"Usuário '{form.cleaned_data['nome']}' atualizado.")
        except Exception:
            messages.error(request, "Email já cadastrado.")
    else:
        messages.error(request, "Preencha todos os campos corretamente.")
    return redirect("usuarios:home")
