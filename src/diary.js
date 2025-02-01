import { SSID } from 'constants';

class Diary {
  constructor() {
    this._dbSheet = this._getDbSheet();
  }

  save(text) {
    try {
      const date = Utilities.formatDate(new Date(), "JST", "yyyy/MM/dd"); // 日付を取得
      const time = Utilities.formatDate(new Date(), "JST", "HH:mm");       // 現在時刻を取得
      const row = [[date, time, text]];
      this._save(row);
    } catch (err) {
      err.functionName = err.functionName || arguments.callee.name;
      console.error(err);
      throw err;
    }
  }

  getDiariesBetween(since, until) {
    try {
      const data = this._dbSheet.getDataRange().getValues().slice(2);
      const array = [];
      // 末尾から見ていく for 文
      for (let i = data.length - 1; i >= 0; i--) {
        const date = Utilities.formatDate(data[i][0], "JST", "yyyy/MM/dd");
        const diary = data[i][2];

        if (date > until) continue; // 対象区間をすぎた場合は次へ
        if (date < since) break;      // 対象区間に入る前の場合はループ終了

        array.push({ date, diary });
      }

      return array.reduce((acc, cur) => {
        const date = cur.date;
        const diaries = acc[date] || [];
        // 最新の日記を先頭にするために、既存の配列の前に追加
        const newDiaries = [cur.diary, ...diaries];
        acc[date] = newDiaries;
        return acc;
      }, {});
    } catch (err) {
      err.functionName = err.functionName || arguments.callee.name;
      console.error(err);
      throw err;
    }
  }

  _getDbSheet() {
    const spreadsheet = SpreadsheetApp.openById(SSID);
    return spreadsheet.getSheetByName('DB');
  }

  _save(row) {
    const lastRow = this._dbSheet.getLastRow();
    const fromRow = lastRow + 1;
    const fromCol = 1;
    const rows = row.length;
    const cols = row[0].length;
    const range = this._dbSheet.getRange(fromRow, fromCol, rows, cols);
    range.setValues(row);
  }
}

export default Diary;
