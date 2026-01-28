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
   * 指定期間の日記を取得する
   * @param {string} since - 開始日 (yyyy/MM/dd形式)
   * @param {string} until - 終了日 (yyyy/MM/dd形式)
   * @returns {Object} 日付をキーに、日記の配列を値とするオブジェクト
   */
  static getBetween(since, until) {
    const sheet = this._getSheet(BOUND_SHEETS.DB);
    if (!sheet) return {};

    const data = sheet.getDataRange().getValues().slice(2);
    const array = [];

    // 末尾から見ていく
    for (let i = data.length - 1; i >= 0; i--) {
      const date = Utilities.formatDate(data[i][0], 'JST', 'yyyy/MM/dd');
      const diary = data[i][2];

      if (date > until) continue;
      if (date < since) break;

      array.push({ date, diary });
    }

    return array.reduce((acc, cur) => {
      const date = cur.date;
      const diaries = acc[date] || [];
      const newDiaries = [cur.diary, ...diaries];
      acc[date] = newDiaries;
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
