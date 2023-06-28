const fs = require("fs");
const path = require("path");

const ruta = path.join(__dirname, "data.json");

function escribir(contenido) {
    return new Promise((resolve, reject) => {
        fs.writeFile(ruta, JSON.stringify(contenido, null, "\t"), "utf8", (error) => {
            if (error) reject(new Error("Error. No se puede escribir"));

            resolve(true);
        });
    });
}

function leer() {
    return new Promise((resolve, reject) => {
        fs.readFile(ruta, "utf8", (error, result) => {
            if (error) reject(new Error("Error. No se puede leer"));

            resolve(JSON.parse(result));
        });
    });
}

function generarId(pelis) {
    let mayorId = 0;

    pelis.forEach((peli) => {
        if (Number(peli.id) > mayorId) {
            mayorId = Number(peli.id);
        }
    });

    return mayorId + 1;
}

async function findAll() {
    const pelis = await leer();
    return pelis;
}

async function findOneById(id) {
    if (!id) throw new Error("Error. El Id está indefinido.");

    const pelis = await leer();
    const peli = pelis.find((element) => element.id === id);

    if (!peli) throw new Error("Error. El Id no corresponde a una peli existente.");

    return peli;
}

async function create(peli) {
    if (!peli?.title || !peli?.genre || !peli?.anio) throw new Error("Error. Datos incompletos.");

    let pelis = await leer();
    const cocheConId = { id: generarId(pelis), ...peli };

    pelis.push(cocheConId);
    await escribir(pelis);

    return cocheConId;
}

async function update(peli) {
    if (!peli?.id || !peli?.title || !peli?.genre[0] || !peli?.anio) throw new Error("Error. Datos incompletos.");

    let pelis = await leer();
    const indice = pelis.findIndex((element) => element.id === peli.id);

    if (indice < 0) throw new Error("Error. El Id no corresponde a una peli existente.");

    pelis[indice] = peli;
    await escribir(pelis);

    return pelis[indice];
}

async function destroy(id) {
    if (!id) throw new Error("Error. El Id está indefinido.");

    let pelis = await leer();
    const indice = pelis.findIndex((element) => element.id === id);

    if (indice < 0) throw new Error("Error. El Id no corresponde a una peli existente.");

    const peli = pelis[indice];
    pelis.splice(indice, 1);
    await escribir(pelis);

    return peli;
}

module.exports = { findOneById, findAll, create, update, destroy };