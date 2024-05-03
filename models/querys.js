const format = require("pg-format");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  // Configuración de conexión a tu base de datos PostgreSQL
  // user: process.env.PGUSER,
  // password: process.env.PGPASSWORD,
  // host: process.env.PGHOST,
  // database: process.env.PGDATABASE,
  // port: process.env.PGPORT,
});

const getJewelry = async ({ limits = 6, order_by = "id_ASC", page = 1 }) => {
  try {
  const [campo, direccion] = order_by.split("_");
  const offset = Math.abs((page - 1) * limits);
  const formattedQuery = format(
    "SELECT * FROM joyas ORDER BY %s %s LIMIT %s OFFSET %s",
    campo,
    direccion,
    limits,
    offset
  );
  const { rows: joyas } = await pool.query(formattedQuery);
  return joyas;
} catch (error) {
  throw new Error(`Error en getJewelry: ${error.message}`);
}
};

const getFilter = async ({ precio_max, precio_min, categoria, metal }) => {
  try {
  let filtros = [];
  const values = [];
  const addFilter = (campo, comparador, valor) => {
    values.push(valor);
    const { length } = filtros;
    filtros.push(`${campo} ${comparador} $${length + 1}`);
  };
  if (precio_max) addFilter("precio", "<=", precio_max);
  if (precio_min) addFilter("precio", ">=", precio_min);
  if (categoria) addFilter("categoria", "=", categoria);
  if (metal) addFilter("metal", "=", metal);
  let consulta = "SELECT * FROM joyas";
  if (filtros.length > 0) {
    filtros = filtros.join(" AND ");
    consulta += ` WHERE ${filtros}`;
  }
  const { rows: joyas } = await pool.query(consulta, values);
  return joyas;
} catch (error) {
  throw new Error(`Error en getFilter: ${error.message}`);
}
};

const jewelryHateoas = (joyas) => {
  try { 
  const results = joyas
    .map((j) => {
      return {
        name: j.nombre,
        href: `/joyas/joya/${j.id}`,
      };
    })
    .slice(0, 4);
  const totalJoyas = joyas.length;
  const stockTotal = joyas.reduce((total, item) => total + item.stock, 0);
  const HATEOAS = {
    totalJoyas,
    stockTotal,
    results,
  };
  return HATEOAS;
} catch (error) {
  throw new Error(`Error en jewelryHateoas: ${error.message}`);
}
};

module.exports = { getJewelry, getFilter, jewelryHateoas };
