import { LINE_USER_ID } from 'constants';
import Diary from 'diary';
import { getRandomIcon } from 'icon';
import { pushWithQuickReply } from 'push';
import { deleteTrigger } from 'trigger';

/**
 * 毎日のプッシュ通知処理
 * ・既存の pushDaily トリガーを削除し
 * ・今日の日記の内容を取得して、LINE で通知する
 */
const pushDaily = () => {
  deleteTrigger('pushDaily');
  const today = Utilities.formatDate(new Date(), 'JST', 'yyyy/MM/dd');
  const diary = new Diary();
  const diaries = diary.getDiariesBetween(today, today);

  let messages = null;
  if (Object.keys(diaries).length) {
    const serializedDiaries = Object.keys(diaries).map(date => {
      const icon = getRandomIcon();
      const heading = `${icon} ${date} の日記 ${icon}`;
      const text = diaries[date].join('\n\n --- \n\n');
      return [heading, text];
    }).flat();
    messages = ['今日書いた日記を振り返りましょう！👏', ...serializedDiaries];
  } else {
    const msg = [
      '今日はゆっくり休んだ！',
      'また明日書くことにしよう 🌞',
    ].join('\n');
    messages = [msg];
  }

  return pushWithQuickReply(LINE_USER_ID, messages);
};

export default pushDaily;
