const express = require('express');
const cors = require('cors');
const config = require('./config');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', datasource: config.datasource });
});

app.listen(config.port, () => {
  console.log(`Backend corriendo en http://localhost:${config.port}`);
  console.log(`Fuente de datos: ${config.datasource}`);
});
