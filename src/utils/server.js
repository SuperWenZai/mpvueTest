/**
 * 建议不引入其他
 */
if (!console) {
  console.error = () => {};
  console.warn = () => {};
  console.log = () => {};
  console.info = () => {};
}

var SERVER = {

  rootVue: null,
  serverLib: {},
  _serverLib: null,
  key: "",
  target: '',

  loadingCount: 0,
  _loadingCommonFn(status) {
    if (status) {
      this.loadingCount++;
      this._loadingFn(true);
    } else {
      this.loadingCount--;
      if (this.loadingCount <= 0) {
        this._loadingFn(false);
        this.loadingCount = 0;
      }
    }

  },
  _loadingFn() {}

  ,
  _errorCommonFn(msg) {
    if (this._errorFn) {
      this._errorFn(msg);
    } else {
      console.error(msg);
    }
  },
  _errorFn: null,
  _msgCommonFn(msg) {
    if (this._msgFn) {
      this._msgFn(msg);
    } else {
      console.info(msg);
    }
  },
  _msgFn: null,
  set({
    Vue,
    serverLib,
    target,
    error,
    msg,
    key
  }) {

    if (Vue) {
      SERVER.rootVue = Vue;
    }

    if (target) {
      SERVER.target = target;
    }

    if (serverLib) {
      SERVER._serverLib = serverLib;
      for (var _key in serverLib) {

        if (typeof serverLib[_key][0] === 'String' && serverLib[_key][0].indexOf('candao.') === 0) {

          SERVER.serverLib[_key] = {
            url: "/Action?_name=" + _key,
            data: typeof serverLib[_key][1] === 'object' ? serverLib[_key][1] : {}
          }

          SERVER.serverLib[_key].data.actionName = serverLib[_key][0];
        } else {
          SERVER.serverLib[_key] = {
            url: "/Action?_name=" + _key +
              "&serviceId=" + serverLib[_key][0] +
              "&actionId=" + serverLib[_key][1],
            data: typeof serverLib[_key][2] === 'object' ? serverLib[_key][2] : {}
          }
        }
      }
    }

    error && (SERVER._errorFn = error);
    msg && (SERVER._msgFn = msg);
    key && (SERVER.key = key);


  },
  _getUrlDataFn({
    name = '',
    data = {}
  }) {

    if (!name) {
      console.error("SERVER.js [name]不为能空");
      return false;
    }

    if (!SERVER._serverLib) {
      console.error("SERVER.js 未配置 serverLib");
      return false;
    }

    if (!SERVER.serverLib[name]) {
      console.error("SERVER.js 不存在serverLib[" + name + "]");
      return false;
    }

    var urlData = {
      url: SERVER.serverLib[name].url,
      data: { ...SERVER.serverLib[name].data,
        ...data
      }
    }

    if (SERVER.key) {
      urlData.url = urlData.url + "&key=" + SERVER.key;
    }

    return urlData;

  },
  logs: [],
  mixin: {
    data() {
      return {
        server: {
          setKey: function (key) {

            SERVER.key = key;
          },
          get: function ({
            target = SERVER.target,
            name = '',
            urlUnit = 'Action',
            data = {},
            isCheck = false
          }) {

            var urlData = SERVER._getUrlDataFn({
              name,
              data
            });
            if (!urlData) {
              return {
                then() {},
                catch () {}
              };
            }

            if (urlUnit !== 'Action') {
              urlData.url = urlData.url.replace("/Action", "/" + urlUnit);
            }

            urlData.data = JSON.stringify(urlData.data);

            return this.require({
              target,
              ...urlData,
              isCheck
            });
          },
          cache: {
            _require: function (result) {
              return _require({
                target: result.target,
                url: result.url,
                data: result.data
              });
            },
            get: function (name) {
              var url = "/Cache?actionId=2";
              if (SERVER.key) {
                url += "&key=" + SERVER.key;
              }
              return this._require({
                target: SERVER.target,
                url,
                data: name
              });
            },
            set: function (data) {
              var url = "/Cache?actionId=1";
              if (SERVER.key) {
                url += "&key=" + SERVER.key;
              }
              return this._require({
                target: SERVER.target,
                url,
                data
              });
            },
            check: function (name) {
              var url = "/Cache?actionId=3";
              if (SERVER.key) {
                url += "&key=" + SERVER.key;
              }
              return this._require({
                target: SERVER.target,
                url,
                data: name
              });
            }
          },
          require: _require

        }
      }

    }
  }
};

var _require = async function ({
  target = '',
  url = '',
  data = {},
  isCheck = false,
  type = "post"
}) {

  // SERVER._loadingCommonFn(true);
  // var promise = SERVER.axios[type](url, data || {}).catch(function (error) {
  //   SERVER._errorCommonFn("网络异常,请稍后再试 " + url);
  //   SERVER._loadingCommonFn(false);
  //   return error;
  // }).then(function (result) {
  //   SERVER._loadingCommonFn(false);
  //   return result.data;
  // });

  var promise = new Promise((resolve, reject) => {
    SERVER._loadingCommonFn(true);
    wx.request({
      url: target + url, //仅为示例，并非真实的接口地址
      data: data,
      method: type,
      success(result) {
        SERVER._loadingCommonFn(false);
        resolve(result.data);
      },
      fail(error) {
        SERVER._errorCommonFn("网络异常,请稍后再试 " + target + url);
        SERVER._loadingCommonFn(false);
        resolve(error);
      }
    })
  });

  if (isCheck) {
    promise = promise.then(function (result) {
      if (!result) {
        SERVER._errorCommonFn("SERVER.js 接口无返回内容 " + target + url);
      } else if (result.status == 1) {
        return result.data || {};
        //SERVER._msgCommonFn(result.msg||'操作成功');
        //then && then(result.data);
      } else if (result.msg) {
        SERVER._errorCommonFn(result.msg);
      }
      return false;


    });
  } else {
    // promise = promise.then(function(result){
    //   return result.data||false;
    // })
  }




  // console.log('promise')
  // console.log(promise)
  return await promise;


};

export default SERVER;
