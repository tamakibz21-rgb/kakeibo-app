import { useState } from 'react';
import './App.css';
import { CategoryPieChart } from './components/CategoryPieChart';
import { CategorySummary } from './components/CategorySummary';
import { MonthlyBarChart } from './components/MonthlyBarChart';
import { ReceiptTable } from './components/ReceiptTable';
import { ReceiptUpload } from './components/ReceiptUpload';
import { useReceipts } from './hooks/useReceipts';

function App() {
  const { items, addReceipt, removeItem, validateReceipt } = useReceipts();
  const [warnings, setWarnings] = useState([]);

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  // 読み取り結果を検証してから登録する(警告があっても登録自体は行い、内容を確認できるようにする)
  const handleExtracted = (receipt) => {
    setWarnings(validateReceipt(receipt));
    addReceipt(receipt);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>レシート読み込み家計簿</h1>
        <p className="total-display">合計支出: {total.toLocaleString()}円</p>
      </header>

      <ReceiptUpload onExtracted={handleExtracted} />

      {warnings.length > 0 && (
        <div className="warning-banner">
          {warnings.map((message) => (
            <p key={message}>⚠ {message}</p>
          ))}
          <button className="warning-dismiss" onClick={() => setWarnings([])}>
            閉じる
          </button>
        </div>
      )}

      <section className="charts">
        <div className="chart-card">
          <h2>カテゴリ別支出</h2>
          <CategoryPieChart items={items} />
          <CategorySummary items={items} />
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
