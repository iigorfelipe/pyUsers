from django.db import models

class Usuario(models.Model):
    nome = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    estado = models.CharField(max_length=2)
    cidade = models.CharField(max_length=150)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nome} <{self.email}>"

    @property
    def cidade_estado(self):
        return f"{self.cidade}-{self.estado}"
