import { useState } from 'react';
import { 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Tab, 
  Tabs,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import Estudiantes from './components/Estudiantes';
import Materias from './components/Materias';
import EstudianteMateria from './components/EstudianteMateria';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 500,
      marginBottom: '1rem'
    }
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: '2rem',
          paddingBottom: '2rem'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }
      }
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          marginTop: '1rem',
          marginBottom: '1rem'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px'
        },
        head: {
          backgroundColor: '#f5f5f5',
          fontWeight: 600
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8
        }
      }
    }
  }
});

function App() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: 'background.default'
      }}>
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Sistema de Gestión Académica
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          width: '100%'
        }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            centered
            sx={{
              '& .MuiTab-root': {
                minWidth: 120,
                fontSize: '1rem'
              }
            }}
          >
            <Tab label="Estudiantes" />
            <Tab label="Materias" />
            <Tab label="Inscripciones" />
          </Tabs>
        </Box>

        <Container 
          maxWidth={false}
          sx={{ 
            flex: 1,
            py: 4,
            px: { xs: 2, sm: 3, md: 4 },
            width: '100%',
            maxWidth: '100% !important'
          }}
        >
          {tabValue === 0 && <Estudiantes />}
          {tabValue === 1 && <Materias />}
          {tabValue === 2 && <EstudianteMateria />}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
