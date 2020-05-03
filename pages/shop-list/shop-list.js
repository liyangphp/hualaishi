// pages/shop-list/shop-list.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shoplist: null,
    limit:9,
    pages:1,
    keyword:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.page) {
      this.setData({
        page: options.page
      })
    }
    this.getCityNameOFLocation();
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
            "key": "YLFBZ-WHAWI-ZXUGH-53Q65-TOJ7E-ADBNQ",
            "location": locationString
          },
          method: 'GET',
          // header: {}, 
          success: function (res) {
            that.setData({
              longitude: res.data.result.location.lng,
              latitude: res.data.result.location.lat
            })
            App._get('shop/lists', {
              longitude: res.data.result.location.lng,
              latitude: res.data.result.location.lat,
              keyword: that.data.keyword,
              limit:that.data.limit,
              page:that.data.pages
            }, result => {
              console.log(result)
              if (result.code == 1) {
                that.setData({
                  shoplist: result.data.list
                })
              }
            });
            console.log("请求成功");
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

  /**
 * 选择搜索推荐中的商品
 */
  gosearch: function (e) {
    var that = this;
    console.log(e);
    if (e.detail.value.trim()) {
      var flag = true;
      that.setData({
        keyword: e.detail.value
      })
      App._get('shop/lists', {
        longitude: that.data.longitude,
        latitude: that.data.latitude,
        keyword: e.detail.value.trim(),
        limit: that.data.limit,
        page: that.data.pages
      }, result => {
        console.log(result)
        if (result.code == 1) {
          that.setData({
            shoplist: result.data.list
          })
        }
      });
    } else {
      wx.showToast({
        title: '请输入有效的关键字',
        icon: 'none'
      })
    }
  },

  formSubmit: function (e) {
    var that = this;
    if (e.detail.value.keyword.trim()) {
      var flag = true;
      that.setData({
        keyword: e.detail.value.keyword
      })

      App._get('shop/lists', {
        longitude: that.data.longitude,
        latitude: that.data.latitude,
        keyword: e.detail.value.trim(),
        limit: that.data.limit,
        page: that.data.pages
      }, result => {
        console.log(result)
        if (result.code == 1) {
          that.setData({
            shoplist: result.data.list
          })
        }
      });
    } else {
      wx.showToast({
        title: '请输入有效的关键字',
        icon: 'none'
      })
    }
  },

  setDefaultShop: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    for (var i = 0; i < that.data.shoplist.length; i++) {
      if (that.data.shoplist[i].shop_id == id) {
        wx.setStorageSync('shop', that.data.shoplist[i])
        App.globalData.shop = that.data.shoplist[i];
        if(that.data.page=='home'){
          wx.switchTab({
            url: '/pages/index/index',
          })
        }else{
          let _this = this,
          selectedId = e.currentTarget.dataset.id;
          // 设置上级页面的门店id
          let pages = getCurrentPages();
          if (pages.length < 2) {
            return false;
          }
          let prevPage = pages[pages.length - 2];
          prevPage.setData({
            selectedShopId: selectedId,
            flag:true,
          });
          // 返回上级页面
          wx.navigateBack({
            delta: 1
          });
        }
      }
    }
  },

  initData: function () {
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    App._get('shop/lists', {
      longitude: that.data.longitude,
      latitude: that.data.latitude,
      keyword: that.data.keyword,
      limit: that.data.limit,
      page: that.data.pages
    }, result => {
      console.log(result)
      if (result.code == 1) {
        if (that.data.page==1||that.data.shoplist.length==0){
          that.setData({
            shoplist: result.data.list
          })
        }else{
          that.setData({
            shoplist: that.data.shoplist.concat(result.data.list)
          })
        }
      }
      wx.hideLoading();
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      pages:1
    })
    that.initData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that =this;
    that.setData({
      pages:that.data.pages+1
    })
    that.initData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})