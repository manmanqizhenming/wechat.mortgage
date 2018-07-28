// pages/mortgage.js
const api = require('../../domain/mortgageCalculator.js')
const arrayUtil = require('../../utils/util.js').array
Page({

  /**
   * 页面的初始数据
   */
  data: {
    input: {
      size: 89,
      sellPrice:400,
      buyPrice: 50,
      isFirstBuy:true,
      isMoreThan5Years:true,
      isMoreThan2Years:true,
      isOnlyHouse:true,
      isNormalHouse:true,
      serviceCommissionRate:2,
      isRelocated:false,
      averageSellPrice: 400/89,
      areaId: 3,
      downPaymentRate: 35,
      downPaymentAmout:0,
      currentReserveFund:20,
      monthlyReserveFund:0.66,
      deposits:93,
      decorationCost:15,
      otherCost:0.5,
      borrow:100,
      loans:{
        housingProvidentFund: {
          id: 0,
        name:"公积金贷",
        size:110,
        rate:3.25,
        age:20,
        discount: 1,
        }, tax: {
          id: 0,
          name:"税贷",
          size: 20,
          rate: 3.25,
          age: 5,
          discount: 1,
        }, commercial: {
          id: 0,
          name:"商贷",
          size: 160,
          rate: 4.9,
          age: 30,
          discount: 0.95,
        }, borrow: {
          id: 0,
          name: "借款",
          size: 80,
          rate: 1,
          age: 3,
          discount: 1,
        }
      },
    }, 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const staticData = api.staticData
    this.setData({ staticData})
    this.setData({
      result: api.calculate(this.data.input)
    });

    const input = this.data.input;
    const loans = input.loans;
    const arr = [loans.housingProvidentFund, loans.tax, loans.commercial, loans.borrow];
    arr.map(it=>{
      it.getPmtDetail = ()=>{
        var periodicRate = it.rate*it.discount/100/12
        var n = it.age*12
        return api.pmt(it.size,periodicRate,n)
      }
    });
    arr.map(it=>it.pmtDetail = it.getPmtDetail());
    this.setData({input:input})
    var mortageLoan = [{
      periodicPayment:loans.housingProvidentFund.pmtDetail.periodicPayment,
      periodic:loans.housingProvidentFund.age*12
    },{
      periodicPayment:loans.commercial.pmtDetail.periodicPayment,
      periodic:loans.commercial.age*12
    }]
    input.actualMortgagePayment = api.calculateMonthLoansWithReserveFund(input.currentReserveFund,input.monthlyReserveFund,mortageLoan)
    console.log(input.actualMortgagePayment)
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