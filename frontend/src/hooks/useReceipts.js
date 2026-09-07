import { useEffect, useState } from 'react';

const STORAGE_KEY = 'kakeibo-receipts';

// ローカルストレージに永続化されたレシート明細を管理するフック
export function useReceipts() {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      // 破損データが入っていた場合は空で復旧する
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Claude APIの解析結果(店舗名・日付・商品リスト)を明細行に変換して追加する
  const addReceipt = (receipt) => {
    const newItems = receipt.items.map((item, index) => ({
      id: `${Date.now()}-${index}`,
      date: receipt.date,
      storeName: receipt.storeName || '',
      name: item.name,
      amount: Number(item.amount) || 0,
      category: item.category || 'その他',
    }));
    setItems((prev) => [...newItems, ...prev]);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return { items, addReceipt, removeItem };
}
