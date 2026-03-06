const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");


const app = express();
app.set('trust proxy', true);
app.use(cors());
app.use(express.static("public"));
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

app.get("/usuarios/:id", (req, res) => {
    const { id } = req.params;

    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json(row);
    });
});

app.put("/usuarios/:id", (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    db.run("UPDATE users SET name = ? WHERE id = ?", [name, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json({ message: "Usuario actualizado correctamente" });
    });
});

app.delete("/usuarios/:id", (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM users WHERE id = ?", id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json({ message: "Usuario eliminado correctamente" });
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo y ESCUCHANDO EN RED en el puerto ${PORT}`);
});