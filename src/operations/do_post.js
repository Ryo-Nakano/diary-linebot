import Diary from 'diary';
import { reply, replyWithQuickReply, replyDiaries } from '../reply';

/**
 * doPost: ユーザーからのメッセージ受信時に呼び出されるエントリーポイント
 * @param {Object} e - イベントオブジェクト
 */
const doPost = (e) => {
  const { replyToken, userMessage } = _parseEvent(e);

  try {
    const pattern = _classifyUserMessage(userMessage);
    const diary = new Diary();

    switch (pattern) {
      case 0: // 普通に日記をつける
        diary.save(userMessage);
        replyWithQuickReply(replyToken, ['日記をつけました！✏️']);
        break;
      case 1: // 今日の日記を返信する
        const today = Utilities.formatDate(new Date(), 'JST', 'yyyy/MM/dd');
        const diaries = diary.getDiariesBetween(today, today);
        replyDiaries(replyToken, diaries);
        break;
      case 9: // メンテナンスモード
        const msg = [
          'DB :',
          'https://bit.ly/3j9jp4h',
          '',
          'Script :',
          'https://bit.ly/3JlGAms',
        ].join('\n');
        replyWithQuickReply(replyToken, [msg]);
        break;
    }
  } catch (err) {
    console.error(err);
    const msg = [`⚠️ ${err.name}`, '', err.message].join('\n');
    reply(replyToken, [msg]);
    throw err;
  }
};

/**
 * イベントオブジェクトから必要な情報をパースする
 * @param {Object} e - イベントオブジェクト
 * @returns {Object} replyToken と userMessage を含むオブジェクト
 */
const _parseEvent = (e) => {
  const event = JSON.parse(e.postData.contents).events[0];
  return {
    replyToken: event.replyToken,
    userMessage: event.message.text.trim(),
  };
};

/**
 * ユーザーのメッセージをパターンに分類する
 * @param {string} msg - ユーザーからのメッセージ
 * @returns {number} 分類結果のパターン番号
 */
const _classifyUserMessage = (msg) => {
  try {
    let pattern = null;
    switch (msg) {
      case '今日書いたこと':
        pattern = 1;
        break;
      case 'めんて':
      case 'メンテ':
        pattern = 9;
        break;
      default:
        pattern = 0;
    }
    return pattern;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default doPost;
