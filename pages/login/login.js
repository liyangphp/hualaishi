const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    _this.setData({
      options
    });
  },

  /**
   * 授权登录
   */
  getUserInfo(e) {
    let _this = this;
    App.getUserInfo(e, () => {
      // 跳转回原页面
      _this.onNavigateBack(1);
    });
  },

  /**
   * 暂不登录
   */
  onNotLogin() {
    let _this = this;
    // 跳转回原页面
    _this.onNavigateBack(_this.data.options.delta);
  },

  /**
   * 订阅消息
   */
  onGetMessage(){
    wx.requestSubscribeMessage({
      tmplIds: ["JycafLNiz73YHjCP0qNmxUehjLkcjBKBhCQ1ZvYVRRs"],
      success: (res) => {
        if (res['JycafLNiz73YHjCP0qNmxUehjLkcjBKBhCQ1ZvYVRRs'] === 'accept') {
          wx.showToast({
            title: '订阅OK！',
            duration: 1000,
            success(data) {
              //成功
              console.log(data)
            }
          })
        }
      },
      fail(err) {
        //失败
        console.error(err);
      }
    })
  },

  /**
   * 授权成功 跳转回原页面
   */
  onNavigateBack(delta) {
    wx.showModal({
      title: '提示',
      content: '请点击授权获取订阅信息',
      success(res) {
        if (res.confirm) {
          wx.requestSubscribeMessage({
            tmplIds: ["0EUr8UE8S2Kwa6puD-D95lkvut5_qG5cfWOfwX8bRq8","JycafLNiz73YHjCP0qNmxTMSemts7F2XASFf7V-OqBg"],
            success: (res) => {
              wx.navigateBack({
                delta: Number(delta || 1)
              });
            },
            fail(err) {
              //失败
              console.error(err);
              wx.navigateBack({
                delta: Number(delta || 1)
              });
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })


  },

})