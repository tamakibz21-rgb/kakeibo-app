import './App.css';
import { CategoryPieChart } from './components/CategoryPieChart';
import { MonthlyBarChart } from './components/MonthlyBarChart';
import { ReceiptTable } from './components/ReceiptTable';
import { ReceiptUpload } from './components/ReceiptUpload';
import { useReceipts } from './hooks/useReceipts';

function App() {
  const { items, addReceipt, removeItem } = useReceipts();

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="app">
      <header className="app-header">
        <h1>レシート読み込み家計簿</h1>
        <p className="total-display">合計支出: {total.toLocaleString()}円</p>
      </header>

      <ReceiptUpload onExtracted={addReceipt} />

      <section className="charts">
        <div className="chart-card">
          <h2>カテゴリ別支出</h2>
          <CategoryPieChart items={items} />
        </div>
        <div className="chart-card">
          <h2>月別支出</h2>
          <MonthlyBarChart items={items} />
        </div>
      </section>

      <section className="table-section">
        <h2>登録済みデータ</h2>
        <ReceiptTable items={items} onRemove={removeItem} />
      </section>
    </div>
  );
}

export default App;
