import { getRandomIcon } from 'icon';
import { serializeMessagesWithQuickReply } from 'message';
import Line from 'line';

/**
 * 日記の内容を返信するメッセージに変換し、QuickReply付きで返信する
 * @param {string} replyToken - 返信用トークン
 * @param {Object} diaries - 日記のデータ（日付をキーに、配列で日記の文が入っている）
 */
export const replyDiaries = (replyToken, diaries) => {
  try {
    let messages = null;
    if (Object.keys(diaries).length) {
      const serializedDiaries = Object.keys(diaries).map(date => {
        const icon = getRandomIcon();
        const heading = `${icon} ${date} の日記 ${icon}`;
        const text = diaries[date].join('\n\n --- \n\n');
        return [heading, text];
      }).flat();
      messages = ['現時点で以下の内容を書いています！👏', ...serializedDiaries];
    } else {
      const msg = [
        '今日はまだ何も書いていません 🌞',
        '',
        '日常の何かちょっとしたこととか思ったこととか、',
        'なんでも書ければ最高！🚀',
      ].join('\n');
      messages = [msg];
    }
    return replyWithQuickReply(replyToken, messages);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * QuickReply付きで返信する
 * @param {string} replyToken - 返信用トークン
 * @param {string[]} texts - 返信するテキストの配列
 */
export const replyWithQuickReply = (replyToken, texts) => {
  try {
    const messages = serializeMessagesWithQuickReply(texts);
    const line = new Line();
    return line.reply(replyToken, messages);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * テキストメッセージのみで返信する
 * @param {string} replyToken - 返信用トークン
 * @param {string[]} texts - 返信するテキストの配列
 */
export const reply = (replyToken, texts) => {
  try {
    if (!texts.length) return;
    const messages = texts.map(text => ({ type: 'text', text }));
    const line = new Line();
    return line.reply(replyToken, messages);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
