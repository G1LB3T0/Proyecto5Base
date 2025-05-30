const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener todos los estudiantes
const getAllEstudiantes = async (req, res) => {
    try {
        const estudiantes = await prisma.estudiantes.findMany({
            include: {
                estudiante_materia: {
                    include: {
                        materias: true
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            count: estudiantes.length,
            data: estudiantes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los estudiantes',
            error: error.message
        });
    }
};

// Obtener un estudiante por ID
const getEstudianteById = async (req, res) => {
    try {
        const { id } = req.params;
        const estudiante = await prisma.estudiantes.findUnique({
            where: { id: parseInt(id) },
            include: {
                estudiante_materia: {
                    include: {
                        materias: true
                    }
                }
            }
        });

        if (!estudiante) {
            return res.status(404).json({
                success: false,
                message: 'Estudiante no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: estudiante
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el estudiante',
            error: error.message
        });
    }
};

// Obtener todas las materias
const getAllMaterias = async (req, res) => {
    try {
        const materias = await prisma.materias.findMany({
            include: {
                estudiante_materia: {
                    include: {
                        estudiantes: true
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            count: materias.length,
            data: materias
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las materias',
            error: error.message
        });
    }
};

// Obtener una materia por ID
const getMateriaById = async (req, res) => {
    try {
        const { id } = req.params;
        const materia = await prisma.materias.findUnique({
            where: { id: parseInt(id) },
            include: {
                estudiante_materia: {
                    include: {
                        estudiantes: true
                    }
                }
            }
        });

        if (!materia) {
            return res.status(404).json({
                success: false,
                message: 'Materia no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            data: materia
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener la materia',
            error: error.message
        });
    }
};

// Obtener todas las relaciones estudiante-materia
const getAllEstudianteMateria = async (req, res) => {
    try {
        const relaciones = await prisma.estudiante_materia.findMany({
            include: {
                estudiantes: true,
                materias: true
            }
        });

        res.status(200).json({
            success: true,
            count: relaciones.length,
            data: relaciones
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las relaciones estudiante-materia',
            error: error.message
        });
    }
};

// Obtener una relación estudiante-materia por ID
const getEstudianteMateriaById = async (req, res) => {
    try {
        const { id } = req.params;
        const relacion = await prisma.estudiante_materia.findUnique({
            where: { id: parseInt(id) },
            include: {
                estudiantes: true,
                materias: true
            }
        });

        if (!relacion) {
            return res.status(404).json({
                success: false,
                message: 'Relación estudiante-materia no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            data: relacion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener la relación estudiante-materia',
            error: error.message
        });
    }
};

// Búsqueda de estudiantes por filtros
const searchEstudiantes = async (req, res) => {
    try {
        const { 
            nombre, 
            apellido, 
            estado, 
            promedio_min, 
            promedio_max 
        } = req.query;

        const where = {};
        
        if (nombre) where.nombre = { contains: nombre, mode: 'insensitive' };
        if (apellido) where.apellido = { contains: apellido, mode: 'insensitive' };
        if (estado) where.estado = estado;
        if (promedio_min || promedio_max) {
            where.promedio_general = {};
            if (promedio_min) where.promedio_general.gte = parseFloat(promedio_min);
            if (promedio_max) where.promedio_general.lte = parseFloat(promedio_max);
        }

        const estudiantes = await prisma.estudiantes.findMany({
            where,
            include: {
                estudiante_materia: {
                    include: {
                        materias: true
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            count: estudiantes.length,
            data: estudiantes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en la búsqueda de estudiantes',
            error: error.message
        });
    }
};

// Búsqueda de materias por filtros
const searchMaterias = async (req, res) => {
    try {
        const { 
            nombre, 
            nivel, 
            creditos_min, 
            creditos_max,
            activa 
        } = req.query;

        const where = {};
        
        if (nombre) where.nombre = { contains: nombre, mode: 'insensitive' };
        if (nivel) where.nivel = nivel;
        if (activa !== undefined) where.activa = activa === 'true';
        if (creditos_min || creditos_max) {
            where.creditos = {};
            if (creditos_min) where.creditos.gte = parseInt(creditos_min);
            if (creditos_max) where.creditos.lte = parseInt(creditos_max);
        }

        const materias = await prisma.materias.findMany({
            where,
            include: {
                estudiante_materia: {
                    include: {
                        estudiantes: true
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            count: materias.length,
            data: materias
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en la búsqueda de materias',
            error: error.message
        });
    }
};

module.exports = {
    getAllEstudiantes,
    getEstudianteById,
    getAllMaterias,
    getMateriaById,
    getAllEstudianteMateria,
    getEstudianteMateriaById,
    searchEstudiantes,
    searchMaterias
}; 