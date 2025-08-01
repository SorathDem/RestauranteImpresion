import { Link } from 'react-router'
import { useNavigate } from 'react-router-dom';

export default function Header() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white py-4 mb-2">
      <div className='container mx-auto flex justify-between items-center'>
        <Link to="/productos" className= 'text-3  font-bold justify-around items-center'>Productos App</Link>
        <Link to="/menu_ejecutivo" className= 'text-3 ml-3 font-bold'>Menu ejecutivo</Link>
        <Link to="/caja" className= 'text-3 ml-3 font-bold'>Caja</Link>
        <div className='justify-end items-end'>
          <button className='text-3  font-bold' 
          onClick={handleLogout}>Cerrar sesión</button>
        </div>

      </div>
    </nav>
  )
}
