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
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const API_URL = 'http://localhost:3000/api';

function Estudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingEstudiante, setEditingEstudiante] = useState(null);
  const [formData, setFormData] = useState({
    codigo_estudiante: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    estado: 'ACTIVO'
  });

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  const fetchEstudiantes = async () => {
    try {
      const response = await fetch(`${API_URL}/estudiantes`);
      const data = await response.json();
      if (data.success) {
        // Ordenar por ID de forma descendente (más recientes primero)
        const estudiantesOrdenados = data.data.sort((a, b) => b.id - a.id);
        setEstudiantes(estudiantesOrdenados);
      }
    } catch (error) {
      console.error('Error al obtener estudiantes:', error);
    }
  };

  const handleOpen = (estudiante = null) => {
    if (estudiante) {
      setEditingEstudiante(estudiante);
      setFormData({
        ...estudiante,
        fecha_nacimiento: estudiante.fecha_nacimiento.split('T')[0]
      });
    } else {
      setEditingEstudiante(null);
      setFormData({
        codigo_estudiante: '',
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        fecha_nacimiento: '',
        estado: 'ACTIVO'
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingEstudiante(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingEstudiante
        ? `${API_URL}/estudiantes/${editingEstudiante.id}`
        : `${API_URL}/estudiantes`;
      
      const method = editingEstudiante ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        fetchEstudiantes();
        handleClose();
      }
    } catch (error) {
      console.error('Error al guardar estudiante:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este estudiante?')) {
      try {
        const response = await fetch(`${API_URL}/estudiantes/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.success) {
          fetchEstudiantes();
        }
      } catch (error) {
        console.error('Error al eliminar estudiante:', error);
      }
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'ACTIVO':
        return 'success';
      case 'INACTIVO':
        return 'error';
      case 'GRADUADO':
        return 'info';
      case 'SUSPENDIDO':
        return 'warning';
      default:
        return 'default';
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
          Gestión de Estudiantes
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()}
          startIcon={<AddIcon />}
        >
          Nuevo Estudiante
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
              <TableCell>Apellido</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {estudiantes.map((estudiante) => (
              <TableRow key={estudiante.id}>
                <TableCell>{estudiante.codigo_estudiante}</TableCell>
                <TableCell>{estudiante.nombre}</TableCell>
                <TableCell>{estudiante.apellido}</TableCell>
                <TableCell>{estudiante.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={estudiante.estado} 
                    color={getEstadoColor(estudiante.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton 
                    onClick={() => handleOpen(estudiante)} 
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(estudiante.id)} 
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
          {editingEstudiante ? 'Editar Estudiante' : 'Nuevo Estudiante'}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Código"
              value={formData.codigo_estudiante}
              onChange={(e) => setFormData({ ...formData, codigo_estudiante: e.target.value })}
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
              label="Apellido"
              value={formData.apellido}
              onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              margin="normal"
              required
              size="small"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
              required
              size="small"
            />
            <TextField
              fullWidth
              label="Teléfono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              margin="normal"
              size="small"
            />
            <TextField
              fullWidth
              label="Fecha de Nacimiento"
              type="date"
              value={formData.fecha_nacimiento}
              onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
              size="small"
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
                <MenuItem value="GRADUADO">Graduado</MenuItem>
                <MenuItem value="SUSPENDIDO">Suspendido</MenuItem>
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
            {editingEstudiante ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Estudiantes; 