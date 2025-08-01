import {BrowserRouter ,Routes, Route} from 'react-router' 
import Productlist from './components/Productlist';
import ProductForm from './components/ProductForm';
import Header from './components/Header';
import Menu_ejecutivo from './components/Menu_ejecutivo';
import Menu_form from './components/Menu_form';
import Mesero from "./components/MeseroViite";
import Login from './components/Login';
import Caja from './components/Caja';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  return (
    <div className='container mx-auto'>
      {!['/pedidos', '/', '/login'].includes(location.pathname) && <Header />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/productos" element={<Productlist />} />
        <Route path="/agregar-productos" element={<ProductForm />} />
        <Route path="/editar-productos/:id" element={<ProductForm />} />
        <Route path="/menu_ejecutivo" element={<Menu_ejecutivo />} />
        <Route path="/agregar-menu/" element={<Menu_form />} />
        <Route path="/editar-menu/:id" element={<Menu_form />} />
        <Route path="/caja" element={<Caja/>} />
        <Route path="/pedidos" element={<Mesero />} />
      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}