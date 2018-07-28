const staticData = {
  yearsList: [{
    display: "不满2年",
    value: "0",
    checked: false
  }, {
    display: "满2年",
    value: "2",
    checked: false
  }, {
    display: "满5年",
    value: "5",
    checked: true
  }],
  areaList: [{
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
  }]
}
const calculateTax = input =>{
  return {
    taxForSellSide: calculateTaxForSellSide(input),
    taxForBuySide: calculateTaxForBuySide(input)
  }
}

const getIsGeneralResidential = (input)=>{
  if (input.isRelocate){
    return true
  }
  const areaMap = staticData.areaList.filter(it => it.id == input.areaId)[0]
  return input.sellPrice >= areaMap.minPrice && input.sellPrice <= areaMap.maxPrice
}

const calculateCommissionRate = (input)=>{
  return input.sellPrice * input.commissionRate/100
}

const calculateAddedValueTax = (input)=>{
  if(input.isRelocate){
    return 0;
  }
  if(input.isLessThan2Years){
    return input.sellPrice/1.05*0.05
  }else{
    return (input.sellPrice - input.buyPrice)/1.05*0.05
  }
}

const calculateIndividualIncomeTax = input =>{
  if (input.isMoreThan5Years && input.isOnlyHouse){
      return 0;
  }
  const isGeneralResidential = getIsGeneralResidential(input)
  if(isGeneralResidential){
    return input.sellPrice * 0.01
  }else{
    return input.sellPrice * 0.02
  }
}

const calculateDeedTax = input => {
  const isGeneralResidential = getIsGeneralResidential(input)
  var rate = 0;
  if(!isGeneralResidential&&input.size>140){
      rate = 3
  } else {
    if (input.isFirstBuy) {
      rate = input.size < 90 ? 1 : 1.5
    } else {
      rate = 3
    }
  } 
  return input.sellPrice * rate/100;
}
//[[{periodic,payment}],[{periodic,payment}]]
const calculateCost = (periodicCosts)=>{
  var periodicLength = maxPeriodic(periodicCosts.map(it=>it.length))
  var payment = [];
  for(var i = 0;i<periodicLength;i++){
    var currentPeriodicPayment = 0;
    periodicCosts.map(it=>{
      if(it[i]){
        currentPeriodicPayment += it[i].payment;
      }
    })
    payment.push({
      periodic:i,
      payment:currentPeriodicPayment
    })
  }
  return payment;
}

const pmt = (pv,rate,n)=>{
  const periodicPayment = pv*rate * Math.pow(1+rate,n)/(Math.pow(1+rate,n)-1)
  var residualPV = pv;
  var periodicDetail = [];
  for(var i = 0;i<n;i++){
    const interest = residualPV*rate
    const principal = periodicPayment - interest;
    
    residualPV = residualPV - principal;
    periodicDetail.push(({
      periodic:i,
      interest,
      principal,
      residualPV:residualPV,
      periodicPayment
    }))
  }
  return ({
    periodicPayment,
    periodicDetail
  })
}

const maxPeriodic = (arr)=>{
  var max = arr[0]
  for(var i = 1;i<arr.length;i++){
    if(max<arr[i]){
      max = arr[i]
    }
  }
  return max;
}

const sumPeriodicPayment = (arr,n)=>{
  var result = 0
  for(var i = 0;i<arr.length;i++){
    var item = arr[i];
    if(item.periodic>n){
      result = result + item.periodicPayment;
    }
  }
  return result
}

const calculateMonthLoansWithReserveFund = (currentReserveFund,monthlyReserveFund,loans)=>{
  const paymentDetail = [];
  const periodic = maxPeriodic(loans.map(it=>it.periodic));
  for(var i = 0;i<periodic;i++){
    currentReserveFund = currentReserveFund + monthlyReserveFund;
    var monthlyActualPayment = 0;
    var loanPayment = sumPeriodicPayment(loans,i);
    if(currentReserveFund>=loanPayment){
      monthlyActualPayment = 0;
      currentReserveFund = currentReserveFund - loanPayment;
    }else{
      monthlyActualPayment = loanPayment - currentReserveFund
      currentReserveFund = 0
    }      
    paymentDetail.push({
      monthlyActualPayment,
      periodic:i,
      currentReserveFund
    })
  }
  return paymentDetail
}


module.exports = {
  calculate: (input)=>({
    tax:[{
      value: calculateDeedTax(input),
      display: "契税(万)",
      order: 0
  }, {
      value: calculateAddedValueTax(input),
    display: "增值税(万)",
    order: 1
    }, {
      value: calculateIndividualIncomeTax(input),
      display: "个税(万)",
      order: 2
    }],
    isGeneralResidential: getIsGeneralResidential(input)
  }),
  staticData,
  pmt,
  calculateMonthLoansWithReserveFund,
  calculateCost
}