import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Nos conectamos a nuestra API de Node.js
const socket = io('http://localhost:3000');

// Definimos la forma de los datos (TypeScript)
interface MetricData {
  timestamp: string;
  memoryUsage: number;
  cpuUsage: number;
}

function Dashboard() {
  const [data, setData] = useState<MetricData[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 1. Al montar el componente, traemos el historial de MongoDB por HTTP
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/metrics/history');
        const historyData = await response.json();
        setData(historyData); // Poblamos la gráfica inmediatamente
      } catch (error) {
        console.error('Error cargando historial:', error);
      }
    };
      
    fetchHistory();

    // 1. Escuchar cuando nos conectamos exitosamente
    socket.on('connect', () => {
      setIsConnected(true);
    });

    // 2. Escuchar cuando nos desconectamos (si el servidor se cae)
    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // 3. ¡El evento principal! Escuchamos los datos del servidor
    socket.on('server_metrics', (newMetric: MetricData) => {
      setData((currentData) => 
      [...currentData, newMetric].slice(-15));
    });

    // 4. Limpieza del componente cuando se desmonta
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('server_metrics');
    };
  }, []);

  // RENDERIZADO CONDICIONAL
//   if (!isAuthenticated) {
//     return (
//       <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9' }}>
//          {/* Renderizamos el componente Login */}
//         <Login /> 
//       </div>
//     );
//   }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Gráficas de Monitoreo (Se mantienen iguales) */}
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        Estado del socket: 
        <span style={{ color: isConnected ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
          {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Gráfica de Memoria */}
        <div style={{ height: 350, backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
          <h3>Uso de RAM (%)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="memoryUsage" stroke="#3b82f6" strokeWidth={3} animationDuration={300} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Nueva Gráfica de CPU */}
        <div style={{ height: 350, backgroundColor: '#fef2f2', padding: '1rem', borderRadius: '8px' }}>
          <h3>Uso de CPU (%)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="cpuUsage" stroke="#ef4444" strokeWidth={3} animationDuration={300} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>      
    </div>
  );
}

export default Dashboard;