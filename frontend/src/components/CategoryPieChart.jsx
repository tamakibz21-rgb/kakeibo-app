import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { CATEGORY_COLORS } from '../constants/categories';

ChartJS.register(ArcElement, Tooltip, Legend);

// カテゴリ別の支出割合を円グラフで表示する
export function CategoryPieChart({ items }) {
  const totalsByCategory = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  const labels = Object.keys(totalsByCategory);

  if (labels.length === 0) {
    return <p className="empty-message">データがありません</p>;
  }

  const data = {
    labels,
    datasets: [
      {
        data: labels.map((label) => totalsByCategory[label]),
        backgroundColor: labels.map((label) => CATEGORY_COLORS[label] || '#94a3b8'),
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={data} options={{ plugins: { legend: { position: 'bottom' } } }} />;
}
