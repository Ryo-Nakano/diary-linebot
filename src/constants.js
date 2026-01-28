// スクリプトプロパティからの値取得
const scriptProperties = PropertiesService.getScriptProperties();

/**
 * スプレッドシートID
 */
export const SSID = scriptProperties.getProperty('SSID');

/**
 * LINE ユーザーID
 */
export const LINE_USER_ID = scriptProperties.getProperty('LINE_USER_ID');

/**
 * LINE アクセストークン
 */
export const ACCESS_TOKEN = scriptProperties.getProperty('ACCESS_TOKEN');

/**
 * シート名定数
 */
export const BOUND_SHEETS = {
  DB: 'DB',
};

/**
 * メッセージパターン定数
 */
export const MESSAGE_PATTERNS = {
  TODAY_DIARY: '今日書いたこと',
  MAINTENANCE: ['めんて', 'メンテ'],
};
