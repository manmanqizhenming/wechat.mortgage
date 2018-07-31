// pages/mortgage.js
const api = require('../../domain/mortgageCalculator.js')
const arrayUtil = require('../../utils/util.js').array
const state = require('../../domain/model.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    initState:state.initState
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.write(this.initState)
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  priceInput: function (e) {
    this.setData({
      size: e.detail.value,
    })
  },
  onYearsChange: function(e){
    var value = e.detail.value;
    var data = this.data.input;
    if(value == 0){
      data.isMoreThan2Years = false;
      data.isMoreThan5Years = false;
    }else if(value ==2){
      data.isMoreThan2Years = true;
      data.isMoreThan5Years = false;
    }else{
      data.isMoreThan2Years = true;
      data.isMoreThan5Years = true;
    }
    this.setData({
      input: data
    });
  },
  getInput: function(e){
    var field = e.currentTarget.dataset.field;
    var data = this.data.input;
    data[field] = e.detail.value;
    if (field == "sellPrice") {
      data.averageSellPrice = data.sellPrice / data.size
    }
    this.setData({ input: data });
    const result = api.calculate(this.data.input)
    this.setData({
      result: result
    });
  }
})