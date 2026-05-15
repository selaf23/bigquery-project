import { useDashboardData } from '../hooks/useDashboardData';
import KPICard from './KPICard';
import RevenueChart from './RevenueChart';
import SalesByCategory from './SalesByCategory';
import SalesByRegion from './SalesByRegion';
import MonthlyTrend from './MonthlyTrend';
import FilterBar from './FilterBar';

function formatCurrency(value) {
  return '$' + Number(value).toLocaleString('es-MX');
}

function formatNumber(value) {
  return Number(value).toLocaleString('es-MX');
}

export default function Dashboard() {
  const { summary, revenue, categories, regions, monthlyTrend, loading, error, dateRange, setDateRange } = useDashboardData();

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard de Ventas</h1>
        <FilterBar dateRange={dateRange} onDateChange={setDateRange} />
      </header>

      {loading ? (
        <div className="loading">Cargando datos...</div>
      ) : (
        <>
          <section className="kpi-grid">
            <KPICard
              title="Ingresos Totales"
              value={summary ? formatCurrency(summary.totalRevenue) : '-'}
              subtitle="Período seleccionado"
              color="#2dd4bf"
            />
            <KPICard
              title="Órdenes Totales"
              value={summary ? formatNumber(summary.totalOrders) : '-'}
              subtitle="Unidades vendidas"
              color="#a78bfa"
            />
              <KPICard
              title="Crecimiento"
              value={summary ? `${summary.growth}%` : '-'}
              subtitle="vs período anterior"
              color={summary && summary.growth >= 0 ? '#fbbf24' : '#fb7185'}
            />
            <KPICard
              title="Ticket Promedio"
              value={summary ? formatCurrency(summary.avgOrderValue) : '-'}
              subtitle="Por orden"
              color="#fb7185"
            />
          </section>

          <section className="charts-grid">
            <RevenueChart data={revenue} />
            <SalesByCategory data={categories} />
            <SalesByRegion data={regions} />
          </section>

          <section className="charts-grid">
            <MonthlyTrend data={monthlyTrend} />
          </section>
        </>
      )}
    </div>
  );
}
