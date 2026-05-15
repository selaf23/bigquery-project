const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const projectId = process.env.BIGQUERY_PROJECT_ID;
const dataset = process.env.BIGQUERY_DATASET || 'dataset';
const table = process.env.BIGQUERY_TABLE || 'datos';

async function run() {
  const bq = new BigQuery({ projectId });

  const sql = fs
    .readFileSync(path.join(__dirname, '001_create_table.sql'), 'utf8')
    .replace('{project_id}', projectId)
    .replace('{dataset}', dataset)
    .replace('{table}', table);

  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const stmt of statements) {
    console.log(`Running: ${stmt.slice(0, 80)}...`);
    const [job] = await bq.createQueryJob({ query: stmt });
    await job.getQueryResults();
    console.log('  Done.');
  }

  console.log(`Migration complete. Table \`${projectId}.${dataset}.${table}\` is ready.`);
}

run().catch(err => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
