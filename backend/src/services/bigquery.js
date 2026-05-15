const { BigQuery } = require('@google-cloud/bigquery');
const config = require('../config');

let bq = null;

function getClient() {
  if (!bq) {
    bq = new BigQuery({
      projectId: config.bigquery.projectId,
    });
  }
  return bq;
}

async function query(sql) {
  const client = getClient();
  const [rows] = await client.query({ query: sql });
  return rows;
}

async function getSummary(from, to) {
  const where = buildWhere(from, to);
  const sql = `
    SELECT
      SUM(revenue) AS totalRevenue,
      SUM(quantity) AS totalOrders,
      ROUND(AVG(revenue / quantity), 2) AS avgOrderValue
    FROM \`${config.bigquery.projectId}.${config.bigquery.dataset}.${config.bigquery.table}\`
    ${where}
  `;
  const rows = await query(sql);
  const row = rows[0];

  const prevSql = `
    SELECT SUM(revenue) AS prevRevenue
    FROM \`${config.bigquery.projectId}.${config.bigquery.dataset}.${config.bigquery.table}\`
  `;
  const prevRows = await query(prevSql);
  const prevRevenue = prevRows[0].prevRevenue || 0;
  const growth = prevRevenue > 0
    ? (((row.totalRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1)
    : 0;

  return {
    totalRevenue: row.totalRevenue || 0,
    totalOrders: row.totalOrders || 0,
    growth,
    avgOrderValue: row.avgOrderValue || 0,
  };
}

async function getRevenueOverTime(from, to) {
  const where = buildWhere(from, to);
  const sql = `
    SELECT
      FORMAT_TIMESTAMP('%Y-%m-%d', fecha) AS day,
      SUM(revenue) AS value
    FROM \`${config.bigquery.projectId}.${config.bigquery.dataset}.${config.bigquery.table}\`
    ${where}
    GROUP BY day
    ORDER BY day
  `;
  const rows = await query(sql);
  return {
    labels: rows.map(r => r.day),
    values: rows.map(r => r.value),
  };
}

async function getSalesByCategory(from, to) {
  const where = buildWhere(from, to);
  const sql = `
    SELECT category AS label, SUM(revenue) AS value
    FROM \`${config.bigquery.projectId}.${config.bigquery.dataset}.${config.bigquery.table}\`
    ${where}
    GROUP BY category
  `;
  const rows = await query(sql);
  return {
    labels: rows.map(r => r.label),
    values: rows.map(r => r.value),
  };
}

async function getSalesByRegion(from, to) {
  const where = buildWhere(from, to);
  const sql = `
    SELECT region AS label, SUM(revenue) AS value
    FROM \`${config.bigquery.projectId}.${config.bigquery.dataset}.${config.bigquery.table}\`
    ${where}
    GROUP BY region
  `;
  const rows = await query(sql);
  return {
    labels: rows.map(r => r.label),
    values: rows.map(r => r.value),
  };
}

async function getMonthlyTrend(from, to) {
  const where = buildWhere(from, to);
  const sql = `
    SELECT
      FORMAT_TIMESTAMP('%Y-%m', fecha) AS month,
      category AS label,
      SUM(revenue) AS value
    FROM \`${config.bigquery.projectId}.${config.bigquery.dataset}.${config.bigquery.table}\`
    ${where}
    GROUP BY month, category
    ORDER BY month
  `;
  const rows = await query(sql);

  const grouped = {};
  for (const r of rows) {
    if (!grouped[r.month]) grouped[r.month] = {};
    grouped[r.month][r.label] = r.value;
  }
  const labels = Object.keys(grouped).sort();
  const categories = [...new Set(rows.map(r => r.label))];
  const datasets = categories.map(cat => ({
    label: cat,
    data: labels.map(m => grouped[m][cat] || 0),
  }));
  return { labels, datasets };
}

function buildWhere(from, to) {
  const clauses = [];
  if (from) clauses.push(`fecha >= '${from}'`);
  if (to) clauses.push(`fecha <= '${to}'`);
  return clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
}

module.exports = { getSummary, getRevenueOverTime, getSalesByCategory, getSalesByRegion, getMonthlyTrend };
