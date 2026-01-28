import { BaseOperation } from 'base_classes/base_operation';
import { Diary } from 'sheet_data/bound_sheet/diary_data';
import { LineApiClient, LINE_API } from 'apis/line_api_client';
import { MessageUtils } from 'utils/message_utils';
import { MESSAGE_PATTERNS } from 'constants';

/**
 * ユーザーからのメッセージ受信時の処理を実行するクラス
 */
export class DoPostOperation extends BaseOperation {
  /**
   * @param {Object} e - イベントオブジェクト
   */
  constructor(e) {
    super();
    this._event = e;
  }

  /**
   * メイン処理
   */
  _operation() {
    const { replyToken, userMessage } = this._parseEvent();
    const pattern = this._classifyUserMessage(userMessage);
    const client = new LineApiClient();

    switch (pattern) {
      case 0: // 日記をつける
        Diary.save(userMessage);
        this._replyWithQuickReply(client, replyToken, ['日記をつけました！✏️']);
        break;

      case 1: // 今日の日記を返信
        const today = Utilities.formatDate(new Date(), 'JST', 'yyyy/MM/dd');
        const diaries = Diary.getBetween(today, today);
        const texts = MessageUtils.serializeDiaries(diaries);
        this._replyWithQuickReply(client, replyToken, texts);
        break;

      case 9: // メンテナンスモード
        const msg = [
          'DB :',
          'https://bit.ly/3j9jp4h',
          '',
          'Script :',
          'https://bit.ly/3JlGAms',
        ].join('\n');
        this._replyWithQuickReply(client, replyToken, [msg]);
        break;
    }
  }

  /**
   * QuickReply付きで返信する
   * @param {LineApiClient} client - LINE APIクライアント
   * @param {string} replyToken - 返信トークン
   * @param {string[]} texts - テキスト配列
   * @private
   */
  _replyWithQuickReply(client, replyToken, texts) {
    const messages = MessageUtils.serializeWithQuickReply(texts);
    client.request(LINE_API.message.reply({ replyToken, messages }));
  }

  /**
   * イベントオブジェクトをパースする
   * @returns {Object} { replyToken, userMessage }
   * @private
   */
  _parseEvent() {
    const event = JSON.parse(this._event.postData.contents).events[0];
    return {
      replyToken: event.replyToken,
      userMessage: event.message.text.trim(),
    };
  }

  /**
   * ユーザーメッセージをパターンに分類する
   * @param {string} msg - ユーザーメッセージ
   * @returns {number} パターン番号
   * @private
   */
  _classifyUserMessage(msg) {
    if (msg === MESSAGE_PATTERNS.TODAY_DIARY) {
      return 1;
    }
    if (MESSAGE_PATTERNS.MAINTENANCE.includes(msg)) {
      return 9;
    }
    return 0;
  }
}
