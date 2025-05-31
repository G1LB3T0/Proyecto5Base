# Lab 3 - Tipos de datos personalizados y ORM

## Integrantes
- Joel Jaquez
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

## Configuración de la Base de Datos

1. Crear una base de datos en PostgreSQL:
```sql
CREATE DATABASE gestion_academica;
```

2. Ejecutar el archivo `init.sql` en pgAdmin para configurar los tipos de datos personalizados y la estructura inicial de la base de datos.

3. Crear el archivo `.env` en la carpeta `Back_End` con el siguiente contenido:
```env
# Configuración de la base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/gestion_academica?schema=public"

# Ejemplo con valores reales:
# DATABASE_URL="postgresql://postgres:123456@localhost:5432/gestion_academica?schema=public"
```

Reemplazar:
- `usuario`: Tu usuario de PostgreSQL (por ejemplo: postgres)
- `contraseña`: Tu contraseña de PostgreSQL (por ejemplo: 123456)
- `localhost`: La dirección de tu servidor PostgreSQL (por defecto es localhost)
- `5432`: El puerto de PostgreSQL (por defecto es 5432)
- `gestion_academica`: El nombre de la base de datos que creaste

Nota: El archivo `.env` debe estar en la raíz de la carpeta `Back_End` y no debe tener espacios alrededor del signo igual (=).

## Dependencias Backend
```bash
npm install express
npm install cors
npm install @prisma/client
npm install dotenv
```

## Dependencias Frontend
```bash
npm install
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

Nota: Es OBLIGATORIO ejecutar el comando de instalación de las dependencias de Material-UI después del `npm install` inicial en el Frontend.

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
- Asegurarse de que el archivo `.env` esté configurado correctamente
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

## Guía de Uso de la Interfaz

### Gestión de Estudiantes
1. Para crear un nuevo estudiante:
   - Hacer clic en el botón "Nuevo Estudiante"
   - Completar el formulario con los datos requeridos
   - Hacer clic en "Crear"

2. Para editar un estudiante:
   - Hacer clic en el icono de edición (lápiz) junto al estudiante
   - Modificar los datos necesarios
   - Hacer clic en "Actualizar"

3. Para eliminar un estudiante:
   - Hacer clic en el icono de eliminación (papelera) junto al estudiante
   - Confirmar la eliminación

### Gestión de Materias
1. Para crear una nueva materia:
   - Hacer clic en el botón "Nueva Materia"
   - Completar el formulario con los datos requeridos
   - Hacer clic en "Crear"

2. Para editar una materia:
   - Hacer clic en el icono de edición (lápiz) junto a la materia
   - Modificar los datos necesarios
   - Hacer clic en "Actualizar"

3. Para eliminar una materia:
   - Hacer clic en el icono de eliminación (papelera) junto a la materia
   - Confirmar la eliminación

### Gestión de Matrículas
1. Para crear una nueva matrícula:
   - Hacer clic en el botón "Nueva Matrícula"
   - Seleccionar el estudiante y la materia
   - Completar los datos adicionales
   - Hacer clic en "Crear"

2. Para editar una matrícula:
   - Hacer clic en el icono de edición (lápiz) junto a la matrícula
   - Modificar los datos necesarios
   - Hacer clic en "Actualizar"

3. Para eliminar una matrícula:
   - Hacer clic en el icono de eliminación (papelera) junto a la matrícula
   - Confirmar la eliminación

### Notas Importantes
- Los registros se muestran ordenados por fecha de creación (más recientes primero)
- Todos los campos marcados con * son obligatorios
- Los códigos de estudiante y materia deben ser únicos
- Un estudiante no puede estar matriculado dos veces en la misma materia
- La interfaz es responsiva y se adapta a diferentes tamaños de pantalla

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
