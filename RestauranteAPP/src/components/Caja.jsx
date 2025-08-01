import React, { useEffect, useState } from 'react';

export default function Caja() {
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para obtener las facturas desde el servidor
    const loadFacturas = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/api/factura/');
            
            if (!response.ok) {
                throw new Error('Error al cargar las facturas');
            }
            
            const data = await response.json();
            setFacturas(data);
        } catch (err) {
            setError(err.message);
            console.error("Error al cargar facturas:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFacturas();
    }, []);

    // --- Componente UI ---

    if (loading) {
        return <div className="p-6 text-white text-center">Cargando registros...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500 text-center">Error: {error}</div>;
    }

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white">
            <h1 className="text-4xl font-bold mb-8 text-center">Registro de Facturas</h1>

            {facturas.length === 0 ? (
                <p className="text-gray-400 text-center">No hay registros de facturas en la base de datos.</p>
            ) : (
                <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg p-4">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Mesa</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Productos</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {facturas.map((factura) => (
                                <tr key={factura.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{factura.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{factura.fecha}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{factura.mesa}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${factura.total}</td>
                                    <td className="px-6 py-4 text-sm text-gray-300">
                                        <ul className="list-disc list-inside">
                                            {factura.productos.map((item, index) => (
                                                <li key={index}>
                                                    {item.cantidad}x {item.nombre || item.plato_principal} - ${item.precio || item.precio_carta}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}