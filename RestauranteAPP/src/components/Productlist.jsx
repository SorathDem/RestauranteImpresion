import React, { useEffect, useState } from 'react'
import { deleteproduct, getProducts } from '../api/products'
import {useNavigate} from "react-router"
import { Link } from 'react-router'

export default function Productlist() {

    const[products, setProducts] = useState([])
    
    const navigate = useNavigate()
    
    const loadProducts = async() =>{
        const response  = await getProducts()
        setProducts(response.data)
    }

    const handleDelete = async (id) => {
        await deleteproduct(id)
        setProducts(products.filter(products => products.id !== id))
    }

        const [searchQuery, setSearchQuery] = useState("");

        const filteredProducts = products.filter(
            (product) =>
                product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.categoria.toLowerCase().includes(searchQuery.toLowerCase())
        );
    
    useEffect(() =>{
        loadProducts()
    }, [])

  return (
    <div className='mt.8'>
        <h1 className='text-3xl font-bold mt-4'>Produtos disponibles</h1>
        <div className='mt-3 '>
          <Link to="/agregar-productos" className="bg-amber-100 text-black  mt-3 px-4 py-2 rounded-lg">Agregar Producto</Link>
        </div>
            <input
            type="text"
            placeholder="Buscar por nombre o categoría..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full mt-4 p-2 mb-5 border border-gray-300 rounded text-black"
            />
        <div className='grid grid-cols-1 md:grid-cols-3 mt-5  gap-5 text-white'>
            {filteredProducts.map((product => (
                <div key={product.id} className='bg-sky-900 p-4 rounded-lg shadow'>
                    <p><span className='font-bold'>Categoria: </span>{product.categoria}</p>
                    <p><span className='font-bold'>Nombre: </span>{product.nombre}</p>
                    <p><span className='font-bold'>Descripcion: </span>{product.descripcion}</p>
                    <p><span className='font-bold'>Precio: </span> $ {product.precio_carta}</p>
                    <p><span className='font-bold'>Cantidad: </span>{product.cantidad}</p>
                    {/* <p><span className='font-bold'>Alternativa: </span>{product.alternativa}</p> */}
                    <div className='mt-2'>
                        <button 
                        onClick={() => navigate("/editar-productos/" + product.id)}
                        className='bg-green-600 text-white px-2 py-1 rounded-lg'>editar</button>
                        <button 
                        onClick={() => handleDelete(product.id) }
                        className='bg-red-600 text-white px-2 py-1 rounded-lg ml-2'>eliminar</button>
                        
                    </div>
                </div>
            )))}
        </div>

    </div>
  )
}
