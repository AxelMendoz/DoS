const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const morgan = require("morgan");


const app = express();
const PORT = 3000;



app.use(bodyParser.json());
app.use(morgan("combined"));

const db = new sqlite3.Database("database.db");

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");
});

app.post("/guardar", (req, res) => {
    const { name } = req.body;

    db.run("INSERT INTO users (name) VALUES (?)", [name], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Guardado correctamente", id: this.lastID });
    });
});

app.get("/usuarios", (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});