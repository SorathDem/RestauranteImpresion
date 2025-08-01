import { useEffect, useState } from "react"
import { createProduct, getProducts, getProduct, updateProduct } from "../api/products"
import {useNavigate, useParams} from "react-router"

export default function ProductForm() {

  const [products, setProducts] = useState({
    categoria: '',
    nombre: '',
    descripcion: '',
    precio_carta: 0,
    cantidad: 0,
    alternativa: false
  })

  const navigate = useNavigate()

  const params = useParams()

  useEffect(() => {
    const loadProduct = async () =>{
      if (params.id){
        const response = await getProduct(params.id)
        setProducts(response.data)
      }
    }
    loadProduct()
  }, [params.id])

  const handleSubmit = async(e) => {
    e.preventDefault()
    if (params.id){
      await updateProduct(params.id, products)
    }else{
      await createProduct(products)
    }
    navigate("/productos")
  }

  const handleCancel = () => {
    navigate("/productos");
  };


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block-text-sm font-bold text-gray-700">Categoria</label>
          <input 
          value={products.categoria} 
          type="text" 
          onChange={(e) => setProducts({ ...products, categoria: e.target.value})} 
          className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block-text-sm font-bold text-gray-700">Nombre</label>
        <input
          value={products.nombre}
          type="text"
          onChange={(e) => setProducts({ ...products, nombre: e.target.value })}
          className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
        />
        </div>

        <div className="mb-4">
          <label className="block-text-sm font-bold text-gray-700">Descripcion</label>
          <textarea
            value={products.descripcion}
            onChange={(e) => setProducts({ ...products, descripcion: e.target.value})}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg" ></textarea>
        </div>

        <div className="mb-4">
          <label className="block-text-sm font-bold text-gray-700">Precio</label>
          <input 
            value={products.precio_carta}
            type="int"  onChange={(e) => setProducts({ ...products, precio_carta: Number(e.target.value)})} 
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"/>
        </div>

        <div className="mb-4">
          <label className="block-text-sm font-bold text-gray-700">Cantidad</label>
          <input 
            value={products.cantidad}
            type="number"  
            onChange={(e) => setProducts({ ...products, cantidad: Number(e.target.value)})}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"/>
        </div>

        <div>
          <button className="bg-green-400 text-white px-4 py-2 rounded-lg">Guardar</button>
          <button
            className="bg-red-400 text-white px-4 py-2 rounded-lg ml-2"
            onClick={handleCancel}
          >
            Cancelar
          </button>
        </div>

      </form>
    </div>
  )
}
