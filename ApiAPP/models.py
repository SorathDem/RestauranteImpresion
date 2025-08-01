from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
# Create your models here.


class productos(models.Model):
    categoria = models.CharField(max_length=200, blank=False)
    nombre = models.CharField(max_length=200, blank=False)
    descripcion = models.CharField(max_length=200, blank=False)
    precio_carta = models.IntegerField(max_length=10, blank=False)
    cantidad = models.IntegerField(max_length=200)
    alternativa = models.BooleanField(blank=False)
    
    # class Meta:
    #     abstract = True
    
class menu_ejecutivo(models.Model):
    fecha = models.DateTimeField(auto_now_add=True, blank=False)
    tipo = models.CharField(max_length=200, default="Ejecutivo")
    sopa =  models.CharField(max_length=200, )
    plato_principal = models.CharField(max_length=200)
    jugo =  models.CharField(max_length=200, )
    precio = models.IntegerField(max_length=10)
    # precio_alternativo = models.IntegerField(default=0)
    
class alternativa(models.Model):
    fecha = models.DateTimeField(auto_now_add=True, blank=False)
    tipo = models.CharField(max_length=200, blank=False, default="Alternativa")
    sopa =  models.CharField(max_length=200, blank=False)
    plato_alternativa = models.CharField(max_length=200, blank=False)
    jugo =  models.CharField(max_length=200, blank=False)
    precio_alternativo = models.IntegerField(default=0)
    
# class alternativas(models.model, menu_ejecutivo):
#     nombre = models.CharField(max_length=200, blank=False)
#     cantidad = models.IntegerField(max_length=200)
#     precio_alt = models.DecimalField(max_digits=10, decimal_places=5, blank=False)
      
class factura(models.Model):
    fecha = models.DateTimeField(auto_now_add=True, blank=False)
    productos = models.JSONField()
    mesa = models.IntegerField(blank=False)
    total = models.IntegerField(blank= False)

    def __str__(self):
        return f"Factura de la mesa {self.mesa}"
    
class CustomUser(models.Model):
    codigo = models.CharField(max_length=10, unique=True)
    ROL = [
        ('mesero','Mesero'),
        ('admin','Administrador'),
    ]
    rol = models.CharField(max_length=10, choices=ROL)
    
    def __str__(self):
        return f"{self.codigo}({self.rol})"