// pages/shop-goods/shop-goods.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 砍价会场商品列表
    activeList: [],
    scrollTop: 0,
    page: 1, // 当前页码
    goodsPage:1,
    recommendList:[],
    currentTab:0,
    pagej:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
 * 跳转到砍价商品详情
 */
  onTargetActive(e) {
    // 保存formid
    App.saveFormId(e.detail.formId);
    wx.navigateTo({
      url: `../bargain/goods/index?active_id=${e.detail.target.dataset.id}`,
    })
  },

  /**
   * 跳转到砍价任务详情
   */
  onTargetTask(e) {
    // 保存formid
    App.saveFormId(e.detail.formId);
    wx.navigateTo({
      url: `../bargain/task/index?task_id=${e.detail.target.dataset.id}`,
    })
  },

  /**
 * 下拉到底部加载下一页
 */
  onScrollToLower() {
    let _this = this,
      listData =_this.data.activeList;
    // 已经是最后一页
    if (_this.data.page >= listData.last_page) {
      _this.setData({
        noMore: true
      });
      return false;
    }
    // 加载下一页列表
    _this.setData({
      page: ++_this.data.page
    });
    _this._getList(true);
  },

  onScrollToUp(){
    this.setData({
      page:1
    })
    this._getList();
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
    let _this = this;
    _this.getFineGoods()
    if (_this.data.scrollTop == 0) {
      // 获取列表数据
      _this._getList();
    }
  },

  /**
 * 获取砍价活动列表
 */
  getActiveList(isPage) {
    let _this = this;
    App._get('bargain.active/lists', {
      page: _this.data.page || 1,
    }, (result) => {
      console.log('res',result);
      let resList = result.data.activeList,
        dataList = _this.data.activeList;
      if (isPage == true) {
        _this.setData({
          'activeList.data': dataList.data.concat(resList.data),
          isLoading: false,
        });
      } else {
        _this.setData({
          activeList: resList,
          isLoading: false,
        });
      }
    });
  },

  /**
 * 获取列表数据
 */
  _getList(isPage) {
    let _this = this;
    _this.getActiveList(isPage);
  },

  /**
   * 获取精品商品
   */
  getFineGoods:function(){
    let _this = this;
    App._get('goods/lists', {
      'category_id':10003,
      'page':_this.data.pagej
    }, (result) => {
      console.log(result)
      if(result.code==1){
        if (_this.data.pagej == 1 || _this.data.recommendList.length==0){
          _this.setData({
            recommendList: result.data.list.data
          })
        }else{
          _this.setData({
            recommendList: _this.data.recommendList.concat(result.data.list.data)
          })
        }
      }
    })
  },

  bindDownIt:function(){
    let that=this;
    that.setData({
      pagej: that.data.pagej+1
    })

    that.getFineGoods();
  },

  bindUpIt:function(){
    let that = this;
    that.setData({
      pagej: 1
    })

    that.getFineGoods();
  },

  add: function (e) {
    console.log(e.currentTarget.dataset.goods_sku_id)
    let that = this;
    App._post_form('cart/add', {
      goods_id: e.currentTarget.dataset.goods_id,
      goods_num: 1,
      goods_sku_id: 0,
    }, (result) => {
      App.showSuccess(result.msg);
    });
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    let _this = this;
    // 构建页面参数
    let params = App.getShareUrlParams();
    return {
      title: '商城',
      path: `/pages/shop-goods/shop-goods?${params}`
    };
  },
})