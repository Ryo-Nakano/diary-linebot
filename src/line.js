import { ACCESS_TOKEN } from 'constants';

class Line {
  constructor() {
    this._pushUrl = 'https://api.line.me/v2/bot/message/push';
    this._replyUrl = 'https://api.line.me/v2/bot/message/reply';
  }

  reply(replyToken, messages) {
    try {
      const res = UrlFetchApp.fetch(this._replyUrl, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer ' + ACCESS_TOKEN,
        },
        method: 'post',
        payload: JSON.stringify({ replyToken, messages }),
      });
      return res;
    } catch (err) {
      // err.functionName = err.functionName || arguments.callee.name;
      console.error(err);
      throw err;
    }
  }

  push(to, messages) {
    try {
      const postData = { to, messages };
      const headers = {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + ACCESS_TOKEN,
      };

      const options = {
        method: "post",
        headers: headers,
        payload: JSON.stringify(postData),
      };

      const res = UrlFetchApp.fetch(this._pushUrl, options);
      return res;
    } catch (err) {
      // err.functionName = err.functionName || arguments.callee.name;
      console.error(err);
      throw err;
    }
  }
}

export default Line;
