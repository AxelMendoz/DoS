const axios = require("axios");

const URL = "http://localhost:3000/guardar";

async function enviarPeticiones() {
    console.log("Iniciando envío masivo de peticiones...");

    for (let i = 0; i < 500; i++) {
        axios.post(URL, { name: "Carga" + i })
            .then(() => console.log("Enviado:", i))
            .catch(err => console.error("Error:", err.message));
    }
}

enviarPeticiones();