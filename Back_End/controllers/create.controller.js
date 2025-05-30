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
            estado = 'ACTIVO'
        } = req.body;

        // Validar que el estado sea uno de los permitidos
        const estadosPermitidos = ['ACTIVO', 'INACTIVO', 'GRADUADO', 'SUSPENDIDO'];
        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                success: false,
                message: 'Estado no válido. Debe ser uno de: ACTIVO, INACTIVO, GRADUADO, SUSPENDIDO'
            });
        }

        // Verificar si ya existe un estudiante con el mismo código
        const estudianteExistente = await prisma.estudiantes.findUnique({
            where: {
                codigo_estudiante: codigo_estudiante
            }
        });

        if (estudianteExistente) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un estudiante con este código'
            });
        }

        const estudiante = await prisma.estudiantes.create({
            data: {
                codigo_estudiante,
                nombre,
                apellido,
                email,
                telefono,
                fecha_nacimiento: new Date(fecha_nacimiento),
                estado,
                promedio_general: 0.00,
                creditos_completados: 0
            }
        });

        res.status(201).json({
            success: true,
            message: 'Estudiante creado exitosamente',
            data: estudiante
        });
    } catch (error) {
        console.error('Error al crear estudiante:', error);
        
        // Manejar errores específicos de Prisma
        if (error.code === 'P2002') {
            const campo = error.meta?.target?.[0];
            return res.status(400).json({
                success: false,
                message: `Ya existe un registro con este ${campo}`
            });
        }

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
            nivel = 'BASICO'
        } = req.body;

        // Validar que el nivel sea uno de los permitidos
        const nivelesPermitidos = ['BASICO', 'INTERMEDIO', 'AVANZADO', 'EXPERTO'];
        if (!nivelesPermitidos.includes(nivel)) {
            return res.status(400).json({
                success: false,
                message: 'Nivel no válido. Debe ser uno de: BASICO, INTERMEDIO, AVANZADO, EXPERTO'
            });
        }

        // Verificar si ya existe una materia con el mismo código
        const materiaExistente = await prisma.materias.findUnique({
            where: {
                codigo_materia: codigo_materia
            }
        });

        if (materiaExistente) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una materia con este código'
            });
        }

        const materia = await prisma.materias.create({
            data: {
                codigo_materia,
                nombre,
                descripcion,
                creditos: parseInt(creditos),
                nivel,
                activa: true
            }
        });

        res.status(201).json({
            success: true,
            message: 'Materia creada exitosamente',
            data: materia
        });
    } catch (error) {
        console.error('Error al crear materia:', error);
        
        // Manejar errores específicos de Prisma
        if (error.code === 'P2002') {
            const campo = error.meta?.target?.[0];
            return res.status(400).json({
                success: false,
                message: `Ya existe un registro con este ${campo}`
            });
        }

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
            estado = 'CURSANDO'
        } = req.body;

        // Validar que el estado sea uno de los permitidos
        const estadosPermitidos = ['CURSANDO', 'APROBADO', 'REPROBADO', 'RETIRADO'];
        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                success: false,
                message: 'Estado no válido. Debe ser uno de: CURSANDO, APROBADO, REPROBADO, RETIRADO'
            });
        }

        // Verificar si ya existe la relación
        const relacionExistente = await prisma.estudiante_materia.findFirst({
            where: {
                estudiante_id: parseInt(estudiante_id),
                materia_id: parseInt(materia_id)
            }
        });

        if (relacionExistente) {
            return res.status(400).json({
                success: false,
                message: 'Este estudiante ya está matriculado en esta materia'
            });
        }

        const estudianteMateria = await prisma.estudiante_materia.create({
            data: {
                estudiante_id: parseInt(estudiante_id),
                materia_id: parseInt(materia_id),
                fecha_inscripcion: new Date(),
                estado,
                intentos: 1
            }
        });

        res.status(201).json({
            success: true,
            message: 'Matrícula creada exitosamente',
            data: estudianteMateria
        });
    } catch (error) {
        console.error('Error al crear matrícula:', error);
        
        // Manejar errores específicos de Prisma
        if (error.code === 'P2002') {
            const campo = error.meta?.target?.[0];
            return res.status(400).json({
                success: false,
                message: `Ya existe un registro con este ${campo}`
            });
        }

        res.status(400).json({
            success: false,
            message: 'Error al crear la matrícula',
            error: error.message
        });
    }
};

module.exports = {
    createEstudiante,
    createMateria,
    createEstudianteMateria
};
