import { useState, useEffect, useCallback } from 'react';
import { fetchSummary, fetchRevenue, fetchCategories, fetchRegions, fetchMonthlyTrend } from '../services/api';

export function useDashboardData() {
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [categories, setCategories] = useState(null);
  const [regions, setRegions] = useState(null);
  const [monthlyTrend, setMonthlyTrend] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { from, to } = dateRange;
      const [s, r, c, reg, mt] = await Promise.all([
        fetchSummary(from, to),
        fetchRevenue(from, to),
        fetchCategories(from, to),
        fetchRegions(from, to),
        fetchMonthlyTrend(from, to),
      ]);
      setSummary(s);
      setRevenue(r);
      setCategories(c);
      setRegions(reg);
      setMonthlyTrend(mt);
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    load();
  }, [load]);

  return { summary, revenue, categories, regions, monthlyTrend, loading, error, dateRange, setDateRange };
}
