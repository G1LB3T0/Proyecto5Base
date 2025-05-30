const express = require('express');
const router = express.Router();
const { 
    createMateria,
    updateMateria,
    deleteMateria,
    deleteMultipleMaterias,
    getAllMaterias,
    getMateriaById,
    searchMaterias
} = require('../controllers/create.controller');
const { 
    updateMateria: updateMateriaCtrl 
} = require('../controllers/update.controller');
const { 
    deleteMateria: deleteMateriaCtrl,
    deleteMultipleMaterias: deleteMultipleMateriasCtrl 
} = require('../controllers/delete.controller');
const { 
    getAllMaterias: getAllMateriasCtrl,
    getMateriaById: getMateriaByIdCtrl,
    searchMaterias: searchMateriasCtrl 
} = require('../controllers/read.controller');

// Rutas CRUD para materias
router.post('/', createMateria);
router.get('/', getAllMateriasCtrl);
router.get('/search', searchMateriasCtrl);
router.get('/:id', getMateriaByIdCtrl);
router.put('/:id', updateMateriaCtrl);
router.delete('/:id', deleteMateriaCtrl);
router.delete('/', deleteMultipleMateriasCtrl);

module.exports = router; 