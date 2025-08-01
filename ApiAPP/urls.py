from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import  *
from ApiAPP import views

router = DefaultRouter()
router.register(r'productos', productos_stock)
router.register(r'menu_ejecutivo', menu_ejecutivo)
router.register(r'factura', factura)
router.register(r'alternativa',alternativa)

urlpatterns = [
    path('', include(router.urls)),
    path('api/descontar-stock/', descontar_stock, name='descontar_stock'),
    path('facturas/crear/', views.crear_factura, name='crear_factura'),
]