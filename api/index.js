const express = require('express');
const cors = require('cors');
const http = require('http'); // 1. Importamos el módulo HTTP nativo
const { Server } = require('socket.io'); // 2. Importamos Socket.io

const connectMongo = require('./db/mongo');
require('./db/scripts/initTables')();
const Metric = require('./db/models/Metric');

const app = express();
// 3. Creamos un servidor HTTP nativo pasándole la app de Express
const server = http.createServer(app); 

// 4. Inicializamos Socket.io permitiendo que React (Vite) se conecte
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json()); 
connectMongo();

// ==========================================
// RUTAS
// ==========================================

app.use('/api/v1/status', require('./routes/status.routes'));
app.use('/api/v1/metrics', require('./routes/metrics.routes'));
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/tasks', require('./routes/tasks.routes'));

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// 5. Lógica de WebSockets: ¿Qué pasa cuando alguien se conecta?
io.on('connection', (socket) => {
  console.log('🟢 Nuevo cliente conectado al WebSocket:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 Cliente desconectado:', socket.id);
  });
});

const os = require('os');

// Función auxiliar para sumar los tiempos de todos los núcleos
const getCpuTimes = () => {
  const cpus = os.cpus();
  return cpus.reduce((acc, cpu) => {
    acc.idle += cpu.times.idle;
    acc.total += Object.values(cpu.times).reduce((sum, time) => sum + time, 0);
    return acc;
  }, { idle: 0, total: 0 });
};

let previousCpuTimes = getCpuTimes();

setInterval(async () => {
  // 1. Cálculo de Memoria (como ya lo teníamos)
  const freeMemory = os.freemem();
  const totalMemory = os.totalmem();
  const memoryUsage = Number((((totalMemory - freeMemory) / totalMemory) * 100).toFixed(2));

  // 2. Cálculo de CPU (Diferencia entre el instante actual y el anterior)
  const currentCpuTimes = getCpuTimes();
  const idleDifference = currentCpuTimes.idle - previousCpuTimes.idle;
  const totalDifference = currentCpuTimes.total - previousCpuTimes.total;
  
  // Evitar división por cero
  const cpuUsage = totalDifference === 0 ? 0 : 100 - Math.floor((idleDifference / totalDifference) * 100);
  
  previousCpuTimes = currentCpuTimes; // Guardamos el estado para el siguiente ciclo

  const metric = {
    timestamp: new Date().toLocaleTimeString(),
    memoryUsage,
    cpuUsage
  };

  try {
    // 3. Guardamos en MongoDB antes de enviarlo
    await Metric.create(metric);
    io.emit('server_metrics', metric); 
  } catch (error) {
    console.error('Error guardando en BD:', error);
  }
}, 2000);

// Cada 2 segundos, recolectamos datos y los emitimos a TODOS los conectados
// setInterval(() => {
//   const freeMemory = os.freemem();
//   const totalMemory = os.totalmem();
//   const usedMemory = totalMemory - freeMemory;
//   const memoryUsagePercentage = ((usedMemory / totalMemory) * 100).toFixed(2);

//   const metric = {
//     timestamp: new Date().toLocaleTimeString(),
//     memoryUsage: Number(memoryUsagePercentage)
//   };

//   // "emite" el evento 'server_metrics' con los datos
//   io.emit('server_metrics', metric); 
// }, 2000);

// 6. ¡IMPORTANTE! Ahora encendemos "server", no "app"
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 API y WebSockets escuchando en el puerto ${PORT}`);
});