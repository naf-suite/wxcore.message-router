'use strict';

/**
 * partern: 关键字匹配模式，可以使字符串或者正则表达式，如果为空表示匹配所有字符串，即默认处理规则
 * url： 消息转发的url
 * validity: 转发规则有效期，值可以使字符串（结束时间）或者数组（起始时间+结束时间）
 * disable: 规则是否被禁用
 * wxid: 微信号ID，字符串或者数组
 */
const wxid_jobs = 'gh_cc6425d359a6';

// module.exports.defaultUrl = 'http://localhost:7002/weixin/CoreServlet';
module.exports.rules = [
  { wxid: wxid_jobs, msgType: 'event', url: 'http://localhost:7003/weixin/produce' },
];
