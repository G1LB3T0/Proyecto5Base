-- ===============================================
-- LABORATORIO 3 - BASE DE DATOS COMPLETA
-- Universidad del Valle de Guatemala
-- ===============================================

-- Limpiar base de datos
DROP VIEW IF EXISTS vista_estudiantes_materias;
DROP TABLE IF EXISTS estudiante_materia CASCADE;
DROP TABLE IF EXISTS estudiantes CASCADE;
DROP TABLE IF EXISTS materias CASCADE;
DROP TYPE IF EXISTS estado_estudiante CASCADE;
DROP TYPE IF EXISTS nivel_dificultad CASCADE;

-- ===============================================
-- 1. TIPOS DE DATOS PERSONALIZADOS (Mínimo 2)
-- ===============================================

-- Tipo para estado del estudiante
CREATE TYPE estado_estudiante AS ENUM (
    'ACTIVO',
    'INACTIVO', 
    'GRADUADO',
    'SUSPENDIDO'
);

-- Tipo para nivel de dificultad de materias
CREATE TYPE nivel_dificultad AS ENUM (
    'BASICO',
    'INTERMEDIO',
    'AVANZADO',
    'EXPERTO'
);

-- ===============================================
-- 2. DEFINICIÓN DE TABLAS
-- ===============================================

-- Tabla principal: ESTUDIANTES
CREATE TABLE estudiantes (
    id SERIAL PRIMARY KEY,
    codigo_estudiante VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(15),
    fecha_nacimiento DATE NOT NULL,
    fecha_ingreso DATE NOT NULL DEFAULT CURRENT_DATE,
    estado estado_estudiante NOT NULL DEFAULT 'ACTIVO',
    promedio_general DECIMAL(4,2) DEFAULT 0.00,
    creditos_completados INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Restricciones CHECK
    CONSTRAINT check_promedio CHECK (promedio_general >= 0.00 AND promedio_general <= 100.00),
    CONSTRAINT check_creditos CHECK (creditos_completados >= 0),
    CONSTRAINT check_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT check_fecha_nacimiento CHECK (fecha_nacimiento < CURRENT_DATE),
    CONSTRAINT check_fecha_ingreso CHECK (fecha_ingreso <= CURRENT_DATE)
);

-- Tabla relacionada: MATERIAS
CREATE TABLE materias (
    id SERIAL PRIMARY KEY,
    codigo_materia VARCHAR(8) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    creditos INTEGER NOT NULL,
    nivel nivel_dificultad NOT NULL DEFAULT 'BASICO',
    prerequisitos TEXT,
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Restricciones CHECK
    CONSTRAINT check_creditos_materia CHECK (creditos > 0 AND creditos <= 6),
    CONSTRAINT check_nombre_no_vacio CHECK (LENGTH(TRIM(nombre)) > 0)
);

-- Tabla intermedia: ESTUDIANTE_MATERIA (Many-to-Many)
CREATE TABLE estudiante_materia (
    id SERIAL PRIMARY KEY,
    estudiante_id INTEGER NOT NULL,
    materia_id INTEGER NOT NULL,
    calificacion DECIMAL(4,2),
    fecha_inscripcion DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_finalizacion DATE,
    estado VARCHAR(20) NOT NULL DEFAULT 'CURSANDO',
    intentos INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Claves foráneas
    CONSTRAINT fk_estudiante FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
    CONSTRAINT fk_materia FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
    
    -- Restricciones CHECK
    CONSTRAINT check_calificacion CHECK (calificacion IS NULL OR (calificacion >= 0.00 AND calificacion <= 100.00)),
    CONSTRAINT check_estado_materia CHECK (estado IN ('CURSANDO', 'APROBADO', 'REPROBADO', 'RETIRADO')),
    CONSTRAINT check_intentos CHECK (intentos > 0 AND intentos <= 3),
    CONSTRAINT check_fecha_finalizacion CHECK (fecha_finalizacion IS NULL OR fecha_finalizacion >= fecha_inscripcion),
    
    -- Restricción única: Un estudiante no puede inscribirse dos veces a la misma materia activa
    CONSTRAINT unique_estudiante_materia_activa UNIQUE (estudiante_id, materia_id)
);

-- ===============================================
-- 3. ÍNDICES PARA OPTIMIZACIÓN
-- ===============================================

CREATE INDEX idx_estudiantes_estado ON estudiantes(estado);
CREATE INDEX idx_estudiantes_email ON estudiantes(email);
CREATE INDEX idx_materias_activa ON materias(activa);
CREATE INDEX idx_estudiante_materia_estudiante ON estudiante_materia(estudiante_id);
CREATE INDEX idx_estudiante_materia_materia ON estudiante_materia(materia_id);
CREATE INDEX idx_estudiante_materia_estado ON estudiante_materia(estado);

-- ===============================================
-- 4. INSERCIÓN DE DATOS (30 registros cada tabla)
-- ===============================================

-- Insertar 30 ESTUDIANTES
INSERT INTO estudiantes (codigo_estudiante, nombre, apellido, email, telefono, fecha_nacimiento, fecha_ingreso, estado, promedio_general, creditos_completados) VALUES
('EST001', 'Carlos', 'Mendoza', 'carlos.mendoza@uvg.edu.gt', '5551-2345', '2002-03-15', '2023-01-15', 'ACTIVO', 85.50, 45),
('EST002', 'María', 'González', 'maria.gonzalez@uvg.edu.gt', '5552-3456', '2001-07-22', '2022-08-20', 'ACTIVO', 92.30, 78),
('EST003', 'José', 'Rodríguez', 'jose.rodriguez@uvg.edu.gt', '5553-4567', '2003-01-10', '2023-01-15', 'ACTIVO', 78.90, 32),
('EST004', 'Ana', 'López', 'ana.lopez@uvg.edu.gt', '5554-5678', '2000-11-05', '2022-01-10', 'GRADUADO', 96.75, 120),
('EST005', 'Pedro', 'Martínez', 'pedro.martinez@uvg.edu.gt', '5555-6789', '2002-09-18', '2023-01-15', 'ACTIVO', 81.20, 28),
('EST006', 'Luisa', 'García', 'luisa.garcia@uvg.edu.gt', '5556-7890', '2001-05-12', '2022-08-20', 'ACTIVO', 88.40, 65),
('EST007', 'Miguel', 'Hernández', 'miguel.hernandez@uvg.edu.gt', '5557-8901', '2003-12-03', '2024-01-15', 'ACTIVO', 75.60, 15),
('EST008', 'Carmen', 'Jiménez', 'carmen.jimenez@uvg.edu.gt', '5558-9012', '2002-04-27', '2023-01-15', 'SUSPENDIDO', 65.30, 22),
('EST009', 'Roberto', 'Morales', 'roberto.morales@uvg.edu.gt', '5559-0123', '2000-08-14', '2021-08-15', 'GRADUADO', 91.80, 125),
('EST010', 'Elena', 'Vargas', 'elena.vargas@uvg.edu.gt', '5550-1234', '2003-02-28', '2024-01-15', 'ACTIVO', 83.70, 18),
('EST011', 'David', 'Castillo', 'david.castillo@uvg.edu.gt', '5551-2346', '2001-10-16', '2022-08-20', 'ACTIVO', 87.20, 72),
('EST012', 'Sofía', 'Romero', 'sofia.romero@uvg.edu.gt', '5552-3457', '2002-06-09', '2023-01-15', 'ACTIVO', 94.10, 41),
('EST013', 'Fernando', 'Torres', 'fernando.torres@uvg.edu.gt', '5553-4568', '2003-03-25', '2024-01-15', 'ACTIVO', 76.80, 12),
('EST014', 'Gabriela', 'Ruiz', 'gabriela.ruiz@uvg.edu.gt', '5554-5679', '2000-12-11', '2021-08-15', 'GRADUADO', 89.60, 128),
('EST015', 'Andrés', 'Delgado', 'andres.delgado@uvg.edu.gt', '5555-6790', '2002-07-04', '2023-01-15', 'ACTIVO', 82.50, 35),
('EST016', 'Valeria', 'Ortega', 'valeria.ortega@uvg.edu.gt', '5556-7891', '2001-01-19', '2022-08-20', 'INACTIVO', 79.90, 58),
('EST017', 'Alejandro', 'Medina', 'alejandro.medina@uvg.edu.gt', '5557-8902', '2003-08-07', '2024-01-15', 'ACTIVO', 86.30, 8),
('EST018', 'Daniela', 'Guerrero', 'daniela.guerrero@uvg.edu.gt', '5558-9013', '2002-11-23', '2023-08-20', 'ACTIVO', 90.70, 25),
('EST019', 'Ricardo', 'Peña', 'ricardo.pena@uvg.edu.gt', '5559-0124', '2000-04-02', '2021-01-10', 'GRADUADO', 93.40, 132),
('EST020', 'Isabella', 'Cruz', 'isabella.cruz@uvg.edu.gt', '5550-1235', '2003-09-15', '2024-01-15', 'ACTIVO', 81.80, 6),
('EST021', 'Manuel', 'Vega', 'manuel.vega@uvg.edu.gt', '5551-2347', '2001-12-30', '2022-08-20', 'ACTIVO', 84.60, 68),
('EST022', 'Camila', 'Ramos', 'camila.ramos@uvg.edu.gt', '5552-3458', '2002-05-17', '2023-01-15', 'ACTIVO', 91.20, 38),
('EST023', 'Javier', 'Silva', 'javier.silva@uvg.edu.gt', '5553-4569', '2003-10-08', '2024-08-20', 'ACTIVO', 77.40, 4),
('EST024', 'Natalia', 'Flores', 'natalia.flores@uvg.edu.gt', '5554-5680', '2000-02-13', '2021-01-10', 'GRADUADO', 95.80, 135),
('EST025', 'Óscar', 'Aguilar', 'oscar.aguilar@uvg.edu.gt', '5555-6791', '2002-08-26', '2023-08-20', 'SUSPENDIDO', 62.10, 19),
('EST026', 'Paola', 'Herrera', 'paola.herrera@uvg.edu.gt', '5556-7892', '2001-06-21', '2022-01-10', 'ACTIVO', 88.90, 85),
('EST027', 'Diego', 'Mendez', 'diego.mendez@uvg.edu.gt', '5557-8903', '2003-04-14', '2024-01-15', 'ACTIVO', 79.30, 11),
('EST028', 'Lucía', 'Moreno', 'lucia.moreno@uvg.edu.gt', '5558-9014', '2002-01-06', '2023-01-15', 'ACTIVO', 87.70, 42),
('EST029', 'Rodrigo', 'Paredes', 'rodrigo.paredes@uvg.edu.gt', '5559-0125', '2000-09-29', '2021-08-15', 'GRADUADO', 92.60, 140),
('EST030', 'Andrea', 'Soto', 'andrea.soto@uvg.edu.gt', '5550-1236', '2003-07-11', '2024-08-20', 'ACTIVO', 85.40, 5);

-- Insertar 30 MATERIAS
INSERT INTO materias (codigo_materia, nombre, descripcion, creditos, nivel, prerequisitos, activa) VALUES
('MAT101', 'Matemática Básica', 'Fundamentos de álgebra y aritmética', 4, 'BASICO', 'Ninguno', TRUE),
('MAT201', 'Cálculo I', 'Límites, derivadas e integrales básicas', 5, 'INTERMEDIO', 'MAT101', TRUE),
('MAT301', 'Cálculo II', 'Integrales múltiples y series', 5, 'AVANZADO', 'MAT201', TRUE),
('FIS101', 'Física I', 'Mecánica clásica y cinemática', 4, 'INTERMEDIO', 'MAT101', TRUE),
('FIS201', 'Física II', 'Electricidad y magnetismo', 4, 'AVANZADO', 'FIS101, MAT201', TRUE),
('QUI101', 'Química General', 'Fundamentos de química inorgánica', 4, 'BASICO', 'Ninguno', TRUE),
('QUI201', 'Química Orgánica', 'Compuestos orgánicos y reacciones', 4, 'INTERMEDIO', 'QUI101', TRUE),
('BIO101', 'Biología General', 'Fundamentos de biología celular', 3, 'BASICO', 'Ninguno', TRUE),
('BIO201', 'Biología Molecular', 'Genética y bioquímica', 4, 'AVANZADO', 'BIO101, QUI101', TRUE),
('INF101', 'Introducción a la Programación', 'Fundamentos de programación', 4, 'BASICO', 'Ninguno', TRUE),
('INF201', 'Programación Orientada a Objetos', 'POO y estructuras de datos', 5, 'INTERMEDIO', 'INF101', TRUE),
('INF301', 'Bases de Datos', 'Diseño y administración de BD', 4, 'AVANZADO', 'INF201', TRUE),
('INF401', 'Ingeniería de Software', 'Metodologías de desarrollo', 5, 'EXPERTO', 'INF301', TRUE),
('EST101', 'Estadística Básica', 'Estadística descriptiva e inferencial', 3, 'INTERMEDIO', 'MAT101', TRUE),
('EST201', 'Probabilidad', 'Teoría de probabilidades', 4, 'AVANZADO', 'EST101, MAT201', TRUE),
('ECO101', 'Microeconomía', 'Fundamentos económicos', 3, 'BASICO', 'Ninguno', TRUE),
('ECO201', 'Macroeconomía', 'Economía nacional e internacional', 3, 'INTERMEDIO', 'ECO101', TRUE),
('ADM101', 'Administración General', 'Principios administrativos', 3, 'BASICO', 'Ninguno', TRUE),
('ADM201', 'Gestión de Proyectos', 'Planificación y control de proyectos', 4, 'INTERMEDIO', 'ADM101', TRUE),
('ING101', 'Inglés I', 'Inglés básico conversacional', 2, 'BASICO', 'Ninguno', TRUE),
('ING201', 'Inglés II', 'Inglés intermedio', 2, 'INTERMEDIO', 'ING101', TRUE),
('ING301', 'Inglés Técnico', 'Inglés para ingeniería', 2, 'AVANZADO', 'ING201', TRUE),
('FIL101', 'Filosofía', 'Introducción al pensamiento filosófico', 2, 'BASICO', 'Ninguno', TRUE),
('HIS101', 'Historia de Guatemala', 'Historia nacional', 2, 'BASICO', 'Ninguno', TRUE),
('ART101', 'Apreciación Artística', 'Arte y cultura general', 2, 'BASICO', 'Ninguno', TRUE),
('DEP101', 'Educación Física', 'Actividad física y deporte', 1, 'BASICO', 'Ninguno', TRUE),
('PSI101', 'Psicología General', 'Fundamentos psicológicos', 3, 'BASICO', 'Ninguno', TRUE),
('SOC101', 'Sociología', 'Estructura social', 2, 'BASICO', 'Ninguno', TRUE),
('MUS101', 'Música y Sociedad', 'Apreciación musical', 1, 'BASICO', 'Ninguno', TRUE),
('TEC101', 'Tecnología y Sociedad', 'Impacto tecnológico', 2, 'BASICO', 'Ninguno', FALSE);

-- Insertar relaciones ESTUDIANTE_MATERIA (más de 30 para demostrar relaciones múltiples)
INSERT INTO estudiante_materia (estudiante_id, materia_id, calificacion, fecha_inscripcion, fecha_finalizacion, estado, intentos) VALUES
-- Estudiante 1 (Carlos) - 4 materias
(1, 1, 88.50, '2023-01-20', '2023-05-15', 'APROBADO', 1),
(1, 10, 92.30, '2023-01-20', '2023-05-15', 'APROBADO', 1),
(1, 20, 85.70, '2023-08-25', '2023-12-10', 'APROBADO', 1),
(1, 26, 90.00, '2024-01-22', NULL, 'CURSANDO', 1),

-- Estudiante 2 (María) - 5 materias
(2, 1, 95.20, '2022-08-25', '2022-12-15', 'APROBADO', 1),
(2, 2, 91.80, '2023-01-20', '2023-05-15', 'APROBADO', 1),
(2, 4, 89.60, '2023-01-20', '2023-05-15', 'APROBADO', 1),
(2, 10, 96.40, '2022-08-25', '2022-12-15', 'APROBADO', 1),
(2, 11, 93.70, '2023-08-25', '2023-12-10', 'APROBADO', 1),

-- Estudiante 3 (José) - 3 materias
(3, 1, 82.10, '2023-01-20', '2023-05-15', 'APROBADO', 1),
(3, 6, 76.80, '2023-01-20', '2023-05-15', 'APROBADO', 1),
(3, 8, 80.90, '2023-08-25', '2023-12-10', 'APROBADO', 1),

-- Estudiante 4 (Ana) - Graduada, muchas materias
(4, 1, 98.50, '2022-01-15', '2022-05-20', 'APROBADO', 1),
(4, 2, 96.20, '2022-08-20', '2022-12-15', 'APROBADO', 1),
(4, 3, 94.80, '2023-01-20', '2023-05-15', 'APROBADO', 1),
(4, 4, 97.30, '2022-08-20', '2022-12-15', 'APROBADO', 1),
(4, 5, 95.60, '2023-08-25', '2023-12-10', 'APROBADO', 1),

-- Estudiante 5 (Pedro) - 3 materias
(5, 1, 79.40, '2023-01-20', '2023-05-15', 'APROBADO', 1),
(5, 10, 83.20, '2023-01-20', '2023-05-15', 'APROBADO', 1),
(5, 16, 78.90, '2023-08-25', NULL, 'CURSANDO', 1),

-- Estudiante 6 (Luisa) - 4 materias
(6, 1, 90.30, '2022-08-25', '2022-12-15', 'APROBADO', 1),
(6, 2, 87.60, '2023-01-20', '2023-05-15', 'APROBADO', 1),
(6, 14, 91.20, '2023-01-20', '2023-05-15', 'APROBADO', 1),
(6, 18, 86.50, '2023-08-25', '2023-12-10', 'APROBADO', 1),

-- Estudiante 7 (Miguel) - 2 materias (estudiante nuevo)
(7, 1, NULL, '2024-01-20', NULL, 'CURSANDO', 1),
(7, 20, 78.30, '2024-01-20', '2024-05-15', 'APROBADO', 1),

-- Estudiante 8 (Carmen) - Suspendida, algunas reprobadas
(8, 1, 68.20, '2023-01-20', '2023-05-15', 'APROBADO', 1),
(8, 10, 45.60, '2023-01-20', '2023-05-15', 'REPROBADO', 1),
(8, 6, 58.90, '2023-08-25', '2023-12-10', 'REPROBADO', 2),

-- Estudiante 9 (Roberto) - Graduado, muchas materias
(9, 1, 94.70, '2021-08-20', '2021-12-15', 'APROBADO', 1),
(9, 2, 91.30, '2022-01-15', '2022-05-20', 'APROBADO', 1),
(9, 3, 89.80, '2022-08-20', '2022-12-15', 'APROBADO', 1),
(9, 10, 95.40, '2021-08-20', '2021-12-15', 'APROBADO', 1),
(9, 11, 92.60, '2022-01-15', '2022-05-20', 'APROBADO', 1),
(9, 12, 90.20, '2022-08-20', '2022-12-15', 'APROBADO', 1),

-- Estudiante 10 (Elena) - 2 materias
(10, 1, NULL, '2024-01-20', NULL, 'CURSANDO', 1),
(10, 8, 85.40, '2024-01-20', '2024-05-15', 'APROBADO', 1),

-- Continuar con más estudiantes...
(11, 1, 89.70, '2022-08-25', '2022-12-15', 'APROBADO', 1),
(11, 2, 84.30, '2023-01-20', '2023-05-15', 'APROBADO', 1),
(11, 4, 87.90, '2023-01-20', '2023-05-15', 'APROBADO', 1),
(11, 14, 88.60, '2023-08-25', '2023-12-10', 'APROBADO', 1),

(12, 1, 96.80, '2023-01-20', '2023-05-15', 'APROBADO', 1),
(12, 10, 93.40, '2023-01-20', '2023-05-15', 'APROBADO', 1),
(12, 11, 94.90, '2023-08-25', '2023-12-10', 'APROBADO', 1),

(13, 1, NULL, '2024-01-20', NULL, 'CURSANDO', 1),
(13, 20, 75.60, '2024-01-20', '2024-05-15', 'APROBADO', 1),

(14, 1, 92.30, '2021-08-20', '2021-12-15', 'APROBADO', 1),
(14, 2, 88.70, '2022-01-15', '2022-05-20', 'APROBADO', 1),
(14, 3, 91.50, '2022-08-20', '2022-12-15', 'APROBADO', 1),
(14, 10, 89.90, '2021-08-20', '2021-12-15', 'APROBADO', 1),
(14, 11, 93.20, '2022-01-15', '2022-05-20', 'APROBADO', 1),

(15, 1, 84.60, '2023-01-20', '2023-05-15', 'APROBADO', 1),
(15, 6, 81.30, '2023-01-20', '2023-05-15', 'APROBADO', 1),
(15, 16, 79.80, '2023-08-25', NULL, 'CURSANDO', 1);

-- ===============================================
-- 5. VISTA PRINCIPAL (VIEW) - Requerimiento clave
-- ===============================================

CREATE VIEW vista_estudiantes_materias AS
SELECT 
    e.id as estudiante_id,
    e.codigo_estudiante,
    e.nombre as estudiante_nombre,
    e.apellido as estudiante_apellido,
    e.email,
    e.estado as estado_estudiante,
    e.promedio_general,
    e.creditos_completados,
    
    m.id as materia_id,
    m.codigo_materia,
    m.nombre as materia_nombre,
    m.creditos as creditos_materia,
    m.nivel as nivel_materia,
    
    em.id as inscripcion_id,
    em.calificacion,
    em.fecha_inscripcion,
    em.fecha_finalizacion,
    em.estado as estado_inscripcion,
    em.intentos,
    
    CASE 
        WHEN em.calificacion IS NULL THEN 'Sin Calificar'
        WHEN em.calificacion >= 61 THEN 'Aprobado'
        ELSE 'Reprobado'
    END as resultado,
    
    CASE 
        WHEN em.estado = 'CURSANDO' THEN 'En Curso'
        WHEN em.estado = 'APROBADO' THEN 'Completado'
        WHEN em.estado = 'REPROBADO' THEN 'Reprobado'
        ELSE 'Retirado'
    END as estado_descripcion
    
FROM estudiantes e
INNER JOIN estudiante_materia em ON e.id = em.estudiante_id
INNER JOIN materias m ON em.materia_id = m.id
ORDER BY e.apellido, e.nombre, m.nombre;

-- ===============================================
-- 6. FUNCIONES AUXILIARES Y TRIGGERS
-- ===============================================

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar timestamps
CREATE TRIGGER trg_estudiantes_updated_at
    BEFORE UPDATE ON estudiantes
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_materias_updated_at
    BEFORE UPDATE ON materias
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_estudiante_materia_updated_at
    BEFORE UPDATE ON estudiante_materia
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ===============================================
-- 7. CONSULTAS DE PRUEBA
-- ===============================================

-- Verificar datos insertados
SELECT 'Estudiantes' as tabla, COUNT(*) as total FROM estudiantes
UNION ALL
SELECT 'Materias' as tabla, COUNT(*) as total FROM materias
UNION ALL
SELECT 'Inscripciones' as tabla, COUNT(*) as total FROM estudiante_materia;

-- Probar la vista
SELECT * FROM vista_estudiantes_materias LIMIT 10;

-- Estudiantes con más materias
SELECT 
    estudiante_nombre, 
    estudiante_apellido, 
    COUNT(*) as total_materias,
    AVG(calificacion) as promedio_materias
FROM vista_estudiantes_materias 
WHERE calificacion IS NOT NULL
GROUP BY estudiante_id, estudiante_nombre, estudiante_apellido
ORDER BY total_materias DESC
LIMIT 5;