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

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/estudiantes', estudiantesRoutes);
app.use('/api/materias', materiasRoutes);
app.use('/api/estudiante-materia', estudianteMateriaRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        message: 'API de Sistema de Gestión Académica',
        version: '1.0.0',
        endpoints: {
            estudiantes: '/api/estudiantes',
            materias: '/api/materias',
            estudianteMateria: '/api/estudiante-materia'
        }
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: err.message
    });
});

// Puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Manejo de cierre de la aplicación
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});


