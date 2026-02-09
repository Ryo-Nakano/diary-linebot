import { BoundSheetData } from 'base_classes/base_sheet_data';
import { SSID, BOUND_SHEETS } from 'constants';

/**
 * 日記シートへのデータアクセスを提供するクラス
 */
export class Diary extends BoundSheetData {
  /**
   * スプレッドシートIDを返す
   * @returns {string}
   */
  static get SSID() {
    return SSID;
  }

  /**
   * 日記を保存する
   * @param {string} text - 日記の内容
   */
  static save(text) {
    const date = Utilities.formatDate(new Date(), 'JST', 'yyyy/MM/dd');
    const time = Utilities.formatDate(new Date(), 'JST', 'HH:mm');
    const row = [[date, time, text]];
    this._addRow(row);
  }

  /**
   * 全日記データを取得する
   * @returns {Array<{date: string, time: string, diary: string}>}
   */
  static get all() {
    const sheet = this._getSheet(BOUND_SHEETS.DB);
    if (!sheet) return [];

    // ヘッダー行(2行)を除いた全データを取得
    const data = sheet.getDataRange().getValues().slice(2);

    return data.map(row => ({
      date: Utilities.formatDate(row[0], 'JST', 'yyyy/MM/dd'),
      time: row[1] instanceof Date
        ? Utilities.formatDate(row[1], 'JST', 'HH:mm')
        : String(row[1]),
      diary: row[2],
    }));
  }

  /**
   * 指定期間の日記を取得する
   * @param {string} since - 開始日 (yyyy/MM/dd形式)
   * @param {string} until - 終了日 (yyyy/MM/dd形式)
   * @returns {Object} 日付をキーに、日記の配列を値とするオブジェクト
   */
  static getBetween(since, until) {
    const allData = this.all;

    const filtered = allData.filter(item => item.date >= since && item.date <= until);

    return filtered.reduce((acc, cur) => {
      const date = cur.date;
      const diaries = acc[date] || [];
      acc[date] = [cur.diary, ...diaries];
      return acc;
    }, {});
  }

  /**
   * シートの最終行にデータを追加する
   * @param {Array<Array<any>>} row - 追加するデータ
   * @private
   */
  static _addRow(row) {
    const sheet = this._getSheet(BOUND_SHEETS.DB);
    if (!sheet) return;

    const lastRow = sheet.getLastRow();
    const fromRow = lastRow + 1;
    const fromCol = 1;
    const rows = row.length;
    const cols = row[0].length;
    const range = sheet.getRange(fromRow, fromCol, rows, cols);
    range.setValues(row);
  }
}
