const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Actualizar un estudiante existente
const updateEstudiante = async (req, res) => {
    try {
        const { id } = req.params;
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

        const estudianteActualizado = await prisma.estudiantes.update({
            where: { id: parseInt(id) },
            data: {
                codigo_estudiante,
                nombre,
                apellido,
                email,
                telefono,
                fecha_nacimiento: fecha_nacimiento ? new Date(fecha_nacimiento) : undefined,
                fecha_ingreso: fecha_ingreso ? new Date(fecha_ingreso) : undefined,
                estado,
                promedio_general,
                creditos_completados
            }
        });

        res.status(200).json({
            success: true,
            message: 'Estudiante actualizado exitosamente',
            data: estudianteActualizado
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar el estudiante',
            error: error.message
        });
    }
};

// Actualizar una materia existente
const updateMateria = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            codigo_materia,
            nombre,
            descripcion,
            creditos,
            nivel,
            prerequisitos,
            activa
        } = req.body;

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

        const materiaActualizada = await prisma.materias.update({
            where: { id: parseInt(id) },
            data: {
                codigo_materia,
                nombre,
                descripcion,
                creditos,
                nivel,
                prerequisitos,
                activa
            }
        });

        res.status(200).json({
            success: true,
            message: 'Materia actualizada exitosamente',
            data: materiaActualizada
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar la materia',
            error: error.message
        });
    }
};

// Actualizar una relación estudiante-materia existente
const updateEstudianteMateria = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            calificacion,
            fecha_inscripcion,
            fecha_finalizacion,
            estado,
            intentos
        } = req.body;

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

        const relacionActualizada = await prisma.estudiante_materia.update({
            where: { id: parseInt(id) },
            data: {
                calificacion,
                fecha_inscripcion: fecha_inscripcion ? new Date(fecha_inscripcion) : undefined,
                fecha_finalizacion: fecha_finalizacion ? new Date(fecha_finalizacion) : undefined,
                estado,
                intentos
            }
        });

        res.status(200).json({
            success: true,
            message: 'Relación estudiante-materia actualizada exitosamente',
            data: relacionActualizada
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar la relación estudiante-materia',
            error: error.message
        });
    }
};

module.exports = {
    updateEstudiante,
    updateMateria,
    updateEstudianteMateria
}; 