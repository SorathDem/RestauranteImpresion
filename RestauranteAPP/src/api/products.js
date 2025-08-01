import axios  from 'axios'

const productsApi = axios.create({
    baseURL:"http://127.0.0.1:8000/api/productos/"
})
 
export const getProducts = () => productsApi.get()
export const getProduct = (id) => productsApi.get(`${id}`)
export const createProduct = (products) => productsApi.post('/', products)
export const updateProduct = (id, products) => productsApi.put(`/${id}/`,products)
export const deleteproduct = (id) => productsApi.delete(`/${id}/`)
