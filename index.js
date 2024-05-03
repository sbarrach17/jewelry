// Importar módulos y configuraciones
const express = require("express");
const cors = require("cors");
const { getJewelry, getFilter, jewelryHateoas } = require("./models/querys");
const {errorHandler} = require("./middlewares/errorStatus");
const {activityLogger} = require ('./middlewares/report')

// Configurar la aplicación Express
const app = express();
app.use(cors());
app.use(express.json());
// Middleware de registro de actividad a todas las rutas
app.use(activityLogger);

// Definir el puerto de la aplicación
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor Iniciado http://localhost:${PORT}`);
});

// Ruta para obtener todas las joyas
app.get("/joyas", async (req, res, next) => {
  try {
    // Obtener parámetros de consulta
    const { limits, order_by, page } = req.query;
        // Obtener joyas según los parámetros
    const joyas = await getJewelry({ limits, order_by, page });
     // Aplicar HATEOAS a las joyas
    const HATEOAS = await jewelryHateoas(joyas);
    // Enviar respuesta
    res.json(HATEOAS);
  } catch (error) {
    // Manejar errores
    console.error("Error al obtener Joyeria:", error);
    next(error);
  }
});

// Ruta para obtener joyas filtradas
app.get("/joyas/filtros", async (req, res, next) => {
  try {
       // Obtener parámetros de consulta
    const queryStrings = req.query;
    // Obtener joyas filtradas
    const joyas = await getFilter(queryStrings);
    // Enviar respuesta
    res.json(joyas);
  } catch (error) {
    // Manejar errores
    console.error("Error al obtener Joyeria:", error);
    next(error);
  }
});

// Ruta de bienvenida
app.get("/", (req, res) => {
  res.send("Bienvenido, Servidor en NodeJS");
});

// Ruta para manejar rutas no definidas
app.get("*", (req, res) => {
  res.status(404).send("Esta ruta no existe");
});

// Middleware para manejar errores
app.use(errorHandler);
