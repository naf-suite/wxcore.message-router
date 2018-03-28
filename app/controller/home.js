'use strict';

module.exports = app => {
  class HomeController extends app.Controller {
    async index() {
      console.log(this.app.config.messageRouter);
      this.ctx.body = 'hi, egg';
    }

    async callback() {
      console.log(this.ctx.request.rawBody);
      this.ctx.body = 'hi, egg';
    }
  }
  return HomeController;
};
