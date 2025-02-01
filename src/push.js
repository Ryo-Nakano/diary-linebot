import Line from 'line';
import { serializeMessagesWithQuickReply } from 'message';

/**
 * QuickReply付きでプッシュ通知を送信する
 * @param {string} to - 送信先のID
 * @param {string[]} texts - 送信するテキストの配列
 */
export const pushWithQuickReply = (to, texts) => {
  try {
    const messages = serializeMessagesWithQuickReply(texts);
    const line = new Line();
    return line.push(to, messages);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * テキストメッセージのみでプッシュ通知を送信する
 * @param {string} to - 送信先のID
 * @param {string[]} texts - 送信するテキストの配列
 */
export const push = (to, texts) => {
  try {
    const messages = texts.map(text => ({ type: 'text', text }));
    const line = new Line();
    return line.push(to, messages);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
