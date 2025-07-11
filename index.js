const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// CONEXIÓN A BASE DE DATOS EN RAILWAY
// db.js o al inicio de tu archivo si no lo separas en módulos
const mysql = require('mysql2');

// CONEXIÓN A BASE DE DATOS EN RAILWAY
const db = mysql.createConnection({
  host: 'trolley.proxy.rlwy.net',
  port: 25676,
  user: 'root',
  password: 'vaLprXySwDUQwAwZVSXTMfDkJvRkzaHC',
  database: 'railway'
});



module.exports = pool.promise(); // Para usar con async/await


db.connect(err => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    process.exit(1); // Finaliza si hay error
  }
  console.log('Conectado a la base de datos MySQL');
});

// ENDPOINT para agregar la columna imagen_url
app.get('/agregar-columna-imagen', (req, res) => {
  const sql = `ALTER TABLE registros ADD COLUMN imagen_url VARCHAR(255)`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error al agregar columna:', err);
      return res.status(500).json({ error: 'No se pudo agregar la columna, probablemente ya exista' });
    }
    res.json({ message: 'Columna imagen_url agregada correctamente' });
  });
});

// NUEVO ENDPOINT PARA VER LA ESTRUCTURA DE LA TABLA
app.get('/describe', (req, res) => {
  db.query('DESCRIBE registros', (err, results) => {
    if (err) {
      console.error('Error al describir la tabla:', err);
      return res.status(500).json({ error: 'Error al describir la tabla' });
    }
    res.json(results);
  });
});

// GET desde raíz → https://practical-dedication-production.up.railway.app/
app.get('/', (req, res) => {
  db.query('SELECT * FROM registros', (err, results) => {
    if (err) {
      console.error('Error al obtener registros:', err);
      return res.status(500).json({ error: 'Error al obtener registros' });
    }

    // Convertir el campo 'firma' de Buffer a string base64 con prefijo de imagen
    const registrosConFirma = results.map(registro => {
     if (registro.firma && Buffer.isBuffer(registro.firma)) {
        const base64Str = registro.firma.toString('base64');
        // Mostrar solo primeros 30 caracteres + '...'
        registro.firma = 'data:image/png;base64,' + base64Str.substring(0, 30) + '...';
      }
      return registro;
    });

    res.json(registrosConFirma);
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
  verificacion_vigente, poliza_seguro, firma, imagen_url
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

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
  data. verificacion ? 1 : 0,
  data.polizaSeguro ? 1 : 0,
  data.firma || null,
  data.imagen_url || null
];

 // Aquí los console.log para depurar
  console.log('SQL:', sql);
  console.log('Values:', values);
  console.log('BODY:', req.body);

  db.query(sql, values, (err, result) => {
   if (err) {
  console.error('Error al guardar vehículo:', err);
  return res.status(500).json({ error: err.sqlMessage || err.message || 'Error desconocido' });
}
    res.json({ message: 'Vehículo guardado', id: result.insertId });
  });
});

// Asegúrate de usar el puerto que Railway asigna
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
