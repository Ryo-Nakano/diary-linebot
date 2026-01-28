import { BaseApiClient, METHODS } from 'base_classes/base_api_client';
import { ACCESS_TOKEN } from 'constants';

/**
 * LINE Messaging API クライアント
 */
export class LineApiClient extends BaseApiClient {
  /**
   * LINE Messaging API のベースURL
   * @returns {string}
   */
  get _BASE_URL() {
    return 'https://api.line.me/v2/bot';
  }

  /**
   * LINE Messaging API のベースヘッダー
   * @returns {Object}
   */
  get _BASE_HEADERS() {
    return {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
    };
  }
}

/**
 * LINE Messaging API エンドポイント定義
 */
export const LINE_API = {
  message: {
    /**
     * 返信メッセージを送信する
     * @param {Object} params
     * @param {string} params.replyToken - 返信用トークン
     * @param {Array<Object>} params.messages - メッセージ配列
     * @returns {Object} エンドポイント定義
     */
    reply: ({ replyToken, messages }) => ({
      method: METHODS.POST,
      path: '/message/reply',
      payload: { replyToken, messages },
    }),

    /**
     * プッシュメッセージを送信する
     * @param {Object} params
     * @param {string} params.to - 送信先ID
     * @param {Array<Object>} params.messages - メッセージ配列
     * @returns {Object} エンドポイント定義
     */
    push: ({ to, messages }) => ({
      method: METHODS.POST,
      path: '/message/push',
      payload: { to, messages },
    }),
  },
};
