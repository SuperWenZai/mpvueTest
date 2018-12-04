<template>
  <div class="entryIndex">
    <!-- 地址 开始 -->
    <div class="item">
      <div class="adress">
        <div class="text ellipsis">
          广州市荔湾区小学小学五年级02
        </div>
        <i class="icon icon-right"></i>
      </div>
    </div>
    <!-- 地址 结束 -->

    <!-- swiper 开始 -->
    <div class="item mt-20 mb-20">
      <div class="swiper">
        <swiper :interval="interval"
                :duration="duration">
          <block v-for="(item,index) in imgUrls"
                 :key="index">
            <swiper-item>
              <image :src="item"
                     class="slide-image" />
            </swiper-item>
          </block>
        </swiper>
      </div>
    </div>
    <!-- swiper 结束 -->

    <!-- 操作按钮 开始 -->
    <div class="operat mb-20">
      <div class="operatContain mb-10">
        <div class="itemBtn">
          进入缴费
        </div>
        <div class="itemBtn">
          申请单日退餐
        </div>
      </div>
      <p class="tipText">当学生信息发生改变时，请修改学生信息</p>
    </div>
    <!-- 操作按钮 结束 -->

    <!-- banner 开始 -->
    <div class="banner clearfix">
      <div class="blockContain mb-20">
        <div class="blockContainleft">
          <div class="block banner-1">

          </div>
        </div>
        <div class="blockContainright">
          <div class="block banner-2 mb-20">

          </div>
          <div class="block banner-2">

          </div>
        </div>
      </div>
      <div class="itemContain">
        <div class="item banner-3">

        </div>
      </div>
    </div>
    <!-- banner 结束 -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'index',
      imgUrls: [
        'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'
      ],
      indicatorDots: false,
      autoplay: false,
      interval: 5000,
      duration: 1000
    }
  },
  methods: {
  },
  created () {
    let _ = this;

    wx.setNavigationBarTitle({
      title: "首页"
    });

    wx.getLocation({
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        _.server.get({ name: 'latitude', data: { longitude: longitude, latitude: latitude } }).then(result => {
          console.log('获取位置')
          console.log(result);
        })
      }
    })

  },
}
</script>

<style lang="less" scoped>
.entryIndex {
  padding: 20rpx 20rpx;
  overflow: hidden;
  box-sizing: border-box;
  .item {
    border-radius: 8rpx;
    box-shadow: 0rpx 0rpx 20rpx rgba(0, 0, 0, 0.14);
    background-color: #ffffff;
    overflow: hidden;
  }
  .block {
    box-shadow: 0rpx 0rpx 20rpx rgba(0, 0, 0, 0.14);
    background-color: #ffffff;
    overflow: hidden;
  }
  .blockContain {
    display: flex;
    justify-content: space-between;
    height: 260rpx;
    .blockContainleft {
      width: 346rpx;
    }
    .blockContainright {
      width: 346rpx;
    }
    .banner-1 {
      height: 260rpx;
    }
    .banner-2 {
      height: 120rpx;
    }
  }
  .itemContain {
    height: 260rpx;
    .banner-3 {
      height: 260rpx;
    }
  }
}
.adress {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 10px;
  .text {
    font-size: 28rpx;
    color: #333333;
    width: 520rpx;
  }
}
.swiper {
  height: 400rpx;
  overflow: hidden;
  swiper {
    height: 100%;
    overflow: hidden;
  }
  .slide-image {
    width: 100%;
    height: 100%;
  }
}
.operat {
  box-sizing: border-box;
  overflow: hidden;
  .operatContain {
    display: flex;
    justify-content: space-between;
    .itemBtn {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: lightskyblue;
      color: #ffffff;
      font-size: 28rpx;
      width: 49%;
      height: 80rpx;
    }
  }
  .tipText {
    color: #333333;
    font-size: 28rpx;
    text-align: center;
  }
}
</style>
