const App = getApp();

// 枚举类：发货方式
import DeliveryTypeEnum from '../../utils/enum/DeliveryType.js';

Page({

  data: {
    // 页面参数
    options: {},
    DeliveryTypeEnum,
    curDelivery: null,
    // 页面元素
    items: {},
    scrollTop: 0,
    shop:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 当前页面参数
    this.setData({
      options
    });
    // 加载页面数据
    this.getPageData();
  },

  /**
   * 加载页面数据
   */
  getPageData: function(callback) {
    let _this = this;
    App._get('page/index', {
      page_id: _this.data.options.page_id || 0
    }, function(result) {
      // 设置顶部导航栏栏
      _this.setPageBar(result.data.page);
      _this.setData(result.data);
      // 回调函数
      typeof callback === 'function' && callback();
    });
  },

  goPituan:function(){
    wx.switchTab({
      url: '../sharing/index/index',
    })
  },

  goShop:function(){
    wx.switchTab({
      url: '../shop-goods/shop-goods',
    })
  },

  /**
   * 设置顶部导航栏
   */
  setPageBar: function(page) {
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: page.params.title
    });
    // 设置navbar标题、颜色
    wx.setNavigationBarColor({
      frontColor: page.style.titleTextColor === 'white' ? '#ffffff' : '#000000',
      backgroundColor: page.style.titleBackgroundColor
    })
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    let _this = this;
    return {
      title: _this.data.page.params.share_title,
      path: "/pages/index/index?" + App.getShareUrlParams()
    };
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() {
    // 获取首页数据
    this.getPageData(function() {
      wx.stopPullDownRefresh();
    });
  },

  getCityNameOFLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        console.log("定位成功");
        var locationString = res.latitude + "," + res.longitude;
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/?l&get_poi=1',
          data: {
            "key": "HP3BZ-4D7WS-OONOX-622XD-2HPFE-RYFTB",
            "location": locationString
          },
          method: 'GET',
          // header: {}, 
          success: function (res) {
            console.log(res)
            App._get('shop/lists', {
              longitude: res.data.result.location.lng,
            latitude: res.data.result.location.lat,}, result => {
              if (result.code == 1 && App.globalData.shop==null) {
                App.globalData.shop = result.data.list[0]
                wx.setStorageSync('shop', result.data.list[0])
                that.setData({
                  shop: result.data.list[0]
                })
              }
            });
            wx.setStorageSync('city', res.data.result.address_component.city)
            that.setData({
              city: res.data.result.address_component.city
            })
            console.log(res.data.result);
          },
          fail: function () {
            // fail
            console.log("请求失败");
          },
          complete: function () {
            // complete
            console.log("请求完成");
          }
        })
      },
      fail: function () {
        // fail
        console.log("定位失败");
      },
      complete: function () {
        // complete
        console.log("定位完成");
      }
    })
  },

  goshoplist: function () {
    wx.navigateTo({
      url: '/pages/shop-list/shop-list?page=home',
    })
  },

  onShow:function(){
    this.setData({
      shop: wx.getStorageSync('shop'),
      city: wx.getStorageSync('city')
    })
    if (!wx.getStorageSync('shop')){
      this.getCityNameOFLocation()
    }
  }

  // /**
  //  * 返回顶部
  //  */
  // goTop: function(t) {
  //   this.setData({
  //     scrollTop: 0
  //   });
  // },

  // scroll: function(t) {
  //   this.setData({
  //     indexSearch: t.detail.scrollTop
  //   }), t.detail.scrollTop > 300 ? this.setData({
  //     floorstatus: !0
  //   }) : this.setData({
  //     floorstatus: !1
  //   });
  // },

});