# 週間日記通知機能

## 概要
- 毎週日曜日の 23:59 に、その週（月曜〜日曜）に書いた日記を振り返りとして LINE にプッシュ通知する。

## 仕様

### 機能要件
1. **実行タイミング**
   - 毎週日曜日 23:59 頃
   - GAS のトリガー機能（時間主導型）を利用

2. **対象データ**
   - 実行日（日曜日）を含む、直近1週間（月曜日〜日曜日）の日記データ全て。

3. **通知形式**
   - 日記1件につき1つの吹き出し（メッセージ）として送信する。
   - LINE Messaging API の `push` を使用。
   - 1回のリクエストで送信できるメッセージ数は最大5件であるため、データ数が5件を超える場合は複数回に分けてリクエストを送信する。

### トリガー設定
- `TriggerUtils` を拡張し、ユーザーが手動で毎週実行のトリガーを設定できるようにする。
- 既存の `src/operations/set_trigger_operation.js` を利用（または拡張）して設定可能にする。
- ただし、アーカイブ機能と同様に、初回のみ手動またはコマンドで設定する形でも可とするが、今回は `TriggerUtils` に機能を追加してコード管理する。

## 実装計画

### 1. `src/utils/trigger_utils.js` の改修
- 既存の `setTrigger(name)` を拡張し、日付 (`Date` オブジェクト) を引数に取れるようにする。
- 引数が省略された場合は、従来の挙動（本日23:58）を維持する。

```javascript
  /**
   * 指定した日時でトリガーを設定する
   * @param {string} name - 関数名
   * @param {Date} [date] - 指定日時（省略時は本日23:58）
   */
  static setTrigger(name, date) {
    if (!name) return;

    let triggerDate = date;
    if (!triggerDate) {
      triggerDate = new Date();
      triggerDate.setHours(23);
      triggerDate.setMinutes(58);
    }
    
    ScriptApp.newTrigger(name).timeBased().at(triggerDate).create();
  }
```

### 2. `src/operations/push_weekly_operation.js` の実装

以下の処理を行う:
1. **既存トリガー削除**: `TriggerUtils.deleteTrigger('pushWeekly')`
2. **次回のトリガー設定**: 
   - 現在日時から7日後の 23:58 の `Date` オブジェクトを作成。
   - `TriggerUtils.setTrigger('pushWeekly', nextSunday)` を呼び出す（チェーン実行）。

3. **対象期間の算出**:
   - 実行日（今日）を終了日とする。
   - 実行日の6日前を開始日とする。

4. **データ取得**:
   - `Diary.getBetween(since, until)` を利用。

5. **メッセージ生成**:
   - 取得した日記データからテキストメッセージの配列を作成。
   - 日付情報も含める（例: `[2023/10/01]\n日記本文...`）。

6. **送信処理**:
   - メッセージ配列を5件ずつのチャンクに分割。
   - `LineApiClient.push` をチャンクごとに呼び出す。

### 3. `src/operations/set_trigger_operation.js` の修正
- `pushWeekly` の場合、**直近の日曜日の 23:58** を計算してトリガーを設定する。
- それ以外（`pushDaily`など）の場合は、従来の `TriggerUtils.setTrigger(name)`（引数なし＝本日23:58）を呼ぶ。

#### 日付計算ロジック（`pushWeekly`用）
1. 現在日時を取得。
2. 曜日を確認し、次の日曜日までの日数を計算。
   - 日曜日(0)なら: 0日後（今日）または7日後（次回）※初回設定としては「今日」で良いが、時間が過ぎていたら7日後？ここではシンプルに「次の日曜日（今日が日曜なら今日）」とする。
   - 月〜土なら: `7 - dayOfWeek` 日後？
   - **ロジック例**:
     ```javascript
     const now = new Date();
     const dayOfWeek = now.getDay(); // 0: 日曜
     const daysUntilSunday = (7 - dayOfWeek) % 7;
     const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSunday);
     targetDate.setHours(23);
     targetDate.setMinutes(58);
     ```

### 4. エントリーポイントの確認
- `src/index.js` の変更は不要。`setTriggerWeekly` は `SetTriggerOperation('pushWeekly')` を呼ぶだけなので、`SetTriggerOperation` 側の分岐で吸収可能。

## 検証計画
- `TriggerUtils` でトリガーが正しく登録されるか確認。
- `PushWeeklyOperation` を手動実行し、過去1週間分の日記が送られてくるか確認。
- 7件以上日記があるパターンで、分割送信されるか確認。
