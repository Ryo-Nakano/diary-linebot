# SetTriggerOperation のバグ修正

## 概要
- `SetTriggerOperation` は GAS トリガーの実行時刻を 23:58 にピン留めするための Operation。
- GAS のトリガー設定画面では 23:00〜24:00 のような1時間幅の指定しかできないため、この Operation で正確な実行時刻を制御している。
- 現状、`pushWeekly` のケースで「次の日曜日」を計算するロジックにバグがあり、日曜日に実行されると1週間後にトリガーが設定されてしまう。

## 仕様

### 現状の動作（バグ）
- GAS Web設定画面のトリガー:
  - `setTriggerDaily`: 毎日 23:00〜24:00 に発火
  - `setTriggerWeekly`: 毎週日曜 23:00〜24:00 に発火
- `SetTriggerOperation` は受け取った関数名（`pushDaily` / `pushWeekly`）に対して、指定時刻にトリガーを作成する。
- **問題**: `pushWeekly` の場合、`(7 - now.getDay()) % 7 || 7` の計算により、日曜日（`getDay() === 0`）に実行すると `7` が返り、7日後の日曜日にトリガーが設定される。
- 結果、`pushWeekly` が1週間遅れで実行される。

### 修正後の動作
- `SetTriggerOperation` は関数名によらず、常に「本日 23:58」のトリガーを設定する。
- 実行タイミング（毎日/毎週）の制御は GAS 側の定期トリガーが担うため、`SetTriggerOperation` は曜日計算を行う必要がない。

### 制約・前提
- 既存の関連ファイル:
  - `src/operations/set_trigger_operation.js`
  - `src/utils/trigger_utils.js`（変更なし）
  - `src/index.js`（変更なし）

## 実装計画

### 使用するクラス・ファイル
- Operation: `src/operations/set_trigger_operation.js`

### 処理フロー
1. `_operation()` メソッドから `pushWeekly` 固有の分岐を削除する。
2. 全ケースで `TriggerUtils.setTrigger(this._functionName)` を呼ぶ（引数なし = 本日 23:58）。

### 技術的な判断・注意点
- `SetTriggerOperation` の責務は「実行時刻を 23:58 に固定する」ことのみ。曜日のスケジューリングは GAS 側のトリガー設定が担当する。
- この修正により `SetTriggerOperation` は関数名に依存しない汎用的な構造になる。
- `diary_weekly_spec.md` のセクション3（`set_trigger_operation.js` の修正）に記載されていた日付計算ロジックは、今回の修正で不要になる。

## 検証計画
- `npm run lint` および `npm run build` でエラーがないことを確認。
