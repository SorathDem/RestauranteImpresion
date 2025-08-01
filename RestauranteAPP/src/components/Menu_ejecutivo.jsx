import React, { useState } from 'react'
import { createMenuEjecutivo, deletemenu } from '../api/menu_dia'
import {useNavigate} from "react-router"
import { Link } from 'react-router'

export default function Menu_ejecutivo() {
    
    const [menu_dia, setMenu] = useState([])

    const navigate = useNavigate()

    const loadMenuDia = async() => {
        const response = await createMenuEjecutivo ()
        setMenu(response.data)
    }

    const menuDelete = async (id) => {
        await deletemenu(id)
        setMenu(menu_dia.filter(menu_dia => menu_dia.id !== id))
    }

    loadMenuDia()
  return (
    <div>
      <h1 className='text-3xl font-bold'> Menu Ejecutivo</h1>
        <div className='mt-3'>
          <Link to="/agregar-menu" className="bg-green-600 text-black px-4 py-2 rounded-lg">Agregar Menu Ejecutivo</Link>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 mt-5  gap-5 text-white'>
            {menu_dia.map((menu => (
                <div key={menu.id} className="bg-sky-900 p-4 rounded-lg shadow-md">
                    <p><span className='fond-bold'>Sopa: </span>{menu.sopa}</p>
                    <p><span className='fond-bold'>Plato Principal: </span>{menu.plato_principal}</p>
                    <p><span className='fond-bold'>jugo: </span>{menu.jugo}</p>
                    <p><span className='fond-bold'>Precio: </span>{menu.precio}</p>
                    <div className='mt-2'>
                        <button 
                        onClick={() => navigate("/editar-menu/" + menu.id)}
                        className='bg-green-600 text-white px-2 py-1 rounded-lg'>editar</button>
                        <button 
                        onClick={() => menuDelete(menu.id) }
                        className='bg-red-600 text-white px-2 py-1 rounded-lg ml-2'>eliminar</button>
                        
                    </div>
                </div>
            )))}
                
        </div>
    </div>
    
  )
}
