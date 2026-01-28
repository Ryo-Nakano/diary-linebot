import { BaseOperation } from 'base_classes/base_operation';
import { TriggerUtils } from 'utils/trigger_utils';

/**
 * 週間プッシュ通知処理を実行するクラス（未実装）
 */
export class PushWeeklyOperation extends BaseOperation {
  /**
   * メイン処理
   * TODO: 週間プッシュ通知の処理を実装する
   */
  _operation() {
    TriggerUtils.deleteTrigger('pushWeekly');
    // TODO: 週間プッシュ通知の処理を実装する
  }
}
