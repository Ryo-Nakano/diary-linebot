const scriptProperties = PropertiesService.getScriptProperties();
const SSID = scriptProperties.getProperty('SSID');
const LINE_USER_ID = scriptProperties.getProperty('LINE_USER_ID');
const ACCESS_TOKEN = scriptProperties.getProperty('ACCESS_TOKEN');

export { ACCESS_TOKEN, LINE_USER_ID, SSID };
