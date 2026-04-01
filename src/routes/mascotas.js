const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * GET /api/mascotas
 * Obtener todas las mascotas
 */
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM mascotas ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener mascotas' });
  }
});

/**
 * GET /api/mascotas/:id
 * Obtener detalle de una mascota
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM mascotas WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener la mascota' });
  }
});

/**
 * POST /api/mascotas
 * Registrar nueva mascota
 */
router.post('/', async (req, res) => {
  const { nombre, especie, raza, edad, propietario, imagen_url, notas } = req.body;
  
  if (!nombre || !especie) {
    return res.status(400).json({ error: 'Nombre y especie son requeridos' });
  }

  try {
    const query = `
      INSERT INTO mascotas (nombre, especie, raza, edad, propietario, imagen_url, notas)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [nombre, especie, raza, edad, propietario, imagen_url, notas];
    const { rows } = await db.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar mascota' });
  }
});

/**
 * PUT /api/mascotas/:id
 * Actualizar mascota
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, especie, raza, edad, propietario, imagen_url, notas } = req.body;

  try {
    const query = `
      UPDATE mascotas
      SET nombre = $1, especie = $2, raza = $3, edad = $4, propietario = $5, imagen_url = $6, notas = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `;
    const values = [nombre, especie, raza, edad, propietario, imagen_url, notas, id];
    const { rows } = await db.query(query, values);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar mascota' });
  }
});

/**
 * DELETE /api/mascotas/:id
 * Eliminar mascota
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await db.query('DELETE FROM mascotas WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }
    res.json({ message: 'Mascota eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar mascota' });
  }
});

module.exports = router;
