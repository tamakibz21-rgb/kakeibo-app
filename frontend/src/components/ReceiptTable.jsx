// 登録済みのレシート明細を一覧表示するテーブル
export function ReceiptTable({ items, onRemove }) {
  if (items.length === 0) {
    return <p className="empty-message">まだ登録されたデータがありません。レシートを読み込んでください。</p>;
  }

  const sorted = [...items].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <table className="receipt-table">
      <thead>
        <tr>
          <th>日付</th>
          <th>店舗</th>
          <th>商品名</th>
          <th>カテゴリ</th>
          <th>金額</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((item) => (
          <tr key={item.id}>
            <td>{item.date}</td>
            <td>{item.storeName}</td>
            <td>{item.name}</td>
            <td>{item.category}</td>
            <td className="amount-cell">{item.amount.toLocaleString()}円</td>
            <td>
              <button className="remove-button" onClick={() => onRemove(item.id)}>
                削除
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
