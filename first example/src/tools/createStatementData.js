export default function createStatementData(invoice, plays) {
  const result = {};
  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformances);
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredits = totalVolumeCredits(result);
  return result;

  //  - 2.2 创建performanceCalculator类，通过这个类调用函数
  function enrichPerformances(aPerformance) {
    const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance)); 
    let result = Object.assign({}, aPerformance);
    result.play = calculator.play;
    // result.amount = amountFor(result);
    result.amount = calculator.amount;
    // result.volumeCredits = volumeCreditsFor(result);
    result.volumeCredits = calculator.volumeCredits;
    return result;
  }

  function totalVolumeCredits(data) {
    return data.performances.reduce((acc, perf) => acc + perf.volumeCredits, 0);
  }

  function totalAmount(data) {
    return data.performances.reduce((acc, perf) => acc + perf.amount, 0);
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  //  - 2.3 把amountFor、volumeCreditsFor函数移动到PerformanceCalculator类中，委托amountFor、volumeCreditsFor函数，让它直接调用类中的get方法

  // function amountFor(aPerformance) {
  //   return new PerformanceCalculator(aPerformance, playFor(aPerformance)).amount;
  // }

  // function volumeCreditsFor(aPerformance) {
  //   return new PerformanceCalculator(aPerformance, playFor(aPerformance)).volumeCredits;
  // }
}

  //  - 2.4 多态化
  //  - 2.4.1 子类取代类型码（362）
// function createPerformanceCalculator(aPerformance, aPlay) {
//   return new PerformanceCalculator(aPerformance, aPlay);
// }

//    - 2.4.2 工厂函数取代构造函数（334）
function createPerformanceCalculator(aPerformance, aPlay) {
  switch (aPlay.type) {
    case "tragedy":
      return new TragedyCalculator(aPerformance, aPlay);
    case "comedy":
      return new ComedyCalculator(aPerformance, aPlay);
    default:
      throw new Error(`unknown type: ${aPlay.type}`);
  }
}

class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  get amount(){
    throw new Error(`can not get amount(type:${this.play.type}) from parent class`)
  }

  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}
class ComedyCalculator extends PerformanceCalculator { 
  get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }

  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}

