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
      time: {
        type: 'string',
        description: '購入時刻。HH:MM形式(24時間表記)。レシートに記載がない場合は空文字。',
      },
      total: {
        type: 'number',
        description:
          'レシートに記載されている合計金額(税込)。記載がない場合は商品金額の合計を計算する。',
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
    required: ['date', 'total', 'items'],
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
    max_tokens: 2048,
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
            text: [
              'このレシート画像を一字一句正確に読み取り、extract_receiptツールで返してください。',
              '特に次の点に注意してください。',
              '- 商品名はレシートに印字されている通りに記載し、省略や意訳をしない(読み取れない場合のみ推測であることが分かるようにする)',
              '- 金額の桁を読み間違えないこと(0とO、1とl、桁区切りのカンマなどに注意し、1文字ずつ確認する)',
              '- レシートに小計・合計金額が印字されている場合は、商品ごとの金額の合計と一致するか確認し、不一致があれば読み取りを見直してから回答する',
              '- 割引・値引きの表記がある場合は、対象商品の金額に反映させる',
              '- 購入時刻と合計金額(税込)も、レシートに印字されている通り正確に読み取る',
            ].join('\n'),
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
