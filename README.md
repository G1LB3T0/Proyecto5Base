# Lab 3 - Tipos de datos personalizados y ORM

## Integrantes
- Joel Jaques
- Luis Gonzalez

## Descripción
Sistema de Gestión Académica que permite administrar estudiantes, materias y sus relaciones utilizando PostgreSQL con tipos de datos personalizados y Prisma como ORM.

## Estructura del Proyecto
```
Proyecto5Base/
├── Back_End/         # Servidor Node.js con Express y Prisma
└── Front_End/        # Aplicación React con Material-UI
```

## Requisitos Previos
- Node.js (v14 o superior)
- PostgreSQL
- npm o yarn

## Dependencias Backend
```bash
npm install express
npm install cors
npm install @prisma/client
npm install dotenv
```

## Dependencias Frontend
```bash
npm install @mui/material
npm install @emotion/react
npm install @emotion/styled
npm install @mui/icons-material
```

## Configuración y Ejecución

### Backend
1. Navegar al directorio del backend:
```bash
cd Proyecto5Base/Back_End
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar la base de datos:
- Crear un archivo .env con las credenciales de la base de datos
- Ejecutar las migraciones de Prisma:
```bash
npx prisma generate
npx prisma db push
```

4. Iniciar el servidor:
```bash
node index.js
```

El servidor se ejecutará en http://localhost:3000

### Frontend
1. Navegar al directorio del frontend:
```bash
cd Proyecto5Base/Front_End
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar la aplicación:
```bash
npm run dev
```

La aplicación se ejecutará en http://localhost:5173

## Características Implementadas
- Gestión de Estudiantes (CRUD)
- Gestión de Materias (CRUD)
- Gestión de Matrículas (CRUD)
- Interfaz responsiva con Material-UI
- Validación de datos
- Manejo de errores
- Tipos de datos personalizados en PostgreSQL
- ORM con Prisma

## Endpoints API

### Estudiantes
- GET /api/estudiantes - Obtener todos los estudiantes
- POST /api/estudiantes - Crear un nuevo estudiante
- PUT /api/estudiantes/:id - Actualizar un estudiante
- DELETE /api/estudiantes/:id - Eliminar un estudiante

### Materias
- GET /api/materias - Obtener todas las materias
- POST /api/materias - Crear una nueva materia
- PUT /api/materias/:id - Actualizar una materia
- DELETE /api/materias/:id - Eliminar una materia

### Matrículas
- GET /api/estudiante-materia - Obtener todas las matrículas
- POST /api/estudiante-materia - Crear una nueva matrícula
- PUT /api/estudiante-materia/:id - Actualizar una matrícula
- DELETE /api/estudiante-materia/:id - Eliminar una matrícula