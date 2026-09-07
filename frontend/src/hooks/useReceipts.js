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

  // レシートを追加する前のデータ検証。金額が負の値の商品、および
  // 同一日時・合計金額の重複レシートを検出し、警告メッセージの一覧を返す
  const validateReceipt = (receipt) => {
    const warnings = [];

    const negativeItems = (receipt.items || []).filter((item) => Number(item.amount) < 0);
    if (negativeItems.length > 0) {
      const list = negativeItems.map((item) => `${item.name}(${item.amount}円)`).join('、');
      warnings.push(`金額が負の値になっている商品があります: ${list}`);
    }

    const isDuplicate = items.some(
      (item) =>
        item.date === receipt.date &&
        item.time === (receipt.time || '') &&
        item.total === (Number(receipt.total) || 0)
    );
    if (isDuplicate) {
      warnings.push('同じ日時・合計金額のレシートが既に登録されています(重複登録の可能性があります)');
    }

    return warnings;
  };

  // Claude APIの解析結果(店舗名・日付・商品リスト)を明細行に変換して追加する
  const addReceipt = (receipt) => {
    const newItems = receipt.items.map((item, index) => ({
      id: `${Date.now()}-${index}`,
      date: receipt.date,
      time: receipt.time || '',
      total: Number(receipt.total) || 0,
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

  return { items, addReceipt, removeItem, validateReceipt };
}
