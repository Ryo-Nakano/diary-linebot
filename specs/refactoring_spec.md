# アーキテクチャ準拠リファクタリング

## 概要
- ARCHITECTURE.md で定義されたアーキテクチャとコーディングスタイルに沿うよう、既存コードをリファクタリングする
- 現状はファイル配置が乱雑で、Operationパターン・DAOパターンが適用されていない
- リファクタリングにより、コードの一貫性と保守性を向上させる

## 現状分析

### 問題点一覧

| カテゴリ | 問題 | 対応方針 |
|----------|------|----------|
| ファイル配置 | `src/`直下に機能別ファイルが散らばっている | 適切なディレクトリに移動 |
| Operationパターン | `operations/`内が関数ベースで`BaseOperation`未継承 | クラスベースに書き換え |
| DAOパターン | `Diary`クラスが直接SpreadsheetAppを呼び出し | `sheet_data/`にDAO作成 |
| APIクライアント | `Line`クラスが汎用的な基底クラスを持たない | `BaseApiClient`を導入 |
| 定数管理 | `constants.js`が最小限のみ | 拡張 |

### 目標のファイル構成

```
src/
├── index.js              # グローバル関数のみ
├── constants.js          # 定数定義（拡張）
├── base_classes/
│   ├── base_operation.js
│   ├── base_sheet_data.js
│   └── base_api_client.js    # 新規
├── apis/                      # 新規
│   └── line_api_client.js
├── operations/
│   ├── do_post_operation.js
│   ├── push_daily_operation.js
│   ├── push_weekly_operation.js
│   └── set_trigger_operation.js
├── sheet_data/
│   └── bound_sheet/
│       └── diary_data.js      # 新規
└── utils/
    ├── common_utils.js
    ├── sheet_utils.js
    ├── message_utils.js       # 新規
    ├── icon_utils.js          # 新規
    └── trigger_utils.js       # 新規
```

## 仕様

### 機能要件
- 既存の機能は変更しない（純粋なリファクタリング）
- ARCHITECTURE.md に準拠した構造に再編成する

### 制約・前提
- 既存の`BaseOperation`と`BoundSheetData`をそのまま活用
- Google Apps Scriptとしての動作を維持

## 実装計画

### Phase 1: 基底クラスの追加

#### `base_classes/base_api_client.js` (新規)
- `sample_api.js` の `BaseApiClient` パターンを採用
- `_BASE_URL`, `_BASE_HEADERS` をオーバーライド必須に
- `_post()`, `_get()` 等のHTTPメソッドを提供
- `request(endpoint)` でエンドポイント定義を受け取り実行

### Phase 2: APIクライアントの作成

#### `api/line_api_client.js` (新規)
- `LineApiClient` クラス（`BaseApiClient`継承）
- `LINE_API` エンドポイント定義オブジェクト

```javascript
export const LINE_API = {
  message: {
    reply: ({ replyToken, messages }) => ({
      method: 'POST',
      path: '/message/reply',
      payload: { replyToken, messages },
    }),
    push: ({ to, messages }) => ({
      method: 'POST',
      path: '/message/push',
      payload: { to, messages },
    }),
  },
};
```

### Phase 3: ユーティリティの作成

| ファイル | 内容 |
|----------|------|
| `utils/message_utils.js` | メッセージ構造の組み立て（QuickReply付き等） |
| `utils/icon_utils.js` | ランダムアイコン取得 |
| `utils/trigger_utils.js` | トリガー設定・削除 |

**使用パターン:**
```javascript
// Operation内
const messages = MessageUtils.serializeWithQuickReply(texts);
const client = new LineApiClient();
client.request(LINE_API.message.reply({ replyToken, messages }));
```

### Phase 4: DAOの作成

#### `sheet_data/bound_sheet/diary_data.js` (新規)
- `DiaryData` クラス（`BoundSheetData`継承）
- 静的メソッド: `all`, `save()`, `getBetween()`

### Phase 5: Operationクラスの変換

| 現在 | 新規 |
|------|------|
| `do_post.js` | `do_post_operation.js` (BaseOperation継承) |
| `push_daily.js` | `push_daily_operation.js` (BaseOperation継承) |
| `push_weekly.js` | `push_weekly_operation.js` (BaseOperation継承) |
| `set_daily_trigger.js` | `set_trigger_operation.js` (BaseOperation継承) |

### Phase 6: エントリーポイント・定数の整理

- `index.js` を `new XxxOperation().run()` 形式に
- `constants.js` に `BOUND_SHEETS`, `MESSAGE_PATTERNS` 等を追加

### Phase 7: 旧ファイルの削除

削除対象:
- `src/diary.js`, `src/line.js`, `src/reply.js`, `src/push.js`
- `src/message.js`, `src/trigger.js`, `src/icon.js`
- `src/operations/` 内の旧ファイル

## 検証計画

### ビルド確認
```bash
npm run build
```

### 手動動作確認
1. LINE Botに任意のメッセージ送信 → 日記保存＆応答確認
2. 「今日書いたこと」送信 → 日記返信確認
3. トリガー設定確認
