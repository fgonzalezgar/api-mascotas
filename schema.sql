-- Crear tabla de mascotas
CREATE TABLE IF NOT EXISTS mascotas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raza VARCHAR(50),
    edad INTEGER,
    propietario VARCHAR(100),
    imagen_url TEXT,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ejemplo de inserción inicial
INSERT INTO mascotas (nombre, especie, raza, edad, propietario) 
VALUES ('Firulais', 'Perro', 'Labrador', 3, 'Fernando');
