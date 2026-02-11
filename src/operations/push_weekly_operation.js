import { BaseOperation } from 'base_classes/base_operation';
import { Diary } from 'sheet_data/bound_sheet/diary';
import { LineApiClient, LINE_API } from 'apis/line_api_client';
import { MessageUtils } from 'utils/message_utils';
import { TriggerUtils } from 'utils/trigger_utils';
import { LINE_USER_ID } from 'constants';

/**
 * 週間プッシュ通知処理を実行するクラス
 */
export class PushWeeklyOperation extends BaseOperation {
  /**
   * メイン処理
   */
  _operation() {
    // 1. 既存トリガー削除 & 次回のトリガー設定
    TriggerUtils.deleteTrigger('pushWeekly');

    const now = new Date();
    const nextSunday = new Date(now);
    const daysUntilNextSunday = (7 - now.getDay()) % 7 || 7;
    nextSunday.setDate(now.getDate() + daysUntilNextSunday);
    nextSunday.setHours(23);
    nextSunday.setMinutes(58);

    TriggerUtils.setTrigger('pushWeekly', nextSunday);

    // 2. 対象期間の算出 (今日を含む過去7日間)
    const todayStr = Utilities.formatDate(now, 'JST', 'yyyy/MM/dd');
    const pastDate = new Date(now);
    pastDate.setDate(now.getDate() - 6);
    const sinceStr = Utilities.formatDate(pastDate, 'JST', 'yyyy/MM/dd');

    // 3. データ取得
    const diaries = Diary.getBetween(sinceStr, todayStr);

    // 4. メッセージ生成
    const texts = MessageUtils.serializeWeeklyReview(diaries);

    // 5. 送信処理 (5件ずつ分割)
    const client = new LineApiClient();
    const CHUNK_SIZE = 5;

    for (let i = 0; i < texts.length; i += CHUNK_SIZE) {
      const chunk = texts.slice(i, i + CHUNK_SIZE);
      const messages = chunk.map(text => ({ type: 'text', text }));
      client.request(LINE_API.message.push({ to: LINE_USER_ID, messages }));
    }
  }
}
