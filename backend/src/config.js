require('dotenv').config();

module.exports = {
  datasource: process.env.DATASOURCE || 'mock',
  port: process.env.PORT || 4000,
  bigquery: {
    projectId: process.env.BIGQUERY_PROJECT_ID,
    dataset: process.env.BIGQUERY_DATASET || 'dashboard',
    table: process.env.BIGQUERY_TABLE || 'ventas',
  },
};
