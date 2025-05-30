const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Eliminar un estudiante
const deleteEstudiante = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el estudiante existe
        const estudianteExistente = await prisma.estudiantes.findUnique({
            where: { id: parseInt(id) }
        });

        if (!estudianteExistente) {
            return res.status(404).json({
                success: false,
                message: 'Estudiante no encontrado'
            });
        }

        // Eliminar el estudiante (esto también eliminará las relaciones estudiante-materia debido a CASCADE)
        await prisma.estudiantes.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({
            success: true,
            message: 'Estudiante eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el estudiante',
            error: error.message
        });
    }
};

// Eliminar una materia
const deleteMateria = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si la materia existe
        const materiaExistente = await prisma.materias.findUnique({
            where: { id: parseInt(id) }
        });

        if (!materiaExistente) {
            return res.status(404).json({
                success: false,
                message: 'Materia no encontrada'
            });
        }

        // Verificar si hay estudiantes inscritos en la materia
        const estudiantesInscritos = await prisma.estudiante_materia.findMany({
            where: { materia_id: parseInt(id) }
        });

        if (estudiantesInscritos.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'No se puede eliminar la materia porque tiene estudiantes inscritos'
            });
        }

        // Eliminar la materia
        await prisma.materias.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({
            success: true,
            message: 'Materia eliminada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la materia',
            error: error.message
        });
    }
};

// Eliminar una relación estudiante-materia
const deleteEstudianteMateria = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si la relación existe
        const relacionExistente = await prisma.estudiante_materia.findUnique({
            where: { id: parseInt(id) }
        });

        if (!relacionExistente) {
            return res.status(404).json({
                success: false,
                message: 'Relación estudiante-materia no encontrada'
            });
        }

        // Eliminar la relación
        await prisma.estudiante_materia.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({
            success: true,
            message: 'Relación estudiante-materia eliminada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la relación estudiante-materia',
            error: error.message
        });
    }
};

// Eliminar múltiples estudiantes
const deleteMultipleEstudiantes = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere un array de IDs válido'
            });
        }

        // Convertir los IDs a números
        const numericIds = ids.map(id => parseInt(id));

        // Eliminar los estudiantes
        await prisma.estudiantes.deleteMany({
            where: {
                id: {
                    in: numericIds
                }
            }
        });

        res.status(200).json({
            success: true,
            message: 'Estudiantes eliminados exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar los estudiantes',
            error: error.message
        });
    }
};

// Eliminar múltiples materias
const deleteMultipleMaterias = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere un array de IDs válido'
            });
        }

        // Convertir los IDs a números
        const numericIds = ids.map(id => parseInt(id));

        // Verificar si hay estudiantes inscritos en alguna de las materias
        const estudiantesInscritos = await prisma.estudiante_materia.findMany({
            where: {
                materia_id: {
                    in: numericIds
                }
            }
        });

        if (estudiantesInscritos.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'No se pueden eliminar las materias porque tienen estudiantes inscritos'
            });
        }

        // Eliminar las materias
        await prisma.materias.deleteMany({
            where: {
                id: {
                    in: numericIds
                }
            }
        });

        res.status(200).json({
            success: true,
            message: 'Materias eliminadas exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar las materias',
            error: error.message
        });
    }
};

module.exports = {
    deleteEstudiante,
    deleteMateria,
    deleteEstudianteMateria,
    deleteMultipleEstudiantes,
    deleteMultipleMaterias
}; 