from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from usuarios.models import Usuario

class UsuarioSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8

    def items(self):
        return Usuario.objects.all()

    def lastmod(self, obj):
        return obj.atualizado_em

    def location(self, obj):
        return reverse('usuarios:home')
