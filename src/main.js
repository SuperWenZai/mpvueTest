import Vue from 'vue';
import App from './App';
import "./common.less"; // 引入通用样式文件

App.onLaunch = () => {

  if (!wx.cloud) {
    console.error('请使用 2.2.3 或以上的基础库以使用云开发');
  } else {
    wx.cloud.init({
      env: 'soil-e4aeb5',
      traceUser: true
    })
  }
};

Vue.config.productionTip = false;
App.mpType = 'app';

const app = new Vue(App)
app.$mount()

// 引入 接口请求插件
import ServerPlugin from './utils/server';

// 引入 接口库
import serverLib from './server';

// 配置 请求参数
ServerPlugin.set({
  serverLib,
  target: 'http://qc.can-dao.com:106'
  // key:"b15ae13796ea20b4" //如果是标准版,则需要设置该项
});

// 全局混入
Vue.mixin({
  ...ServerPlugin.mixin
});
