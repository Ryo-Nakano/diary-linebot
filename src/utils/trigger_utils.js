/**
 * トリガー関連のユーティリティクラス
 */
export class TriggerUtils {
  /**
   * 指定した関数名で本日23:58に実行されるトリガーを設定する
   * @param {string} name - トリガーに設定する関数名
   */
  static setTrigger(name) {
    if (!name) return;

    const triggerDay = new Date();
    triggerDay.setHours(23);
    triggerDay.setMinutes(58);
    ScriptApp.newTrigger(name).timeBased().at(triggerDay).create();
  }

  /**
   * 指定した関数名のトリガーを全て削除する
   * @param {string} name - 削除対象のトリガーの関数名
   */
  static deleteTrigger(name) {
    if (!name) return;

    const triggers = ScriptApp.getProjectTriggers();
    for (let i = 0; i < triggers.length; i++) {
      if (triggers[i].getHandlerFunction() === name) {
        ScriptApp.deleteTrigger(triggers[i]);
      }
    }
  }
}
