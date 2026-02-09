import { BaseOperation } from 'base_classes/base_operation';
import { Diary } from 'sheet_data/bound_sheet/diary';
import { LineApiClient, LINE_API } from 'apis/line_api_client';
import { LINE_USER_ID } from 'constants';

/**
 * 日記データをCSVとしてGoogle Driveにアーカイブする
 */
export class ArchiveDiaryOperation extends BaseOperation {
  /**
   * メイン処理
   */
  _operation() {
    try {
      // 1. 全日記データを取得
      const allDiaries = Diary.all;

      // 2. CSV文字列を生成
      const csv = this._generateCsv(allDiaries);

      // 3. Google Driveにファイルを保存
      this._saveToGoogleDrive(csv);
    } catch (error) {
      // エラー時はLINEに通知
      this._notifyError(error);
      throw error;
    }
  }

  /**
   * 日記データをCSV文字列に変換する
   * @param {Array<{date: string, time: string, diary: string}>} diaries
   * @returns {string}
   */
  _generateCsv(diaries) {
    const header = 'date,time,what';
    const rows = diaries.map(d => {
      const escapedDiary = this._escapeCsvField(d.diary);
      return `${d.date},${d.time},${escapedDiary}`;
    }).join('\n');
    return `${header}\n${rows}`;
  }

  /**
   * CSVフィールドをRFC 4180に準拠してエスケープする
   * @param {string} field
   * @returns {string}
   */
  _escapeCsvField(field) {
    if (field == null) return '';
    const str = String(field);
    // カンマ、ダブルクォート、改行を含む場合はダブルクォートで囲む
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  /**
   * CSVファイルをGoogle Driveに保存する
   * @param {string} csvContent
   */
  _saveToGoogleDrive(csvContent) {
    const folderId = PropertiesService.getScriptProperties().getProperty('GOOGLE_DRIVE_ARCHIVE_FOLDER_ID');
    if (!folderId) {
      throw new Error('GOOGLE_DRIVE_ARCHIVE_FOLDER_ID is not set');
    }

    const folder = DriveApp.getFolderById(folderId);
    const fileName = `diary_archive_${Utilities.formatDate(new Date(), 'JST', 'yyyyMMdd')}.csv`;

    // 新規ファイルを作成（同名ファイルがあっても問題なし）
    folder.createFile(fileName, csvContent, 'text/csv');
  }

  /**
   * エラーをLINEで通知する
   * @param {Error} error
   */
  _notifyError(error) {
    const client = new LineApiClient();
    const messages = [{ type: 'text', text: `日記アーカイブに失敗しました: ${error.message}` }];
    client.request(LINE_API.message.push({ to: LINE_USER_ID, messages }));
  }
}
