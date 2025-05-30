const express = require('express');
const router = express.Router();
const { 
    createEstudiante,
    updateEstudiante,
    deleteEstudiante,
    deleteMultipleEstudiantes,
    getAllEstudiantes,
    getEstudianteById,
    searchEstudiantes
} = require('../controllers/create.controller');
const { 
    updateEstudiante: updateEstudianteCtrl 
} = require('../controllers/update.controller');
const { 
    deleteEstudiante: deleteEstudianteCtrl,
    deleteMultipleEstudiantes: deleteMultipleEstudiantesCtrl 
} = require('../controllers/delete.controller');
const { 
    getAllEstudiantes: getAllEstudiantesCtrl,
    getEstudianteById: getEstudianteByIdCtrl,
    searchEstudiantes: searchEstudiantesCtrl 
} = require('../controllers/read.controller');

// Rutas CRUD para estudiantes
router.post('/', createEstudiante);
router.get('/', getAllEstudiantesCtrl);
router.get('/search', searchEstudiantesCtrl);
router.get('/:id', getEstudianteByIdCtrl);
router.put('/:id', updateEstudianteCtrl);
router.delete('/:id', deleteEstudianteCtrl);
router.delete('/', deleteMultipleEstudiantesCtrl);

module.exports = router; 