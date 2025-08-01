import axios  from 'axios'

const menuApi = axios.create({
    baseURL:"http://127.0.0.1:8000/api/menu_ejecutivo/"
})

export const createMenuEjecutivo = () => menuApi.get()
export const getmenu = (id) => menuApi.get(`${id}`)
export const createMenu = (menu_dia) => menuApi.post('/', menu_dia)
export const updateMenu = (id, menu_dia) => menuApi.put(`/${id}/`,menu_dia)
export const deletemenu = (id) => menuApi.delete(`/${id}/`)