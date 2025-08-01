import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [codigo, setCodigo] = useState('');
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login/', { codigo });
      const data = response.data;
      setUsuario(data);
      console.log(data);

      if (data.rol === 'admin') {
        navigate('/productos');  
      } else if (data.rol === 'mesero') {
        navigate('/pedidos'); 
      } else {
        console.warn('Rol no reconocido');
      }

    } catch (error) {
      console.error('Error al iniciar sesión', error);
    }
  };

  return (
    <div className='mx-auto flex'>
        <form
        onSubmit={handleSubmit}>
        <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Ingrese su código"
        />
        <button type="submit">Ingresar</button>

        {usuario && (
            <div>
            <p>Código: {usuario.codigo}</p>
            <p>Rol: {usuario.rol}</p>
            </div>
        )}
        </form>
    </div>
  );
}
