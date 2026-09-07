import { useState } from 'react';

// レシート画像を選択してバックエンド経由でClaude APIに解析させるコンポーネント
export function ReceiptUpload({ onExtracted }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/receipts/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'レシートの読み取りに失敗しました');
      }

      const result = await res.json();
      onExtracted(result);

      // 送信後は選択状態をリセット
      setFile(null);
      setPreviewUrl(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="upload-panel">
      <h2>レシートを読み込む</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={loading} />

      {previewUrl && (
        <div className="upload-preview">
          <img src={previewUrl} alt="レシートプレビュー" />
        </div>
      )}

      <button onClick={handleAnalyze} disabled={!file || loading}>
        {loading ? '読み取り中...' : 'レシートを読み取る'}
      </button>

      {error && <p className="upload-error">{error}</p>}
    </section>
  );
}
