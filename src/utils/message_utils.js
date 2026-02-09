import { IconUtils } from 'utils/icon_utils';

/**
 * メッセージ構造のユーティリティクラス
 */
export class MessageUtils {
  /**
   * テキスト配列をQuickReply付きメッセージ配列に変換する
   * @param {string[]} texts - テキスト配列
   * @returns {Array<Object>} メッセージ配列
   */
  static serializeWithQuickReply(texts) {
    return texts.map((text, index) => {
      const isLast = index === texts.length - 1;
      const message = { type: 'text', text };

      if (isLast) {
        return {
          ...message,
          quickReply: {
            items: this._getQuickReplyItems(),
          },
        };
      }
      return message;
    });
  }

  /**
   * テキスト配列をシンプルなメッセージ配列に変換する
   * @param {string[]} texts - テキスト配列
   * @returns {Array<Object>} メッセージ配列
   */
  static serialize(texts) {
    return texts.map(text => ({ type: 'text', text }));
  }

  /**
   * 日記オブジェクトをテキスト配列に変換する
   * @param {Object} diaries - 日記データ（日付をキーに、配列で日記が入っている）
   * @returns {string[]} テキスト配列
   */
  static serializeDiaries(diaries) {
    if (!Object.keys(diaries).length) {
      return [
        [
          '今日はまだ何も書いていません 🌞',
          '',
          '日常の何かちょっとしたこととか思ったこととか、',
          'なんでも書ければ最高！🚀',
        ].join('\n'),
      ];
    }

    const serializedDiaries = Object.keys(diaries).map(date => {
      const icon = IconUtils.getRandomIcon();
      const heading = `${icon} ${date} の日記 ${icon}`;
      const text = diaries[date].join('\n\n --- \n\n');
      return [heading, text];
    }).flat();

    return ['現時点で以下の内容を書いています！👏', ...serializedDiaries];
  }

  /**
   * 日記振り返り用のテキスト配列を生成する
   * @param {Object} diaries - 日記データ
   * @returns {string[]} テキスト配列
   */
  static serializeDailyReview(diaries) {
    if (!Object.keys(diaries).length) {
      return [
        [
          '今日はゆっくり休んだ！',
          'また明日書くことにしよう 🌞',
        ].join('\n'),
      ];
    }

    const serializedDiaries = Object.keys(diaries).map(date => {
      const icon = IconUtils.getRandomIcon();
      const heading = `${icon} ${date} の日記 ${icon}`;
      const text = diaries[date].join('\n\n --- \n\n');
      return [heading, text];
    }).flat();

    return ['今日書いた日記を振り返りましょう！👏', ...serializedDiaries];
  }

  /**
   * 週間日記振り返り用のテキスト配列を生成する
   * @param {Object} diaries - 日記データ
   * @returns {string[]} テキスト配列
   */
  static serializeWeeklyReview(diaries) {
    if (!Object.keys(diaries).length) {
      return [
        '今週は日記がありませんでした 🍃\n来週は書けるといいですね！',
      ];
    }

    const serializedDiaries = Object.keys(diaries).sort().map(date => {
      const icon = IconUtils.getRandomIcon();
      const heading = `${icon} ${date} の日記 ${icon}`;
      const text = diaries[date].join('\n\n --- \n\n');
      return [heading, text];
    }).flat();

    return ['今週の日記を振り返りましょう！週報です 📅', ...serializedDiaries];
  }

  /**
   * QuickReplyのアイテムを取得する
   * @returns {Array<Object>}
   * @private
   */
  static _getQuickReplyItems() {
    return [
      {
        type: 'action',
        action: {
          type: 'message',
          label: `${IconUtils.getRandomIcon()} 今日書いたこと`,
          text: '今日書いたこと',
        },
      },
    ];
  }
}
