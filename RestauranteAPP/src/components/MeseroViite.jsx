import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getProducts } from "../api/products";
import {createMenuEjecutivo} from "../api/menu_dia";

export default function mesero() {

    const handleEnviarOrden = async () => {

    const datosAEnviar = {
        mesa:mesaInput,
        productos: pedido.map(item => ({
        tipo: item.tipo || '',
        nombre: (item.nombre||item.plato_principal),
        id: item.id,
        cantidad: item.cantidad,
        precio: (item.precio || item.precio_carta),
        recomendaciones: item.recomendaciones,
        })),
        total: pedido.reduce((acc, p) => acc + (p.precio || p.precio_carta) * p.cantidad, 0)
    };

    try {
        const response = await fetch('http://localhost:8000/api/orden/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosAEnviar),
        });

        if (response.ok) {
        alert('Orden enviada con éxito');

        const stockResponse = await fetch('http://localhost:8000/api/descontar-stock/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productos: datosAEnviar.productos }),
            });
            if (stockResponse.ok) {
                console.log("error al descontar")
            }

            const cajaResponse = await fetch('http://localhost:8000/api/factura/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosAEnviar),
            });

            if (cajaResponse.ok) {
                alert('Orden enviada y registrada en caja con éxito');
            }

            setMesaInput('');
            setPedido([]);

        } else {
        const errorData = await response.json();
        console.error('Error desde el servidor:', errorData);
        alert('Error al enviar la orden');
        }
    } catch (error) {
        console.error('Error al enviar:', error);
        alert('Error en el servidor');
    }
    };
    

    const [mesaInput, setMesaInput] = useState("");

    const navigate = useNavigate();

    const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    };

  const [menu_dia, setMesero] = useState([])


  const loadPedido = async () => {
    const response = await createMenuEjecutivo();
    setMesero(response.data);
  };

  const[products, setProducts] = useState([])

    const loadProducts = async() =>{
        const response  = await getProducts()
        setProducts(response.data)
    }


    const [searchQuery, setSearchQuery] = useState("");

// Filtro para los productos de la carta
const filteredProducts = products.filter(
    (product) =>
        product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.categoria.toLowerCase().includes(searchQuery.toLowerCase())
);

// Filtro para el menú ejecutivo
const filteredMenu = menu_dia.filter(
    (menu) =>
        menu.tipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        menu.sopa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        menu.plato_principal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        menu.jugo.toLowerCase().includes(searchQuery.toLowerCase())
);

    const productosAlternativos = products.filter(p =>
        p.nombre && p.nombre.toLowerCase().includes("alternativa-res")
    )

    const [mostrarAlternativasId, setMostrarAlternativasId] = useState(null);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);




    const [pedido, setPedido] = useState([])

    const agregarPedido = (item) =>{
        setPedido((prevPedido) => [...prevPedido, {...item, cantidad:1}])
    }
    
useEffect(() =>{
    loadPedido();
    loadProducts();
})

  return (
<div>
    <div>
          <button className="bg-amber-100 text-black px-4 py-2 rounded-lg" 
          onClick={handleLogout}>Cerrar sesión</button>
    </div>
    <h1 className="text-3xl font-bold">Pedidos</h1>
    <input
        type="text"
        placeholder="Buscar por nombre o categoría..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full mt-3 p-2 mb-5 border border-gray-300 rounded text-black"
        />
      <h1 className="text-3xl font-bold">Menu ejecutivo</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 mt-5  gap-5 text-white">
        {filteredMenu.map((menu => (
          <div key={menu.id} className="bg-sky-900 p-4 rounded-lg shadow-md">
            <p><span className="fond-bold"></span>{menu.tipo}</p>
            <p><span className="fond-bold">Sopa: </span>{menu.sopa}</p>
            <p><span className="fond-bold">Plato Principal: </span>{menu.plato_principal}</p>
            <p><span className="fond-bold">jugo: </span>{menu.jugo}</p>
            <p><span className="fond-bold">Precio: </span>{menu.precio}</p>
            <div className="mt-2">
            <button 
              onClick={() => agregarPedido(menu)}
              className="bg-green-600 text-white px-2 py-1 rounded-lg">
                agregar
            </button>
            <button
                onClick={() => setMostrarAlternativasId(menu.id)}
                className="bg-green-950 text-white px-2 py-1 rounded-lg ml-2">
                alternativa
            </button>
            {mostrarAlternativasId === menu.id && (
                <div className="mt-2">
                <select
                className="text-black p-1 rounded"
                onChange={(e) => {
                    const idSeleccionado = e.target.value;
                    const prod = productosAlternativos.find(
                    (p) => p.id === parseInt(idSeleccionado)
                    );
                    setProductoSeleccionado(prod);
                }}
                    >
                    <option value="">Selecciona</option>

                        {productosAlternativos.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.nombre}
                        </option>
                        ))}
                    </select>

                    <button
                    onClick={() => {
                        if (productoSeleccionado) {
                        const productoConTipo = {
                            ...productoSeleccionado,
                            tipo: 'Alternativa',
                        };
                        agregarPedido(productoConTipo);
                        setMostrarAlternativasId(null);
                        setProductoSeleccionado(null);
                        }
                    }}
                    className="bg-green-700 text-white px-2 py-1 rounded-lg ml-2"
                    >
                    Seleccionar
                    </button>
                </div>
                )}
            </div>
          </div>
        )))}
      </div>

        <div className='mt.8'>
        <h1 className='text-3xl font-bold'>Carta</h1>
        <div className='grid grid-cols-1 md:grid-cols-3 mt-5  gap-5 text-white'>
            {filteredProducts.map((product => (
                <div key={product.id} className='bg-sky-900 p-4 rounded-lg shadow'>
                    <p><span className='font-bold'>Categoria: </span>{product.categoria}</p>
                    <p><span className='font-bold'>Nombre: </span>{product.nombre}</p>
                    <p><span className='font-bold'>Descripcion: </span>{product.descripcion}</p>
                    <p><span className='font-bold'>Precio: </span> $ {product.precio_carta}</p>
                    <p><span className='font-bold'>Cantidad: </span>{product.cantidad}</p>
                    <div className='mt-2'>
                        <button 
                        onClick={() => agregarPedido(product)}
                        className='bg-green-600 text-white px-2 py-1 rounded-lg'>agregar</button>
                    </div>
                </div>
            )))}
        </div>
      </div>
      
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Productos agregados a la orden</h2>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de mesa:</label>
                <input
                    type="text"
                    value={mesaInput}
                    onChange={(e) => setMesaInput(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                </div>
        {pedido.length === 0 ? (
            <p className="text-gray-500">No hay productos agregados aún.</p>
        ) : (
            <ul className="space-y-2">
            {pedido.map((item, index) => (
                <li
                key={index}
                className="bg-gray-100 text-black p-3 rounded shadow flex justify-between"
                >
                <span>
                {`${item.tipo ? item.tipo + ' - ' : ''}${item.nombre || item.plato_principal || 'Sin nombre'} - $${item.precio || item.precio_carta}`}
                </span>



                <h1 className="font-bold mt-1 p-2">Recomendaciones</h1>
                <input
                type="text"
                className="w-8x4 mt-1 p-5 border border-gray-300 rounded-lg"
                value={item.recomendaciones || ""}
                onChange={(e) => {
                    const updatedPedido = [...pedido];
                    updatedPedido[index].recomendaciones = e.target.value;
                    setPedido(updatedPedido);
                }}
                />
                    <div className="flex items-center gap-2 mt-2">
                        <button
                            className="bg-red-500 text-white px-2 rounded"
                            onClick={() => {
                            const updatedPedido = [...pedido];
                            if (updatedPedido[index].cantidad > 1) {
                                updatedPedido[index].cantidad -= 1;
                                setPedido(updatedPedido);
                            }
                            }}
                        >
                            -
                        </button>
                        <span>{item.cantidad}</span>
                        <button
                            className="bg-green-500 text-white px-2 rounded"
                            onClick={() => {
                            const updatedPedido = [...pedido];
                            updatedPedido[index].cantidad += 1;
                            setPedido(updatedPedido);
                            }}
                        >
                            +
                        </button>
                    </div>
                <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => {
                    setPedido(pedido.filter((_, i) => i !== index));
                    }}
                >
                    Quitar
                </button>
                </li>
            ))}
            </ul>
        )}
        </div>
        <div className="mt-4">
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleEnviarOrden}
            >
                Enviar Orden
            </button>
        </div>
    </div>
  );
}