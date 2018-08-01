const {normalHouseMap} = require('./data');

 const getIsGeneralResidential = (isRelocate,sellPrice,normalHouseId)=>{
   if(isRelocate){
     return true;
   }
   const map = normalHouseMap.filter(it=>it.id==normalHouseId)[0];
   return sellPrice >= map.minPrice && sellPrice <= map.maxPrice;
 }

const calculateAddedValueTax = ({isRelocated,age,sellPrice,buyPrice})=>{
  if(isRelocated){
    return 0;
  }
  if(age==0){
    return sellPrice/1.05*0.05
  }else{
    return (sellPrice - buyPrice)/1.05*0.05
  }
}

const calculateIndividualIncomeTax = ({age,isOnlyHouse,isGeneralResidential,sellPrice}) =>{
  if(isOnlyHouse&&age==5){
    return 0;
  }
  if(isGeneralResidential){
    return sellPrice * 0.01
  }else{
    return sellPrice * 0.02
  }
}

const calculateDeedTax = ({size,isGeneralResidential,isFirstBuy,sellPrice}) => {
  var rate = 0;
  if(!isGeneralResidential&&size>140){
      rate = 3
  } else {
    if (isFirstBuy) {
      rate = size < 90 ? 1 : 1.5
    } else {
      rate = 3
    }
  } 
  return sellPrice * rate/100;
}

const pmt = (pv,rate,n)=>{
  const periodicPayment =pv*rate * Math.pow(1+rate,n)/(Math.pow(1+rate,n)-1);
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
    periodicPayment:format(periodicPayment,4),
    periodicDetail
  })
}

const format = (number,n)=>Math.round(number * Math.pow(10,n))/Math.pow(10,n)

const calculate =state=>{
  var result = ({})
  result.isGeneralResidential = getIsGeneralResidential(state.isRelocated,state.sellPrice,state.normalHouseMapId);
  result.deedTax = format(calculateDeedTax({...state,isGeneralResidential:result.isGeneralResidential}),4);
  result.addedValueTax = format(calculateAddedValueTax(({...state,isGeneralResidential:result.isGeneralResidential})),4);
  result.individualIncomeTax = format(calculateIndividualIncomeTax(state),4);
  result.sumTax = result.deedTax+result.addedValueTax+result.individualIncomeTax;
  result.serviceCommissionAmout = state.sellPrice * state.serviceCommissionRate/100;
  result.downPaymentAmout = state.sellPrice * state.downPaymentRate/100;
  result.loanAmount  = state.sellPrice - result.downPaymentAmout;
  if(result.loanAmount>=state.reservedFundLoanAmount){
    const commercialLoanAmount = result.loanAmount - state.reservedFundLoanAmount
    result.commercialLoanAmount = commercialLoanAmount
    result.reservedFundLoanPMT = pmt(state.reservedFundLoanAmount,state.reservedFundLoanInterestRate/100/12,state.reservedFundLoanAge*12);
    result.commercialLoanLoanPMT = pmt(commercialLoanAmount,state.commercialLoanInterestRate * state.commercialLoanInterestRateDiscount/100/12,state.commercialLoanAge*12);
  }else{
    result.commercialLoanAmount = 0;
    result.reservedFundLoanAmount = result.loanAmount;
    result.reservedFundLoanPMT = pmt(result.loanAmount,state.reservedFundLoanInterestRate/100/12,state.reservedFundLoanAge*12);
    result.commercialLoanLoanPMT = pmt(0,state.commercialLoanInterestRate * state.commercialLoanInterestRateDiscount/100/12,state.commercialLoanAge*12);
  }
  result.averageSellPrice = format(state.sellPrice/state.size,4);
  result.sumPeriodicPayment = format(result.commercialLoanLoanPMT.periodicPayment +  result.reservedFundLoanPMT.periodicPayment,4);
  return result;
}


module.exports = {
  calculate
}