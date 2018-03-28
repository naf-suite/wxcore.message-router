'use strict';
const moment = require('moment');
const { MessageUtil: wxutil } = require('naf-weixin');
const { isNullOrUndefined } = require('naf-core').Util;

module.exports = app => {
  class WeixinController extends app.Controller {
    async verify() {
      const { /* signature, timestamp, nonce,*/ echostr } = this.ctx.query;
      // TODO: 校验签名，此处省略
      // ...

      this.ctx.body = echostr;
    }
    async _default() {
      const logger = this.ctx.logger;
      const rawData = this.ctx.request.rawBody;
      logger.debug(`原始消息内容: ${rawData}`);
      // TODO: 解析消息内容
      const msg = wxutil.extractFromXml(rawData);
      if (msg == null) {
        logger.error('解析消息失败');
        logger.info(rawData);
        logger.info(this.ctx.request);
        this.ctx.body = '解析消息失败';
        return;
      }
      // TODO: 消息回复
      if (msg.msgType === 'text' || msg.msgType === 'voice') {
        this.ctx.body = wxutil.generateXml(msg.fromUser, msg.toUser, '谢谢参与互动.');
      } else {
        this.ctx.body = 'success';
        return;
      }
    }

    async echo() {
      const logger = this.ctx.logger;
      const rawData = this.ctx.request.rawBody;
      logger.debug(`原始消息内容: ${rawData}`);
      // TODO: 解析消息内容
      const msg = wxutil.extractFromXml(rawData);
      if (msg == null) {
        logger.error('解析消息失败');
        logger.info(rawData);
        logger.info(this.ctx.request);
        this.ctx.body = '解析消息失败';
        return;
      }
      let content = 'none';
      if (msg.msgType === 'text') {
        content = wxutil.contentFromXml(rawData);
      } else if (msg.msgType === 'voice') {
        content = wxutil.recognitionFromXml(rawData) || '语音识别失败';
      }
      logger.info(`echo ${msg.msgType} message: ${content}`);
      // TODO: 消息回复
      this.ctx.body = wxutil.generateXml(msg.fromUser, msg.toUser, content);
    }

    async dispatch() {
      const logger = this.ctx.logger;
      let rawData = this.ctx.request.rawBody;
      const { rules, defaultUrl, defaultReply } = this.app.config.messageRouter;
      let targetUrl;

      // this.ctx.body = 'success'

      // TODO: 解析消息内容
      const msg = wxutil.extractFromXml(rawData);
      if (msg == null) {
        logger.error('解析消息失败');
        logger.info(rawData);
        logger.info(this.ctx.request);
        this.ctx.body = '解析消息失败';
        return;
      }
      logger.info(`receive ${msg.msgType} message from ${msg.fromUser} to ${msg.toUser}`);
      // if (msg.msgType != 'text') {
      //     logger.info(`ignore non-text message : ${msg.msgType}`)
      //     this.ctx.body = 'ok'
      //     return;
      // }
      let content = null;
      if (msg.msgType === 'text') {
        content = wxutil.contentFromXml(rawData);
        logger.info(`text content: ${content}`);
      } else if (msg.msgType === 'voice') {
        content = wxutil.recognitionFromXml(rawData);
        // if(!content || content == ''){
        //     logger.info(`公众号 ${msg.toUser} 未开通语音识别功能`)
        //     this.ctx.body = wxutil.generateXml(msg.fromUser, msg.toUser, '未开通语音识别功能')
        //     return;
        // }
        // TODO: 去掉文本末尾的句号
        if (content && content.endsWith('。')) {
          content = content.substr(0, content.length - 1);
          rawData = rawData.replace(/<Recognition><!\[CDATA\[(.*)\]\]><\/Recognition>/, `<Recognition><![CDATA[${content}]]></Recognition>`);
        }
        logger.info(`recognition content: ${content}`);
      }
      if (content || msg.msgType === 'voice') {
        const now = moment().format('YYYYMMDD');
        // let content = wxutil.contentFromXml(rawData)
        for (let i = 0; i < rules.length; i++) {
          const rule = rules[i];
          // console.log(rule)
          if (rule.disable) continue;
          // if (rule.pattern && !content.match(rule.pattern)) {
          //     logger.debug(`not match: ${content} - ${rule.pattern}`)
          //     continue;
          // }

          // TODO: 匹配wxid
          // console.log(rule.wxid)
          if (rule.wxid &&
                        ((rule.wxid instanceof Array && rule.wxid.indexOf(msg.toUser) === -1)
                            || (typeof rule.wxid === 'string' && rule.wxid !== msg.toUser))) {
            // console.log(msg.toUser)
            continue;
          }

          // TODO: 检查规则有效期
          if (rule.validity) {
            let start,
              end;
            if (typeof rule.validity === 'string') {
              end = rule.validity;
            } else if (rule.validity instanceof Array) {
              if (rule.validity.length === 1) {
                end = rule.validity[0];
              } else if (rule.validity.length > 1) {
                start = rule.validity[0];
                end = rule.validity[1];
              }
            }
            if (start && start > now) {
              logger.debug(`message router rule expired : ${rule.pattern} - ${end}`);
              continue;
            }
            if (end && end < now) {
              rule.disable = true;
              logger.debug(`message router rule expired : ${rule.pattern} - ${end}`);
              continue;
            }
            console.log(`start:${start} end: ${end}`);
          }

          // TODO: 匹配消息类型
          if (rule.msgType) {
            if (msg.msgType === rule.msgType) {
              targetUrl = rule.url;
              logger.debug(`msgType matched: ${content} - ${rule.msgType}`);
            } else {
              logger.debug(`msgType not matched：rule-${rule.msgType} vs msg-${msg.msgType}`);
              continue;
            }
          }

          // TODO: 匹配关键字
          if (!rule.pattern || content.match(rule.pattern)) {
            // TODO: 自动回复处理
            if (!rule.url && rule.reply) {
              this.ctx.body = wxutil.generateXml(msg.fromUser, msg.toUser, rule.reply);
              return;
            }
            if (rule.url) {
              targetUrl = rule.url;
              break;
            }
          } else {
            logger.debug(`not match: ${content} - ${rule.pattern}`);
            targetUrl = null;
          }

        }
        if (targetUrl) {
          logger.info(`route 【${content}】 to ${targetUrl} `);
        } else {
          if (msg.msgType === 'voice' && (!content || content === '')) {
            logger.info(`公众号 ${msg.toUser} 未开通语音识别功能或语音识别失败`);
            this.ctx.body = wxutil.generateXml(msg.fromUser, msg.toUser, '语音识别失败');
            return;
          }

          logger.info(`route 【${content}】 to default url `);
        }
      } else if (msg.msgType === 'event') {
        const data = wxutil.eventFromXml(rawData);
        const rule = rules.find(r =>
          r.msgType === 'event'
          && r.url
          && (isNullOrUndefined(r.pattern)
            || (data.event && data.event.match(r.pattern))
            || (data.eventKey && data.eventKey.match(r.pattern))));
        if (rule) {
          targetUrl = rule.url;
        }
      }
      // TODO: 转发请求
      let result;
      try {
        result = (targetUrl || defaultUrl) && await this.ctx.curl(targetUrl || defaultUrl, {
          method: 'POST',
          content: rawData,
          headers: {
            'content-type': 'text/xml',
          },
          // 创建连接超时 1 秒，接收响应超时 3 秒，用于响应比较大的场景
          timeout: [ 1000, 3000 ],
        });
      } catch (err) {
        logger.error(err);
      }
      if (result && result.status === 200) {
        logger.info('route message result: ok');
        logger.debug(result.data);
        this.ctx.body = result.data;
      } else {
        logger.error(`route message fail: ${result && result.status}`);
        // TODO: 默认消息回复
        if (msg.msgType === 'text' || msg.msgType === 'voice') {
          this.ctx.body = wxutil.generateXml(msg.fromUser, msg.toUser, defaultReply || '谢谢参与互动');
        } else {
          this.ctx.body = 'success';
        }
      }
    }
  }
  return WeixinController;
};
