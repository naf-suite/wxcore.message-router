
'use strict';

module.exports = class WxUtil {
  static extractFromXml(xmlData) {
    try {
      const toUser = /<ToUserName><!\[CDATA\[(.*)\]\]><\/ToUserName>/.exec(xmlData)[1];
      const fromUser = /<FromUserName><!\[CDATA\[(.*)\]\]><\/FromUserName>/.exec(xmlData)[1];
      const msgType = /<MsgType><!\[CDATA\[(.*)\]\]><\/MsgType>/.exec(xmlData)[1];
      return { toUser, fromUser, msgType };
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  static contentFromXml(xmlData) {
    try {
      const content = /<Content><!\[CDATA\[(.*)\]\]><\/Content>/.exec(xmlData)[1];
      return content;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  static recognitionFromXml(xmlData) {
    try {
      const content = /<Recognition><!\[CDATA\[(.*)\]\]><\/Recognition>/.exec(xmlData)[1];
      return content;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  static eventFromXml(xmlData) {
    try {
      const event = WxUtil.tryParse(xmlData, /<Event><!\[CDATA\[(.*)\]\]><\/Event>/);
      const eventKey = WxUtil.tryParse(xmlData, /<EventKey><!\[CDATA\[(.*)\]\]><\/EventKey>/);
      const ticket = WxUtil.tryParse(xmlData, /<Ticket><!\[CDATA\[(.*)\]\]><\/Ticket>/);
      return { event, eventKey, ticket };
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  static tryParse(xmlData, regex) {
    try {
      const res = regex.exec(xmlData);
      return res && res[1] || undefined;
    } catch (err) {
      console.error(err);
    }
  }

  static generateXml(toUser, fromUser, textContent) {
    return `<xml>
<ToUserName><![CDATA[${toUser}]]></ToUserName>
<FromUserName><![CDATA[${fromUser}]]></FromUserName>
<CreateTime>${new Date().getTime()}</CreateTime>
<MsgType><![CDATA[text]]></MsgType>
<Content><![CDATA[${textContent}]]></Content>
</xml>`;
  }
};
