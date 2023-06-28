const express = require("express");
const { findOneById, findAll, create, update, destroy } = require("./database/data.manager.js");

require('dotenv').config();

const server = express();

// middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Crear una nueva peli (no hacía falta...)
server.post('/pelis', (req, res) => {
    const { title, genre, anio } = req.body;

    create({ title, genre, anio })
        .then((pelis) => res.status(201).send(pelis))
        .catch((error) => res.status(400).send(error.message));
});

// Actualizar una peli específica
server.put('/pelis/:id', (req, res) => {
    const { id } = req.params;
    const { title, genre, anio } = req.body;

    update({ id: Number(id), title, genre, anio })
        .then((peli) => res.status(200).send(peli))
        .catch((error) => res.status(400).send(error.message));
});

// Eliminar una peli específica
server.delete('/pelis/:id', (req, res) => {
    const { id } = req.params;

    destroy(Number(id))
        .then((peli) => res.status(200).send(peli))
        .catch((error) => res.status(400).send(error.message));
});

// Obtener todas las pelis
server.get('/pelis', (req, res) => {
    findAll()
        .then((pelis) => res.status(200).send(pelis))
        .catch((error) => res.status(400).send(error.message));
});

// Obtener una peli específica
server.get('/pelis/:id', (req, res) => {
    const { id } = req.params;

    findOneById(Number(id))
        .then((peli) => res.status(200).send(peli))
        .catch((error) => res.status(400).send(error.message));
});

// Rutas inexistentes
server.use('*', (req, res) => {
    res.status(404).send(`<h1>Error 404</h1><h3>La URL indicada no existe en este servidor</h3>`);
});

// Peticiones
server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`Corriendo en http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/pelis`);
});