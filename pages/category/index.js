const App = getApp();
// 枚举类：发货方式
import DeliveryTypeEnum from '../../utils/enum/DeliveryType.js';
// 工具类
import Util from '../../utils/util.js';
Page({
  data: {
    type:'取餐',
    count: 0,
    cartTotalPrice: 0,
    DeliveryTypeEnum,
    // 列表高度
    scrollHeight: 0,

    // 一级分类：指针
    curNav: true,
    curIndex: 0,

    // 分类列表
    list: [],

    // show
    notcont: false,
    shop: wx.getStorageSync('shop')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(options) {
    console.log(options.type)
    if(options.type){
      if (options.type == DeliveryTypeEnum.EXPRESS.value){
          this.setData({
            type: DeliveryTypeEnum.EXPRESS.name
          })
      }else{
        this.setData({
          type: DeliveryTypeEnum.EXTRACT.name
        })
      }
      wx.setStorageSync('type', options.type)
    }
    let _this = this;
    // 设置分类列表高度
    _this.setListHeight();
    // 获取分类列表
    _this.getCategoryList();

    _this.getCartList();
  },

  onShow:function(){
    this.setData({
      shop: wx.getStorageSync('shop')
    })
  },

  /**
   * 获取购物车列表
   */
  getCartList() {
    let _this = this;
    App._get('cart/lists', {}, result => {
      console.log('res', result.data)
      _this._initGoodsChecked(result.data);
    });
  },

  _initGoodsChecked(data) {
    let _this = this;
    _this.setData({
      goods_list: data.goods_list,
      order_total_price: data.order_total_price,
      action: 'complete',
      count:data.goods_list.length
    });
    // 更新购物车已选商品总价格
    _this.updateTotalPrice();
  },

  /**
 * 更新购物车已选商品总价格
 */
  updateTotalPrice() {
    let _this = this;
    let cartTotalPrice = 0;
    _this.data.goods_list.forEach(item => {
        cartTotalPrice = _this.mathadd(cartTotalPrice, item.total_price);
    });
    _this.setData({
      cartTotalPrice: Number(cartTotalPrice).toFixed(2)
    });
  },

  /**
   * 加法
   */
  mathadd(arg1, arg2) {
    return (Number(arg1) + Number(arg2)).toFixed(2);
  },

  goCart:function(){
    wx.navigateTo({
      url: '../flow/index',
    })
  },

  add:function(e){
    console.log(e.currentTarget.dataset.goods_sku_id)
    let that=this;
    App._post_form('cart/add', {
      goods_id: e.currentTarget.dataset.goods_id,
      goods_num: 1,
      goods_sku_id: 0,
    }, (result) => {
      that.getCartList();
      App.showSuccess(result.msg);
      that.setData(result.data);
    });
  },

  /**
   * 设置分类列表高度
   */
  setListHeight() {
    let _this = this;
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          scrollHeight: res.windowHeight - 47,
        });
      }
    });
  },

  /**
   * 获取分类列表
   */
  getCategoryList() {
    let _this = this;
    App._get('category/getCategory', {}, result => {
      let data = result.data;
      _this.setData({
        list: data.categories,
      });
    });
  },

  /**
   * 一级分类：选中分类
   */
  selectNav(e) {
    let _this = this;
    _this.setData({
      curNav: e.target.dataset.id,
      curIndex: parseInt(e.target.dataset.index),
      scrollTop: 0
    });
  },

  /**
   * 设置分享内容
   */
  onShareAppMessage() {
    let _this = this;
    return {
      title: _this.data.templet.share_title,
      path: '/pages/category/index?' + App.getShareUrlParams()
    };
  }

});