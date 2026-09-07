import { Router } from 'express';
import multer from 'multer';
import { extractReceipt } from '../services/claudeService.js';

const router = Router();

// 画像はメモリ上で一時保持するのみ(ディスクに保存しない)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MBまで
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('画像ファイルのみアップロードできます'));
      return;
    }
    cb(null, true);
  },
});

// POST /api/receipts/analyze : レシート画像を解析して構造化データを返す
router.post('/analyze', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '画像ファイルが送信されていません' });
  }

  try {
    const result = await extractReceipt(req.file.buffer, req.file.mimetype);
    res.json(result);
  } catch (error) {
    console.error('レシート解析エラー:', error);
    res.status(500).json({ error: 'レシートの解析に失敗しました。時間をおいて再度お試しください。' });
  }
});

export default router;
