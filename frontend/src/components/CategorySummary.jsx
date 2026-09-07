import { CATEGORIES } from '../constants/categories';

// カテゴリ別の支出集計(金額・割合)を表形式で表示する
export function CategorySummary({ items }) {
  const totalsByCategory = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  const grandTotal = items.reduce((sum, item) => sum + item.amount, 0);

  const categoriesWithData = CATEGORIES.filter((category) => totalsByCategory[category]).sort(
    (a, b) => totalsByCategory[b] - totalsByCategory[a]
  );

  if (categoriesWithData.length === 0) {
    return <p className="empty-message">データがありません</p>;
  }

  return (
    <table className="receipt-table">
      <thead>
        <tr>
          <th>カテゴリ</th>
          <th>金額</th>
          <th>割合</th>
        </tr>
      </thead>
      <tbody>
        {categoriesWithData.map((category) => (
          <tr key={category}>
            <td>{category}</td>
            <td className="amount-cell">{totalsByCategory[category].toLocaleString()}円</td>
            <td className="amount-cell">
              {grandTotal > 0 ? ((totalsByCategory[category] / grandTotal) * 100).toFixed(1) : 0}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
