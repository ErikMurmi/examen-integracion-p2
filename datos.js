require('dotenv').config(); 
const express = require('express');
const router = express.Router();
const axios = require('axios');
const mysql = require('mysql');

const ciudades_table = process.env.CIUDADES
const usuarios_table = process.env.USUARIOS

// Crear la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'clientes_p2'
  });
  
// Conectar a la base de datos
db.connect((err) => {
    if (err) throw err;
    console.log('Conexión a la base de datos establecida');
  });

router.get('/ver/:usuario', (req, res) => {
    let sql = `SELECT ciudad FROM ${usuarios_table} WHERE Usuario = ${mysql.escape(req.params.usuario)}`;
    db.query(sql, (err, results) => {
      if (err) throw err;
      let ciudad = results[0].ciudad;
      let sql = `SELECT * FROM ${ciudades_table} WHERE ciudad = ${mysql.escape(ciudad)}`;
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
      });
    });
  });

router.get('/actualizar', async (req, res) => {
    let sql = `SELECT ciudad FROM ${usuarios_table}`;
    db.query(sql, async (err, results) => {
      if (err) throw err;
      for (let result of results) {
        let ciudad = result.ciudad;
        let response = await axios.get(`https://geocode.xyz/${ciudad}?json=1&auth=${process.env.AUTH}`);
        console.log(response.data)
        let loc = response.data.alt.loc[0];
        let sql = `INSERT IGNORE INTO ${ciudades_table} (ciudad, longt, prov, postal, score, latt) VALUES (?, ?, ?, ?, ?, ?)`;
        db.query(sql, [loc.city, loc.longt, loc.prov, loc.postal, loc.score, loc.latt], (err, result) => {
          if (err) throw err;
        });
      }
      res.send('Datos de las ciudades obtenidos y guardados correctamente');
    });
  });

// Exportar el router para usarlo en otros archivos
module.exports = router;
