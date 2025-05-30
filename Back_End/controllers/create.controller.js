const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear un nuevo estudiante
const createEstudiante = async (req, res) => {
    try {
        const {
            codigo_estudiante,
            nombre,
            apellido,
            email,
            telefono,
            fecha_nacimiento,
            fecha_ingreso,
            estado,
            promedio_general,
            creditos_completados
        } = req.body;

        const estudiante = await prisma.estudiantes.create({
            data: {
                codigo_estudiante,
                nombre,
                apellido,
                email,
                telefono,
                fecha_nacimiento: new Date(fecha_nacimiento),
                fecha_ingreso: fecha_ingreso ? new Date(fecha_ingreso) : undefined,
                estado: estado || 'ACTIVO',
                promedio_general: promedio_general || 0.00,
                creditos_completados: creditos_completados || 0
            }
        });

        res.status(201).json({
            success: true,
            message: 'Estudiante creado exitosamente',
            data: estudiante
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear el estudiante',
            error: error.message
        });
    }
};

// Crear una nueva materia
const createMateria = async (req, res) => {
    try {
        const {
            codigo_materia,
            nombre,
            descripcion,
            creditos,
            nivel,
            prerequisitos,
            activa
        } = req.body;

        const materia = await prisma.materias.create({
            data: {
                codigo_materia,
                nombre,
                descripcion,
                creditos,
                nivel: nivel || 'BASICO',
                prerequisitos,
                activa: activa !== undefined ? activa : true
            }
        });

        res.status(201).json({
            success: true,
            message: 'Materia creada exitosamente',
            data: materia
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear la materia',
            error: error.message
        });
    }
};

// Crear una nueva relación estudiante-materia
const createEstudianteMateria = async (req, res) => {
    try {
        const {
            estudiante_id,
            materia_id,
            calificacion,
            fecha_inscripcion,
            fecha_finalizacion,
            estado,
            intentos
        } = req.body;

        const estudianteMateria = await prisma.estudiante_materia.create({
            data: {
                estudiante_id,
                materia_id,
                calificacion,
                fecha_inscripcion: fecha_inscripcion ? new Date(fecha_inscripcion) : undefined,
                fecha_finalizacion: fecha_finalizacion ? new Date(fecha_finalizacion) : undefined,
                estado: estado || 'CURSANDO',
                intentos: intentos || 1
            }
        });

        res.status(201).json({
            success: true,
            message: 'Relación estudiante-materia creada exitosamente',
            data: estudianteMateria
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear la relación estudiante-materia',
            error: error.message
        });
    }
};

module.exports = {
    createEstudiante,
    createMateria,
    createEstudianteMateria
};
