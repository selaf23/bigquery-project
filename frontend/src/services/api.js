import axios from 'axios';

const client = axios.create({ baseURL: '/api' });

export async function fetchSummary(from, to) {
  const { data } = await client.get('/dashboard/summary', { params: { from, to } });
  return data;
}

export async function fetchRevenue(from, to) {
  const { data } = await client.get('/dashboard/revenue', { params: { from, to } });
  return data;
}

export async function fetchCategories(from, to) {
  const { data } = await client.get('/dashboard/categories', { params: { from, to } });
  return data;
}

export async function fetchRegions(from, to) {
  const { data } = await client.get('/dashboard/regions', { params: { from, to } });
  return data;
}

export async function fetchMonthlyTrend(from, to) {
  const { data } = await client.get('/dashboard/monthly-trend', { params: { from, to } });
  return data;
}
