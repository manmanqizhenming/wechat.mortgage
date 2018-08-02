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
    display: "不满2",
    value: "0",
  }, {
    display: "满2",
    value: "2",
  }, {
    display: "满5",
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
    age:5,
    isNormalHouse:true,
    serviceCommissionAmount:0,
    averageSellPrice: 0,
    downPaymentAmout:0,
    normalHouseMapId:3,
    maxReservedFundLoanAmount:110,
    reservedFundLoanInterestRate:3.25,
    reservedFundLoanAge:20,
    commercialLoanInterestRate:4.9,
    commercialLoanInterestRateDiscount:0.95,
    commercialLoanAge:30,
}

module.exports = {
  state:initState,
  normalHouseMap,
  ageMap
}