import React, { useEffect, useState } from 'react'
import {useNavigate, useParams} from "react-router"
import { getmenu, updateMenu, createMenu } from '../api/menu_dia'

export default function Menu_form() {

    const [menu_dia, setMenuDia] = useState({
        tipo:"Ejecutivo",
        sopa: "",
        plato_principal: "",
        jugo: "",
        precio: 0,
    })

    const params = useParams()
    
    const navigate = useNavigate()

    useEffect(() =>{
        const loadMenu = async () => {
            if (params.id){
                const response = await getmenu(params.id)
                setMenuDia(response.data)
            }
        }
        loadMenu()
  },[params.id])

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(params.id){
            await updateMenu(params.id, menu_dia)
        }else{
            await createMenu(menu_dia)
        }
        navigate('/menu_ejecutivo')
    }

    const handleCancel = () => {
        navigate('/menu_ejecutivo');
     };

  return (
    <div>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Sopa:</label>
                <input 
                value={menu_dia.sopa}
                type="text"
                onChange={(e) => setMenuDia({...menu_dia, sopa: e.target.value})}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                />
            </div>
            <div>
                <label>Plato Principal:</label>
                <input 
                value={menu_dia.plato_principal}
                type="text"
                onChange={(e) => setMenuDia({...menu_dia, plato_principal: e.target.value})}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                />
            </div>
            <div>
                <label>Jugo:</label>
                <input 
                value={menu_dia.jugo}
                type="text"
                onChange={(e) => setMenuDia({...menu_dia, jugo: e.target.value})}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                />
            </div>

            <div>
                <label>Precio:</label>
                <input 
                value={menu_dia.precio}
                type="int"
                onChange={(e) => setMenuDia({...menu_dia, precio: Number(e.target.value)})}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                />
            </div>
            <div className='mt-5'>
                <button type='submit' className="bg-green-400 text-white px-4 py-2 rounded-lg">Guardar</button>
                <button
                    type="button" // Importante: usa type="button" para evitar que envíe el formulario
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
