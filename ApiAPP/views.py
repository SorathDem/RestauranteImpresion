from rest_framework import viewsets
from rest_framework import status
import json
from .models import factura
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.views import Response
from .models import *
from .serializers import *
from escpos.printer import Usb
import usb.core
import usb.util
from datetime import datetime

class productos_stock(viewsets.ModelViewSet):
    queryset = productos.objects.all()
    serializer_class = productosSerialiazer

class menu_ejecutivo(viewsets.ModelViewSet):
    queryset = menu_ejecutivo.objects.all()
    serializer_class = menu_ejecutivoSerialiazer
    
class factura(viewsets.ModelViewSet):
    queryset = factura.objects.all()
    serializer_class = facturaSerialiazer
    
class alternativa(viewsets.ModelViewSet):
    queryset = alternativa.objects.all()
    serializer_class = alternativaSerialiazer
    
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            codigo = serializer.validated_data['codigo']
            try:
                user = CustomUser.objects.get(codigo=codigo)
                user_serializer = CustomUserSerializer(user)
                return Response(user_serializer.data, status=200)
            except CustomUser.DoesNotExist:
                return Response({"error":"Codigo Incorrecto"}, status=401)
        return Response(serializer.errors,status=400)

@csrf_exempt
def crear_factura(request):
    if request.method == 'POST':
        try:
            # Obtiene el cuerpo de la solicitud en formato JSON
            data = json.loads(request.body)
            print("Datos recibidos:", data)
            # Extrae los datos de la orden
            mesa = data.get('mesa')
            productos = data.get('productos')
            total = data.get('total')

            # Validación básica para asegurar que los datos no estén vacíos
            if not mesa or not productos or total is None:
                return JsonResponse({'error': 'Faltan datos obligatorios'}, status=400)

            # Crea y guarda el nuevo objeto factura en la base de datos
            # Asegúrate de que el nombre de la clase sea 'Factura'
            # y el nombre de la variable sea 'nueva_factura'
            nueva_factura = factura.objects.create(
                mesa=mesa,
                productos=productos,
                total=total
            )

            return JsonResponse({
                'id': nueva_factura.id,
                'mesa': nueva_factura.mesa,
                'total': nueva_factura.total
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Formato de JSON inválido'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Método no permitido'}, status=405)
    
@api_view(['POST'])
def descontar_stock(request):
    productos_lista = request.data.get('productos', [])

    for item in productos_lista:
        try:
            prod = productos.objects.get(id=item['id'])
            cantidad_a_descontar = int(item.get('cantidad', 0))
            prod.cantidad -= cantidad_a_descontar
            prod.save()
        except productos_lista.DoesNotExist:
            continue  

    return Response({'success': True})
    
class OrdenAPIView(APIView):
    def post(self, request):
        pedido = request.data.get('productos', [])
        mesaInput = request.data.get('mesa', 'No especificada')
        print("✅ Solicitud POST recibida:", request.data)

        try:
            print("Intentando inicializar la impresora...")
           
            dev = usb.core.find(idVendor=0x0FE6, idProduct=0x811E)

            if dev is None:
                raise ValueError("Dispositivo no encontrado")

            
            dev.set_configuration()
            cfg = dev.get_active_configuration()

            interface_number = 0
            iface = usb.util.find_descriptor(cfg, bInterfaceNumber=interface_number)

            if iface is None:
                raise ValueError(f"Interfaz {interface_number} no encontrada")

            usb.util.claim_interface(dev, interface_number)
            print("Impresora inicializada con éxito")

            commands = []
            commands.append('\x1D\x21\x00') 
            commands.append('\x1B\x61\x01') 
            commands.append('\x1D\x21\x00')
            commands.append('FACTURA\n')
            commands.append('\x1D\x21\x00') 
            commands.append(datetime.now().strftime("%Y-%m-%d %H:%M:%S") + '\n')
            commands.append('--------------------------------\n')

            total = 0
            commands.append(f"Mesa: {mesaInput}\n\n")
            for item in pedido:
                nombre = f"{item.get('nombre', '')} x{item.get('cantidad', 1)}"[:20].ljust(20)
                cantidad = int(item.get('cantidad', 1))
                precio = float(item.get('precio', 0))
                subtotal = precio * cantidad
                total += subtotal 

                nombre_cantidad = f"{nombre}"
                linea = f"{nombre_cantidad[:20].ljust(20)} ${str(precio).rjust(6)}"
                commands.append(linea + '\n')

            commands.append('--------------------------------\n')
            commands.append('\x1D\x21\x00')  
            commands.append(f"{'TOTAL'.ljust(20)} ${str(round(total, 2)).rjust(6)}\n")
            commands.append('\x1B\x21\x00')

            
            commands.append('\x1B\x61\x01') 
            commands.append('Gracias por su pedido\n')
            commands.append('\x1D\x56\x41\x02') 

            commands_bytes = ''.join(commands).encode('ascii')

            print("Enviando datos a la impresora...")
            endpoint_out = usb.util.find_descriptor(
                iface,
                custom_match=lambda e: usb.util.endpoint_direction(e.bEndpointAddress) == usb.util.ENDPOINT_OUT
            )

            if endpoint_out is None:
                raise ValueError("No se encontró un endpoint de salida (OUT) en la interfaz")

            
            dev.write(endpoint_out.bEndpointAddress, commands_bytes) 
            print("🖨️ Orden enviada a la impresora")

           
            usb.util.release_interface(dev, interface_number)
            usb.util.dispose_resources(dev)
            
            imprimir_en_segunda_impresora(pedido, mesaInput)

            return Response({'mensaje': 'Orden recibida e impresa'}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print("⚠️ Error al imprimir:", e)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def imprimir_en_segunda_impresora(pedido,mesaInput):
    try:
        devices = list(usb.core.find(idVendor=0x0FE6, idProduct=0x811E, find_all=True))
        if len(devices) < 2:
            raise ValueError("No se encontraron dos impresoras conectadas")

        segunda_impresora = devices[1] 
        segunda_impresora.set_configuration()
        cfg = segunda_impresora.get_active_configuration()
        iface = usb.util.find_descriptor(cfg, bInterfaceNumber=0)
        usb.util.claim_interface(segunda_impresora, 0)

        endpoint_out = usb.util.find_descriptor(
            iface,
            custom_match=lambda e: usb.util.endpoint_direction(e.bEndpointAddress) == usb.util.ENDPOINT_OUT
        )
        if endpoint_out is None:
            raise ValueError("No se encontró endpoint OUT")

        
        commands = []
        commands.append('\x1B\x40')  
        commands.append('\x1B\x61\x01') 
        commands.append('\x1D\x21\x00')
        commands.append('ORDEN COCINA\n')
        commands.append('\x1B\x61\x00')
        commands.append('--------------------------------\n')
        
        commands.append(f"Mesa: {mesaInput}\n\n")
        
            
        for item in pedido:
            tipo = item.get('tipo', '')
            nombre = item.get('nombre')
            cantidad = int(item.get('cantidad', 1))
            rec = item.get('recomendaciones', '')
            
            if tipo:
                commands.append(f"{tipo}\n")
            
            commands.append(f"- {nombre} x{cantidad}\n")
        
            if rec:
                commands.append(f"{rec}\n")
                
            commands.append('--------------------------------\n')
            

        commands.append('\x1B\x61\x01')
        commands.append('\x1D\x56\x41\x02')  

        commands_bytes = ''.join(commands).encode('ascii')
        segunda_impresora.write(endpoint_out.bEndpointAddress, commands_bytes)

        usb.util.release_interface(segunda_impresora, 0)
        usb.util.dispose_resources(segunda_impresora)
        print("🖨️ Impreso en segunda impresora con éxito")

    except Exception as e:
        print("⚠️ Error en segunda impresora:", e)
        
