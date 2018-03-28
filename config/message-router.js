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

module.exports.defaultUrl = 'http://localhost:7002/weixin/CoreServlet';
module.exports.rules = [
  { wxid: wxid_hsh, pattern: '^好人帮', url: 'http://10.163.150.58:9011/radio/coreServlet/deal', validity: [ '20170504', '20170511' ] },
  { wxid: wxid_hsh, pattern: '^大赢家', url: 'http://10.163.150.58:9011/radio/coreServlet/deal', validity: [ '20170504', '20170511' ] },
  { wxid: wxid_hsh, pattern: '^天天家长会', url: 'http://10.163.150.58:9011/radio/coreServlet/deal', validity: [ '20170504', '20170511' ] },
  { wxid: wxid_hsh, pattern: '^抢话费', url: 'http://10.163.150.58:9011/radio/coreServlet/deal', validity: [ '20170512', '20170519' ] },
  { wxid: wxid_hsh, pattern: '^美食', url: 'http://10.163.150.58:9011/radio/coreServlet/deal', validity: [ '20170512', '20170519' ] },
  { wxid: wxid_hsh, pattern: '^和生活', url: 'http://10.163.150.58:9011/radio/coreServlet/deal', validity: [ '20170512', '20170519' ] },
  { wxid: wxid_hsh, pattern: '^电台互动', url: 'http://10.163.150.58:9011/radio/coreServlet/deal', validity: [ '20170519', '20170525' ] },
  { wxid: wxid_hsh, pattern: '^和生活', url: 'http://10.163.150.58:9011/radio/coreServlet/deal', validity: [ '20170519', '20170525' ] },
  { wxid: wxid_hsh, pattern: '^抢话费', url: 'http://10.163.150.58:9011/radio/coreServlet/deal', validity: [ '20170519', '20170525' ] },
  { wxid: wxid_hsh, pattern: '^和生活', url: 'http://10.163.150.58:9011/radio/coreServlet/deal', validity: [ '20170526', '20170531' ] },
  { wxid: wxid_hsh, pattern: '^互动', url: 'http://10.163.150.58:9011/radio/coreServlet/deal', validity: [ '20170526', '20170531' ] },
  { wxid: wxid_hsh, pattern: '^宝贝健康成长', url: 'http://10.163.150.58:9011/radio/coreServlet/deal', validity: [ '20170526', '20170531' ] },
  { wxid: wxid_hsh, pattern: '^test', url: 'http://localhost:7002/radio/coreServlet/deal', validity: '20170504' },
  { wxid: wxid_huian, msgType: 'event', url: 'http://localhost:7002/weixin/produce' },
];
