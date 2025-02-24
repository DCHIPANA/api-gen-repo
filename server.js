const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const FILE_PATH = './consolidado.json';

// 🔹 Obtener todos los bienes (GET)
app.get('/getConsolidado', (req, res) => {
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        const bienes = JSON.parse(data);
        res.json(bienes);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer el archivo JSON' });
    }
});

// 🔹 Agregar un nuevo bien (POST)
app.post('/postBien', (req, res) => {
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        let bienes = JSON.parse(data);

        const nuevoBien = req.body;
        const existe = bienes.some(bien => bien.COD_2023 === nuevoBien.COD_2023);
        if (existe) {
            return res.status(400).json({
                des_msg: "El COD_2023 ya se encuentra registrado",
                cod_error: "COD_2023_DUPLICADO"
            });
        }
        const nuevoId = bienes.length > 0 ? bienes[bienes.length - 1].ID + 1 : 1;
        nuevoBien.ID = nuevoId;
        bienes.push(nuevoBien);

        fs.writeFileSync(FILE_PATH, JSON.stringify(bienes, null, 2), 'utf8');
        res.status(201).json({
            des_msg: 'Bien agregado correctamente',
            cod_error: "200"
        });
    } catch (error) {
        res.status(500).json({
            des_msg: 'Error al escribir en el archivo JSON',
            cod_error: "300"
        });
    }
});

// 🔹 Actualizar un bien (PUT)
app.put('/putBien/:id', (req, res) => {
    try {
        const { id } = req.params;
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        let bienes = JSON.parse(data);
        const idNumero = parseInt(id, 10);

        const index = bienes.findIndex(bien => bien.ID === idNumero);
        if (index === -1) {
            return res.status(404).json({ 
                des_msg: "Bien no encontrado",
                cod_error: "201"
            });
        }

        bienes[index] = { ...bienes[index], ...req.body };

        fs.writeFileSync(FILE_PATH, JSON.stringify(bienes, null, 2), 'utf8');
        res.json({
            des_msg: "Bien actualizado correctamente",
            cod_error: "200"
        });
    } catch (error) {
        res.status(500).json({
            des_msg: "Error al actualizar JSON",
            cod_error: "300" });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});