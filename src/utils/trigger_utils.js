/**
 * トリガー関連のユーティリティクラス
 */
export class TriggerUtils {
  /**
   * 指定した関数名でトリガーを設定する
   * @param {string} name - トリガーに設定する関数名
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
