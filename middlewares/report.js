const activityLogger = (req, res, next) => {
  // Obtener la ruta consultada
  const route = req.path;
  // Obtener la fecha y hora actual
  const timestamp = new Date().toISOString();
  // Registrar la actividad (en este caso, simplemente imprimirla)
  console.log(`[ACTIVITY LOG] Consulta a la ruta ${route} realizada en ${timestamp}`);
  // Pasar la solicitud al siguiente middleware
  next();
};

module.exports = {activityLogger}