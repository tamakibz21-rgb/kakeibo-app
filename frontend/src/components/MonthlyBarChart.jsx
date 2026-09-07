import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

// 月別の支出合計を棒グラフで表示する
export function MonthlyBarChart({ items }) {
  const totalsByMonth = items.reduce((acc, item) => {
    const month = item.date?.slice(0, 7) || '不明'; // YYYY-MM
    acc[month] = (acc[month] || 0) + item.amount;
    return acc;
  }, {});

  const labels = Object.keys(totalsByMonth).sort();

  if (labels.length === 0) {
    return <p className="empty-message">データがありません</p>;
  }

  const data = {
    labels,
    datasets: [
      {
        label: '月別支出',
        data: labels.map((label) => totalsByMonth[label]),
        backgroundColor: '#3b82f6',
      },
    ],
  };

  return <Bar data={data} options={{ plugins: { legend: { display: false } } }} />;
}
