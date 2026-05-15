import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

export default function RevenueChart({ data }) {
  if (!data) return null;

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Ingresos',
        data: data.values,
        borderColor: '#2dd4bf',
        backgroundColor: 'rgba(45, 212, 191, 0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#2dd4bf',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => `$${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: v => '$' + v.toLocaleString(),
        },
      },
    },
  };

  return (
    <div className="chart-card">
      <h3>Ingresos en el tiempo</h3>
      <div className="chart-wrapper">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
