/**
 * 指定した名前のトリガーを設定する
 * 毎日 23:58 に実行されるトリガーを作成する例
 * @param {string} name - トリガーに設定する関数名
 */
export const setTrigger = (name) => {
  try {
    if (!name) return;
    const triggerDay = new Date();
    triggerDay.setHours(23);
    triggerDay.setMinutes(58);
    ScriptApp.newTrigger(name).timeBased().at(triggerDay).create();
  } catch (err) {
    err.functionName = err.functionName || arguments.callee.name;
    console.error(err);
    throw err;
  }
};

/**
 * 指定した名前のトリガーを全て削除する
 * @param {string} name - 削除対象のトリガーの関数名
 */
export const deleteTrigger = (name) => {
  try {
    if (!name) return;
    const triggers = ScriptApp.getProjectTriggers();
    for (let i = 0; i < triggers.length; i++) {
      if (triggers[i].getHandlerFunction() === name) {
        ScriptApp.deleteTrigger(triggers[i]);
      }
    }
  } catch (err) {
    err.functionName = err.functionName || arguments.callee.name;
    console.error(err);
    throw err;
  }
};
