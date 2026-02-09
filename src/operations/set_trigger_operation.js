import { BaseOperation } from 'base_classes/base_operation';
import { TriggerUtils } from 'utils/trigger_utils';

/**
 * トリガーを設定するクラス
 */
export class SetTriggerOperation extends BaseOperation {
  /**
   * @param {string} functionName - トリガーを設定する関数名
   */
  constructor(functionName) {
    super();
    this._functionName = functionName;
  }

  /**
   * メイン処理
   */
  _operation() {
    if (this._functionName === 'pushWeekly') {
      const now = new Date();
      const nextSunday = new Date(now);
      const daysUntilNextSunday = (7 - now.getDay()) % 7 || 7; // Next Sunday (if today is Sunday, 7 days later)
      nextSunday.setDate(now.getDate() + daysUntilNextSunday);
      nextSunday.setHours(23);
      nextSunday.setMinutes(58);
      TriggerUtils.setTrigger(this._functionName, nextSunday);
    } else {
      TriggerUtils.setTrigger(this._functionName);
    }
  }
}
