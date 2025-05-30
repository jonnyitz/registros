const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// CONEXIÓN A BASE DE DATOS EN RAILWAY
const db = mysql.createPool({
  host: 'trolley.proxy.rlwy.net',
  port: 25676,
  user: 'root',
  password: 'vaLprXySwDUQwAwZVSXTMfDkJvRkzaHC',
  database: 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


db.connect(err => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    process.exit(1); // Finaliza si hay error
  }
  console.log('Conectado a la base de datos MySQL');
});

// GET desde raíz → https://practical-dedication-production.up.railway.app/
app.get('/', (req, res) => {
  db.query('SELECT * FROM registros', (err, results) => {
    if (err) {
      console.error('Error al obtener registros:', err);
      return res.status(500).json({ error: 'Error al obtener registros' });
    }
    res.json(results);
  });
});

// POST también en raíz → útil para guardar nuevos registros
app.post('/', (req, res) => {
  const data = req.body;

  const sql = `
    INSERT INTO registros (
      nombre_conductor, nombre_acompanante, tipo_vehiculo,
      marca, placas, destino, proyecto, hora_salida,
      hora_regreso, actividad, km_salida, km_regreso,
      combustible, observaciones, licencia, tarjeta_circulacion,
      verificacion_vigente, poliza_seguro, firma
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.conductor || null,
    data.acompanante || null,
    data.tipoVehiculo || null,
    data.marca || null,
    data.placas || null,
    data.destino || null,
    data.proyecto || null,
    data.horaSalida || null,
    data.horaRegreso || null,
    data.actividad || null,
    parseInt(data.kmSalida) || 0,
    parseInt(data.kmRegreso) || 0,
    data.combustible || null,
    data.observaciones || null,
    data.licencia ? 1 : 0,
    data.tarjetaCirculacion ? 1 : 0,
    data.verificacion ? 1 : 0,
    data.polizaSeguro ? 1 : 0,
    null // firma, opcional
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error al guardar vehículo:', err);
      return res.status(500).json({ error: 'Error al guardar vehículo' });
    }
    res.json({ message: 'Vehículo guardado', id: result.insertId });
  });
});

// Asegúrate de usar el puerto que Railway asigna
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
