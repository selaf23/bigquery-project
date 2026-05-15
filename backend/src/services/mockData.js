const CATEGORIES = ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Libros'];
const REGIONS = ['Norte', 'Sur', 'Este', 'Oeste', 'Centro'];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMonthlyData(year, month) {
  const rows = [];
  for (const category of CATEGORIES) {
    for (const region of REGIONS) {
      const baseRevenue =
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

      const noise = 0.8 + Math.random() * 0.4;
      const revenue = Math.round(baseRevenue * seasonFactor * regionFactor * noise);
      const quantity = Math.round(revenue / (category === 'Electrónica' ? 500 : category === 'Ropa' ? 200 : 150));
      const avgPrice = Math.round(revenue / quantity);

      rows.push({
        year,
        month,
        category,
        region,
        revenue,
        quantity,
        avgPrice,
      });
    }
  }
  return rows;
}

function generateAllData() {
  let allData = [];
  for (let year = 2024; year <= 2025; year++) {
    for (let month = 1; month <= 12; month++) {
      allData = allData.concat(generateMonthlyData(year, month));
    }
  }
  return allData;
}

const data = generateAllData();

const MONTHS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function filterByRange(data, from, to) {
  if (!from && !to) return data;
  return data.filter(r => {
    const d = new Date(r.year, r.month - 1);
    if (from && d < new Date(from)) return false;
    if (to && d > new Date(to)) return false;
    return true;
  });
}

function getSummary(from, to) {
  const filtered = filterByRange(data, from, to);
  const totalRevenue = filtered.reduce((s, r) => s + r.revenue, 0);
  const totalOrders = filtered.reduce((s, r) => s + r.quantity, 0);

  const mid = Math.floor(filtered.length / 2);
  const firstHalf = filtered.slice(0, mid);
  const secondHalf = filtered.slice(mid);
  const prevRevenue = firstHalf.reduce((s, r) => s + r.revenue, 0);
  const currRevenue = secondHalf.reduce((s, r) => s + r.revenue, 0);
  const growth = prevRevenue > 0 ? (((currRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1) : 0;

  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  return { totalRevenue, totalOrders, growth, avgOrderValue };
}

function getRevenueOverTime(from, to) {
  const filtered = filterByRange(data, from, to);
  const grouped = {};
  for (const r of filtered) {
    const key = `${r.year}-${String(r.month).padStart(2, '0')}`;
    grouped[key] = (grouped[key] || 0) + r.revenue;
  }
  const labels = Object.keys(grouped).sort().map(k => {
    const [, m] = k.split('-');
    return MONTHS_SHORT[parseInt(m) - 1];
  });
  const values = Object.keys(grouped).sort().map(k => grouped[k]);
  return { labels, values };
}

function getSalesByCategory(from, to) {
  const filtered = filterByRange(data, from, to);
  const grouped = {};
  for (const r of filtered) {
    grouped[r.category] = (grouped[r.category] || 0) + r.revenue;
  }
  return {
    labels: CATEGORIES,
    values: CATEGORIES.map(c => grouped[c] || 0),
  };
}

function getSalesByRegion(from, to) {
  const filtered = filterByRange(data, from, to);
  const grouped = {};
  for (const r of filtered) {
    grouped[r.region] = (grouped[r.region] || 0) + r.revenue;
  }
  return {
    labels: REGIONS,
    values: REGIONS.map(c => grouped[c] || 0),
  };
}

function getMonthlyTrend(from, to) {
  const filtered = filterByRange(data, from, to);
  const grouped = {};
  for (const r of filtered) {
    const key = `${r.year}-${String(r.month).padStart(2, '0')}`;
    if (!grouped[key]) grouped[key] = {};
    grouped[key][r.category] = (grouped[key][r.category] || 0) + r.revenue;
  }
  const keys = Object.keys(grouped).sort();
  const labels = keys.map(k => {
    const [, m] = k.split('-');
    return MONTHS_SHORT[parseInt(m) - 1];
  });
  const datasets = CATEGORIES.map(category => ({
    label: category,
    data: keys.map(k => grouped[k][category] || 0),
  }));
  return { labels, datasets };
}

module.exports = { getSummary, getRevenueOverTime, getSalesByCategory, getSalesByRegion, getMonthlyTrend };
