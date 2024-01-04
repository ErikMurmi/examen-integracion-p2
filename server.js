const express = require('express');

const datos = require('./datos');


const app = express();
app.use('/datos', datos);

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});
