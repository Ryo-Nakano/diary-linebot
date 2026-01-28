import { DoPostOperation } from 'operations/do_post_operation';
import { PushDailyOperation } from 'operations/push_daily_operation';
import { PushWeeklyOperation } from 'operations/push_weekly_operation';
import { SetTriggerOperation } from 'operations/set_trigger_operation';

/**
 * ユーザーからのメッセージ受信時に発火
 * @param {Object} e - イベントオブジェクト
 */
global.doPost = (e) => {
  new DoPostOperation(e).run();
};

/**
 * 毎日のプッシュ通知を実行
 */
global.pushDaily = () => {
  new PushDailyOperation().run();
};

/**
 * 週間のプッシュ通知を実行
 */
global.pushWeekly = () => {
  new PushWeeklyOperation().run();
};

/**
 * 毎日のプッシュ通知用トリガーを設定
 */
global.setTriggerDaily = () => {
  new SetTriggerOperation('pushDaily').run();
};

/**
 * 週間のプッシュ通知用トリガーを設定
 */
global.setTriggerWeekly = () => {
  new SetTriggerOperation('pushWeekly').run();
};
