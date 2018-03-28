'use strict';

/**
 * partern: 关键字匹配模式，可以使字符串或者正则表达式，如果为空表示匹配所有字符串，即默认处理规则
 * url： 消息转发的url
 * validity: 转发规则有效期，值可以使字符串（结束时间）或者数组（起始时间+结束时间）
 * disable: 规则是否被禁用
 * wxid: 微信号ID，字符串或者数组
 */
const wxid_fdl = 'gh_cab77bde63d1';
const wxid_hnw = 'gh_5e653f6e55d7';
const wxid_hsh = 'gh_c8ac8e95af92';
const wxid_huian = 'gh_d5a50200e536';

module.exports.defaultUrl = 'http://10.163.150.130:8000/weixin/CoreServlet';
module.exports.rules = [
  { wxid: wxid_hsh, pattern: '^分发测试', url: 'http://10.163.150.13:9268/weixin/CoreServlet', validity: '20170503' },
  { wxid: wxid_huian, pattern: '^分发测试', url: 'http://10.163.150.13:9268/weixin/CoreServlet', validity: '20170503' },
  { wxid: wxid_huian, msgType: 'voice', url: 'http://10.163.150.13:9268/weixin/CoreServlet', validity: '20170503' },
  { wxid: wxid_huian, msgType: 'event', url: 'http://localhost:7002/weixin/CoreServlet' },
];
