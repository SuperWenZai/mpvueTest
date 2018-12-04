<template>
  <div class="container"
       @click="clickHandle('test click', $event)">

    <div class="userinfo"
         @click="bindViewTap">
      <img class="userinfo-avatar"
           v-if="userInfo.avatarUrl"
           :src="userInfo.avatarUrl"
           background-size="cover" />
      <div class="userinfo-nickname">
        <card :text="userInfo.nickName"></card>
      </div>
    </div>

    <div class="usermotto">
      <div class="user-motto">
        <card :text="motto"></card>
      </div>
    </div>

    <form class="form-container">
      <input type="text"
             class="form-control"
             v-model="motto"
             placeholder="v-model" />
      <input type="text"
             class="form-control"
             v-model.lazy="motto"
             placeholder="v-model.lazy" />
    </form>
    <a href="/pages/counter/main"
       class="counter">去往Vuex示例页面</a>
    <button @click="getData">测试云函数</button>
    <button @click="doUpload">上传图片</button>
    <button @click="getDataDb">获取数据库data</button>
    <button @click="getReq">获取请求data</button>
    <button @click="getUserInfo">登陆</button>
  </div>
</template>

<script>
import card from '@/components/card'

export default {
  data () {
    return {
      motto: 'Hello World',
      userInfo: {},
      result: ''
    }
  },

  components: {
    card
  },

  methods: {
    getData () {
      let _ = this;
      // 调用云函数，返回用户openId，参数为云函数名称
      wx.cloud.callFunction({
        name: 'user',
        data: {
          a: 1,
          b: 2
        }
      })
        .then(res => {

          wx.showToast({
            title: '调用成功',
          })

          _.result = res.result;

          console.log(_.result);
        })
        .catch(err => {
          wx.showToast({
            icon: 'none',
            title: '调用失败',
          })
          console.error('[云函数] [sum] 调用失败：', err)
        })
    },
    // 上传图片
    doUpload () {
      // 选择图片
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {

          wx.showLoading({
            title: '上传中',
          })

          const filePath = res.tempFilePaths[0]

          // 上传图片
          const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: res => {
              console.log('[上传文件] 成功：', res)

              app.globalData.fileID = res.fileID
              app.globalData.cloudPath = cloudPath
              app.globalData.imagePath = filePath
            },
            fail: e => {
              console.error('[上传文件] 失败：', e)
              wx.showToast({
                icon: 'none',
                title: '上传失败',
              })
            },
            complete: () => {
              wx.hideLoading()
            }
          })

        },
        fail: e => {
          console.error(e)
        }
      })
    },
    getDataDb () {
      const db = wx.cloud.database();
      // 查询当前用户所有的 counters
      db.collection('counters').where({
        _openid: this.result.userInfo.openId
      }).get({
        success: res => {
          console.log('[数据库] [查询记录] 成功: ', res)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
    },
    getReq () {
      wx.request({
        url: 'http://qc.can-dao.com:106/Action?_name=user&serviceId=4&actionId=11', //仅为示例，并非真实的接口地址
        method: 'POST',
        data: {
          loginKey: "13527680054",
          name: "13527680054",
          passwd: "e10adc3949ba59abbe56e057f20f883e"
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success (res) {
          console.log(res)
        }
      })
    },
    bindViewTap () {
      const url = '../logs/main'
      wx.navigateTo({ url })
    },
    getUserInfo () {

      console.log('登陆')
      // 调用登录接口
      wx.login({
        success: (result) => {
          console.log(result);
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo
              console.log(this.userInfo);
            }
          })
        }
      })
    },
    clickHandle (msg, ev) {
      console.log('clickHandle:', msg, ev)
    }
  },

  created () {
    // 调用应用实例的方法获取全局数据
    // this.getUserInfo();
  }
}
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}

.counter {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
