import Anthropic from '@anthropic-ai/sdk';

// Claude APIクライアント(APIキーは環境変数から読み込む。ブラウザには渡さない)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 使用するモデル(claude-haikuの最新バージョン)
const MODEL = 'claude-haiku-4-5-20251001';

// 家計簿で使う分類カテゴリ
export const CATEGORIES = ['食費', '外食', '日用品', '交通費', '娯楽', '医療', 'その他'];

// レシート解析結果を受け取るためのツール定義(構造化出力を安定させるためtool useを利用)
const EXTRACT_RECEIPT_TOOL = {
  name: 'extract_receipt',
  description:
    'レシート画像から店舗名・購入日・商品ごとの明細(商品名/金額/カテゴリ)を抽出する',
  input_schema: {
    type: 'object',
    properties: {
      storeName: {
        type: 'string',
        description: '店舗名。読み取れない場合は空文字。',
      },
      date: {
        type: 'string',
        description: '購入日。YYYY-MM-DD形式。年が読み取れない場合は現在の年を使う。',
      },
      items: {
        type: 'array',
        description: 'レシートに記載された購入商品の一覧',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', description: '商品名' },
            amount: { type: 'number', description: '金額(円、税込の支払金額)' },
            category: {
              type: 'string',
              enum: CATEGORIES,
              description: '商品の分類カテゴリ',
            },
          },
          required: ['name', 'amount', 'category'],
        },
      },
    },
    required: ['date', 'items'],
  },
};

/**
 * レシート画像をClaude APIに送信し、構造化された購入データを取得する
 * @param {Buffer} imageBuffer - アップロードされた画像データ
 * @param {string} mimeType - 画像のMIMEタイプ(image/jpeg等)
 * @returns {Promise<{storeName: string, date: string, items: Array}>}
 */
export async function extractReceipt(imageBuffer, mimeType) {
  const base64Image = imageBuffer.toString('base64');

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    tools: [EXTRACT_RECEIPT_TOOL],
    tool_choice: { type: 'tool', name: 'extract_receipt' },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mimeType,
              data: base64Image,
            },
          },
          {
            type: 'text',
            text: 'このレシート画像を読み取り、店舗名・購入日・商品ごとの名称/金額/カテゴリをextract_receiptツールで返してください。',
          },
        ],
      },
    ],
  });

  const toolUse = response.content.find((block) => block.type === 'tool_use');
  if (!toolUse) {
    throw new Error('レシートの読み取りに失敗しました(Claudeから構造化データが返されませんでした)');
  }

  return toolUse.input;
}
