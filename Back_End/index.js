const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

// Importar rutas
const estudiantesRoutes = require('./routes/estudiantes.routes');
const materiasRoutes = require('./routes/materias.routes');
const estudianteMateriaRoutes = require('./routes/estudiante-materia.routes');

// Inicializar Express y Prisma
const app = express();
const prisma = new PrismaClient();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:5173', // URL del frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Rutas
app.use('/api/estudiantes', estudiantesRoutes);
app.use('/api/materias', materiasRoutes);
app.use('/api/estudiante-materia', estudianteMateriaRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date()
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
    console.log('Cerrando servidor...');
    prisma.$disconnect();
    process.exit(0);
});


