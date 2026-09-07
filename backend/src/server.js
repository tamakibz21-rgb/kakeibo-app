import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import receiptsRouter from './routes/receipts.js';

const app = express();
const PORT = process.env.PORT || 3001;

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn('警告: ANTHROPIC_API_KEY が設定されていません。.env を確認してください。');
}

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/receipts', receiptsRouter);

// エラーハンドリングミドルウェア(multerのファイルサイズ超過等もここで捕捉)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ error: err.message || 'サーバーエラーが発生しました' });
});

app.listen(PORT, () => {
  console.log(`バックエンドサーバーが起動しました: http://localhost:${PORT}`);
});
