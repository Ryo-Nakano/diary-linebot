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
    TriggerUtils.setTrigger(this._functionName);
  }
}
