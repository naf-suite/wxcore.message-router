'use strict';

const messageRouter = require('./message-router');

module.exports = appInfo => {
  const config = {};

  // should change to your own
  config.keys = appInfo.name + '_1493712251326_9334';

  config.security = { csrf: { enable: false } };

  // 微信消息路由规则
  config.messageRouter = messageRouter;

  config.bodyParser = {
    enableTypes: [ 'json', 'form', 'text' ],
    extendTypes: {
      text: [ 'text/xml', 'text/html' ],
    },
  };

  config.logger = {
    // level: 'DEBUG',
    // consoleLevel: 'DEBUG',
  };

  return config;
};
