const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
 host: 'trolley.proxy.rlwy.net',
  port: 25676,
  user: 'root',
  password: 'vaLprXySwDUQwAwZVSXTMfDkJvRkzaHC',
  database: 'railway'
});

db.connect(err => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    process.exit(1);
  }
  console.log('Conectado a la base de datos MySQL');
});

// Ruta POST para guardar vehículo
app.post('/vehiculos', (req, res) => {
  const data = req.body;

  const sql = `
    INSERT INTO registros (
      nombre_conductor,
      nombre_acompanante,
      tipo_vehiculo,
      marca,
      placas,
      destino,
      proyecto,
      hora_salida,
      hora_regreso,
      actividad,
      km_salida,
      km_regreso,
      combustible,
      observaciones,
      licencia,
      tarjeta_circulacion,
      verificacion_vigente,
      poliza_seguro,
      firma
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
    null // firma, luego puedes manejarlo
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error al guardar vehículo:', err);
      return res.status(500).json({ error: 'Error al guardar vehículo' });
    }
    res.json({ message: 'Vehículo guardado', id: result.insertId });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
