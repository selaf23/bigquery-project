import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const COLORS = ['#2dd4bf', '#fb7185', '#fbbf24', '#a78bfa', '#34d399'];

export default function MonthlyTrend({ data }) {
  if (!data) return null;

  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((ds, i) => ({
      ...ds,
      backgroundColor: COLORS[i % COLORS.length],
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, padding: 12 },
      },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        ticks: {
          callback: v => '$' + v.toLocaleString(),
        },
      },
    },
  };

  return (
    <div className="chart-card full-width">
      <h3>Tendencia mensual por categoría</h3>
      <div className="chart-wrapper">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
