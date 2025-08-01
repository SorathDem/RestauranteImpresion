from rest_framework import serializers
from .models import *

class productosSerialiazer(serializers.ModelSerializer):
    class Meta:
        model = productos
        fields = '__all__'
        
class menu_ejecutivoSerialiazer(serializers.ModelSerializer):
    class Meta:
        model = menu_ejecutivo
        fields = '__all__'

class facturaSerialiazer(serializers.ModelSerializer):
    class Meta:
        model = factura
        fields = '__all__' 

class alternativaSerialiazer(serializers.ModelSerializer):
    class Meta:
        model = alternativa
        fields = '__all__'      
        
class LoginSerializer(serializers.Serializer):
    codigo = serializers.CharField()
    
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'