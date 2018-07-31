const normalHouseMap = [{
      id: 1,
      display: "内环",
      minPrice: 140,
      maxPrice: 450
    }, {
      id: 2,
      display: "中环",
      minPrice: 140,
      maxPrice: 310,
    }, {
      id: 3,
      display: "外环",
      minPrice: 140,
      maxPrice: 230
    }];

const ageMap =  [{
    display: "不满2年",
    value: "0",
  }, {
    display: "满2年",
    value: "2",
  }, {
    id:2,
    display: "满5年",
    value: "5",
  }]

const initState = {
    //input
    size: 89,
    sellPrice:400,
    buyPrice: 50,
    isFirstBuy:true,
    isMoreThan5Years:true,
    isMoreThan2Years:true,
    serviceCommissionRate:2,
    isRelocated:false,
    isOnlyHouse:true,
    downPaymentRate: 35,
    //calculate result
    isNormalHouse:true,
    serviceCommissionAmount:0,
    averageSellPrice: 0,
    areaId: 3,
    downPaymentAmout:0,
    //currentReserveFund:20,
    //monthlyReserveFund:0.66,
    //deposits:93,
    //decorationCost:15,
    //otherCost:0.5,
    //borrow:100,
    loans:{
      housingProvidentFund: {
        id: 0,
      name:"公积金贷",
      size:0,
      rate:3.25,
      age:20,
      discount: 1,
      }, commercial: {
        id: 1,
        name:"商贷",
        size: 0,
        rate: 4.9,
        age: 30,
        discount: 0.95,
      }
    },
}

module.exports = {
  initState,
  normalHouseMap,
  ageMap
}