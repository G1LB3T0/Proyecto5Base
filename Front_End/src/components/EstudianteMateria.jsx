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
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Box
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const API_URL = 'http://localhost:3000/api';

function EstudianteMateria() {
  const [relaciones, setRelaciones] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingRelacion, setEditingRelacion] = useState(null);
  const [formData, setFormData] = useState({
    estudiante_id: '',
    materia_id: '',
    estado: 'ACTIVO',
    fecha_inscripcion: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchRelaciones();
    fetchEstudiantes();
    fetchMaterias();
  }, []);

  const fetchRelaciones = async () => {
    try {
      const response = await fetch(`${API_URL}/estudiante-materia`);
      const data = await response.json();
      if (data.success) {
        setRelaciones(data.data);
      }
    } catch (error) {
      console.error('Error al obtener relaciones:', error);
    }
  };

  const fetchEstudiantes = async () => {
    try {
      const response = await fetch(`${API_URL}/estudiantes`);
      const data = await response.json();
      if (data.success) {
        setEstudiantes(data.data);
      }
    } catch (error) {
      console.error('Error al obtener estudiantes:', error);
    }
  };

  const fetchMaterias = async () => {
    try {
      const response = await fetch(`${API_URL}/materias`);
      const data = await response.json();
      if (data.success) {
        setMaterias(data.data);
      }
    } catch (error) {
      console.error('Error al obtener materias:', error);
    }
  };

  const handleOpen = (relacion = null) => {
    if (relacion) {
      setEditingRelacion(relacion);
      setFormData({
        ...relacion,
        fecha_inscripcion: relacion.fecha_inscripcion.split('T')[0]
      });
    } else {
      setEditingRelacion(null);
      setFormData({
        estudiante_id: '',
        materia_id: '',
        estado: 'ACTIVO',
        fecha_inscripcion: new Date().toISOString().split('T')[0]
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRelacion(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingRelacion
        ? `${API_URL}/estudiante-materia/${editingRelacion.id}`
        : `${API_URL}/estudiante-materia`;
      
      const method = editingRelacion ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        fetchRelaciones();
        handleClose();
      }
    } catch (error) {
      console.error('Error al guardar relación:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta relación?')) {
      try {
        const response = await fetch(`${API_URL}/estudiante-materia/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.success) {
          fetchRelaciones();
        }
      } catch (error) {
        console.error('Error al eliminar relación:', error);
      }
    }
  };

  const getEstudianteNombre = (estudianteId) => {
    const estudiante = estudiantes.find(e => e.id === estudianteId);
    return estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : '';
  };

  const getMateriaNombre = (materiaId) => {
    const materia = materias.find(m => m.id === materiaId);
    return materia ? materia.nombre : '';
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
          Gestión de Matrículas
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()}
          startIcon={<AddIcon />}
        >
          Nueva Matrícula
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
              <TableCell>Estudiante</TableCell>
              <TableCell>Materia</TableCell>
              <TableCell>Fecha Matrícula</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {relaciones.map((relacion) => (
              <TableRow key={relacion.id}>
                <TableCell>{getEstudianteNombre(relacion.estudiante_id)}</TableCell>
                <TableCell>{getMateriaNombre(relacion.materia_id)}</TableCell>
                <TableCell>{relacion.fecha_inscripcion.split('T')[0]}</TableCell>
                <TableCell>{relacion.estado}</TableCell>
                <TableCell align="center">
                  <IconButton 
                    onClick={() => handleOpen(relacion)} 
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(relacion.id)} 
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
          {editingRelacion ? 'Editar Matrícula' : 'Nueva Matrícula'}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Estudiante</InputLabel>
              <Select
                value={formData.estudiante_id}
                onChange={(e) => setFormData({ ...formData, estudiante_id: e.target.value })}
                label="Estudiante"
                required
              >
                {estudiantes.map((estudiante) => (
                  <MenuItem key={estudiante.id} value={estudiante.id}>
                    {estudiante.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Materia</InputLabel>
              <Select
                value={formData.materia_id}
                onChange={(e) => setFormData({ ...formData, materia_id: e.target.value })}
                label="Materia"
                required
              >
                {materias.map((materia) => (
                  <MenuItem key={materia.id} value={materia.id}>
                    {materia.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Fecha Matrícula"
              type="date"
              value={formData.fecha_inscripcion}
              onChange={(e) => setFormData({ ...formData, fecha_inscripcion: e.target.value })}
              margin="normal"
              required
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                label="Estado"
                required
              >
                <MenuItem value="ACTIVO">Activo</MenuItem>
                <MenuItem value="INACTIVO">Inactivo</MenuItem>
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
            {editingRelacion ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EstudianteMateria; 