import { BaseOperation } from 'base_classes/base_operation';
import { Diary } from 'sheet_data/bound_sheet/diary_data';
import { LineApiClient, LINE_API } from 'apis/line_api_client';
import { MessageUtils } from 'utils/message_utils';
import { TriggerUtils } from 'utils/trigger_utils';
import { LINE_USER_ID } from 'constants';

/**
 * 毎日のプッシュ通知処理を実行するクラス
 */
export class PushDailyOperation extends BaseOperation {
  /**
   * メイン処理
   */
  _operation() {
    // 既存のトリガーを削除
    TriggerUtils.deleteTrigger('pushDaily');

    // 今日の日記を取得
    const today = Utilities.formatDate(new Date(), 'JST', 'yyyy/MM/dd');
    const diaries = Diary.getBetween(today, today);

    // メッセージを生成して送信
    const texts = MessageUtils.serializeDailyReview(diaries);
    const messages = MessageUtils.serializeWithQuickReply(texts);
    const client = new LineApiClient();
    client.request(LINE_API.message.push({ to: LINE_USER_ID, messages }));
  }
}
