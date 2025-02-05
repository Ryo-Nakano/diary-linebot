import operations from 'operations';

// ユーザーからのメッセージ受信時に発火
global.doPost = (e) => {
  try {
    operations.doPost(e);
  } catch (err) {
    throw err;
  }
};

global.pushDaily = () => {
  try {
    operations.pushDaily();
  } catch (err) {
    throw err;
  }
};

global.pushWeekly = () => {
  try {
    operations.pushWeekly();
  } catch (err) {
    throw err;
  }
};

global.setTriggerDaily = () => {
  try {
    operations.setTriggerDaily();
  } catch (err) {
    throw err;
  }
};

global.setTriggerWeekly = () => {};
