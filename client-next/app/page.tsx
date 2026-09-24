// 'use client'; // Fundamental para usar useEffect, useState y WebSockets

// import { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// interface MetricData {
//   _id?: string;
//   cpuUsage: number;
//   ramUsage: number;
//   timestamp: string;
// }

// // Inicializamos el socket (reutilizamos la URL de tu API de Node)
// const socket = io('http://localhost:3000');

// export default function DashboardPage() {
//   const [data, setData] = useState<MetricData[]>([]);
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     // Obtenemos el historial
//     const fetchHistory = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/api/v1/metrics/history');
//         const historyData = await response.json();
//         setData(historyData);
//       } catch (error) {
//         console.error('Error cargando historial:', error);
//       }
//     };

//     fetchHistory();

//     // Configuramos WebSockets
//     socket.on('connect', () => setIsConnected(true));
//     socket.on('disconnect', () => setIsConnected(false));
    
//     socket.on('server_metrics', (newMetric: MetricData) => {
//       setData((currentData) => [...currentData, newMetric].slice(-15));
//     });

//     // Limpieza al desmontar
//     return () => {
//       socket.off('connect');
//       socket.off('disconnect');
//       socket.off('server_metrics');
//     };
//   }, []);

//   return (
//     <div style={{ width: '100%' }}>
//       <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
//         Estado de telemetría: 
//         <span style={{ 
//           color: isConnected ? '#10b981' : '#ef4444', 
//           fontWeight: 'bold',
//           padding: '4px 12px',
//           backgroundColor: isConnected ? '#d1fae5' : '#fee2e2',
//           borderRadius: '20px',
//           fontSize: '0.85rem'
//         }}>
//           {isConnected ? 'En vivo' : 'Desconectado'}
//         </span>
//       </div>

//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
//         <div style={{ height: 350, backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
//           <h3 style={{ color: '#334155', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Uso de RAM (%)</h3>
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={data}>
//               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
//               <XAxis dataKey="timestamp" hide />
//               <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
//               <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}/>
//               <Line type="monotone" dataKey="ramUsage" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         <div style={{ height: 350, backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
//           <h3 style={{ color: '#334155', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Uso de CPU (%)</h3>
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={data}>
//               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
//               <XAxis dataKey="timestamp" hide />
//               <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
//               <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}/>
//               <Line type="monotone" dataKey="cpuUsage" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client'; 

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout';

interface MetricData {
  cpuUsage: number;
  memoryUsage: number;
  timestamp: string;
}

const socket = io('http://localhost:3000');

export default function DashboardPage() {
  const [data, setData] = useState<MetricData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState('Usuario');
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const userRaw = localStorage.getItem('user');
    if (userRaw) setUserName(JSON.parse(userRaw).name);

    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/metrics/history');
        setData(await response.json());
      } catch (error) {
        console.error(error);
      }
    };

    fetchHistory();

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('server_metrics', (newMetric: MetricData) => {
      setData((currentData) => [...currentData, newMetric].slice(-15));
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('server_metrics');
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  if (!isMounted) return null;

  return (
    <Layout title="📊 Rendimiento del Servidor">
      <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f1f5f9' }}>
        
        {/* SIDEBAR */}
        {/* <aside style={{ width: '260px', backgroundColor: '#1e293b', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#38bdf8' }}>Nodelandia</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>Ecosistema Full Stack</p>
          </div>
          <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link href="/" style={{ textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '6px', color: '#ffffff', backgroundColor: '#3b82f6', fontWeight: '600' }}>
              📊 Rendimiento del Servidor
            </Link>
            <Link href="/tasks" style={{ textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '6px', color: '#cbd5e1', backgroundColor: 'transparent' }}>
              ✅ Gestión de Tareas
            </Link>
          </nav>
        </aside> */}

        {/* ÁREA PRINCIPAL */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* NAVBAR */}
          {/* <header style={{ height: '70px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem' }}>
            <h3 style={{ margin: 0, color: '#334155', fontWeight: '500' }}>📊 Rendimiento del Servidor</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ color: '#64748b', fontSize: '0.95rem' }}>Hola, <strong>{userName}</strong></span>
              <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer' }}>
                Cerrar Sesión
              </button>
            </div>
          </header> */}

          {/* CONTENIDO DE GRÁFICAS */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
              
              <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                Estado de telemetría: 
                <span style={{ color: isConnected ? '#10b981' : '#ef4444', fontWeight: 'bold', padding: '4px 12px', backgroundColor: isConnected ? '#d1fae5' : '#fee2e2', borderRadius: '20px', fontSize: '0.85rem' }}>
                  {isConnected ? 'En vivo' : 'Desconectado'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ height: 350, backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ color: '#334155', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Uso de RAM (%)</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="timestamp" hide />
                      <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                      <Tooltip />
                      <Line type="monotone" dataKey="memoryUsage" stroke="#3b82f6" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ height: 350, backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ color: '#334155', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Uso de CPU (%)</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="timestamp" hide />
                      <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                      <Tooltip />
                      <Line type="monotone" dataKey="cpuUsage" stroke="#10b981" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}