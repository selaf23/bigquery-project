const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const projectId = process.env.BIGQUERY_PROJECT_ID;
const dataset = process.env.BIGQUERY_DATASET || 'dataset';
const table = process.env.BIGQUERY_TABLE || 'datos';

const CATEGORIES = ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Libros'];
const REGIONS = ['Norte', 'Sur', 'Este', 'Oeste', 'Centro'];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRows() {
  const rows = [];
  for (let year = 2024; year <= 2025; year++) {
    for (let month = 1; month <= 12; month++) {
      const days = new Date(year, month, 0).getDate();
      for (const category of CATEGORIES) {
        for (const region of REGIONS) {
          const baseMonthlyRevenue =
            category === 'Electrónica' ? 50000 :
            category === 'Ropa' ? 30000 :
            category === 'Hogar' ? 25000 :
            category === 'Deportes' ? 20000 : 15000;

          const seasonFactor =
            month === 11 || month === 12 ? 1.5 :
            month === 6 || month === 7 ? 1.2 : 1.0;

          const regionFactor =
            region === 'Norte' ? 1.1 :
            region === 'Centro' ? 1.2 :
            region === 'Este' ? 1.0 :
            region === 'Oeste' ? 0.9 : 0.8;

          const monthlyTotal = baseMonthlyRevenue * seasonFactor * regionFactor;
          const dailyBase = monthlyTotal / days;

          for (let day = 1; day <= days; day++) {
            const noise = 0.6 + Math.random() * 0.8;
            const fecha = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const revenue = Math.round(dailyBase * noise);
            const quantity = Math.round(revenue / (category === 'Electrónica' ? 500 : category === 'Ropa' ? 200 : 150));
            const avgPrice = Math.round(revenue / quantity);

            rows.push({ fecha, category, region, revenue, quantity, avg_price: avgPrice });
          }
        }
      }
    }
  }
  return rows;
}

async function seed() {
  const bq = new BigQuery({ projectId });

  const rows = generateRows();
  console.log(`Generated ${rows.length} rows. Inserting into \`${projectId}.${dataset}.${table}\`...`);

  const batchSize = 500;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    await bq.dataset(dataset).table(table).insert(batch);
    console.log(`  Inserted rows ${i + 1}–${Math.min(i + batchSize, rows.length)}`);
  }

  console.log('Seed complete.');
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
