import { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Chip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const API_URL = 'http://localhost:3000/api';

function Materias() {
  const [materias, setMaterias] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingMateria, setEditingMateria] = useState(null);
  const [formData, setFormData] = useState({
    codigo_materia: '',
    nombre: '',
    descripcion: '',
    creditos: '',
    nivel: 'BASICO',
    activa: true
  });

  useEffect(() => {
    fetchMaterias();
  }, []);

  const fetchMaterias = async () => {
    try {
      const response = await fetch(`${API_URL}/materias`);
      const data = await response.json();
      if (data.success) {
        const materiasOrdenadas = data.data.sort((a, b) => b.id - a.id);
        setMaterias(materiasOrdenadas);
      }
    } catch (error) {
      console.error('Error al obtener materias:', error);
    }
  };

  const handleOpen = (materia = null) => {
    if (materia) {
      setEditingMateria(materia);
      setFormData({
        ...materia,
        creditos: materia.creditos.toString()
      });
    } else {
      setEditingMateria(null);
      setFormData({
        codigo_materia: '',
        nombre: '',
        descripcion: '',
        creditos: '',
        nivel: 'BASICO',
        activa: true
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMateria(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingMateria
        ? `${API_URL}/materias/${editingMateria.id}`
        : `${API_URL}/materias`;
      
      const method = editingMateria ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          creditos: parseInt(formData.creditos)
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchMaterias();
        handleClose();
      }
    } catch (error) {
      console.error('Error al guardar materia:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta materia?')) {
      try {
        const response = await fetch(`${API_URL}/materias/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.success) {
          fetchMaterias();
        }
      } catch (error) {
        console.error('Error al eliminar materia:', error);
      }
    }
  };

  return (
    <div>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2
      }}>
        <Typography variant="h5">
          Gestión de Materias
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()}
          startIcon={<AddIcon />}
        >
          Nueva Materia
        </Button>
      </Box>

      <TableContainer 
        component={Paper}
        sx={{
          overflowX: 'auto',
          '& .MuiTable-root': {
            minWidth: 650
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Créditos</TableCell>
              <TableCell>Nivel</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materias.map((materia) => (
              <TableRow key={materia.id}>
                <TableCell>{materia.codigo_materia}</TableCell>
                <TableCell>{materia.nombre}</TableCell>
                <TableCell>{materia.creditos}</TableCell>
                <TableCell>{materia.nivel}</TableCell>
                <TableCell>
                  <Chip 
                    label={materia.activa ? "Activa" : "Inactiva"} 
                    color={materia.activa ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton 
                    onClick={() => handleOpen(materia)} 
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(materia.id)} 
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingMateria ? 'Editar Materia' : 'Nueva Materia'}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Código"
              value={formData.codigo_materia}
              onChange={(e) => setFormData({ ...formData, codigo_materia: e.target.value })}
              margin="normal"
              required
              size="small"
            />
            <TextField
              fullWidth
              label="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              margin="normal"
              required
              size="small"
            />
            <TextField
              fullWidth
              label="Descripción"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              margin="normal"
              size="small"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Créditos"
              type="number"
              value={formData.creditos}
              onChange={(e) => setFormData({ ...formData, creditos: e.target.value })}
              margin="normal"
              required
              size="small"
            />
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Nivel</InputLabel>
              <Select
                value={formData.nivel}
                onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                label="Nivel"
              >
                <MenuItem value="BASICO">Básico</MenuItem>
                <MenuItem value="INTERMEDIO">Intermedio</MenuItem>
                <MenuItem value="AVANZADO">Avanzado</MenuItem>
                <MenuItem value="EXPERTO">Experto</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={formData.activa}
                onChange={(e) => setFormData({ ...formData, activa: e.target.value })}
                label="Estado"
              >
                <MenuItem value={true}>Activa</MenuItem>
                <MenuItem value={false}>Inactiva</MenuItem>
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
          >
            {editingMateria ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Materias; 