const express = require('express');
const router = express.Router();
const { 
    createEstudianteMateria,
    updateEstudianteMateria,
    deleteEstudianteMateria,
    getAllEstudianteMateria,
    getEstudianteMateriaById
} = require('../controllers/create.controller');
const { 
    updateEstudianteMateria: updateEstudianteMateriaCtrl 
} = require('../controllers/update.controller');
const { 
    deleteEstudianteMateria: deleteEstudianteMateriaCtrl 
} = require('../controllers/delete.controller');
const { 
    getAllEstudianteMateria: getAllEstudianteMateriaCtrl,
    getEstudianteMateriaById: getEstudianteMateriaByIdCtrl 
} = require('../controllers/read.controller');

// Rutas CRUD para relaciones estudiante-materia
router.post('/', createEstudianteMateria);
router.get('/', getAllEstudianteMateriaCtrl);
router.get('/:id', getEstudianteMateriaByIdCtrl);
router.put('/:id', updateEstudianteMateriaCtrl);
router.delete('/:id', deleteEstudianteMateriaCtrl);

module.exports = router; 