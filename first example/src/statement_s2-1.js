// 一、xxx (step by step)
// Step num. xxx [Rule]
//    - num.1 xxx
//    - num.2 xxx
// 二、xxx
// ...

// Stage2 拆分计算阶段和格式化阶段
// Step 1. 拆分计算阶段 
// Step 2. 格式化阶段

  //  - 1.1 拆分阶段：提炼函数statement和renderPlainText
function statement(invoice, plays) {
  //  - 1.2 数据中转对象 statementData，将customer、performances添加到中转对象中
  const statementData = {};
  statementData.customer = invoice.customer;
  //  - 1.4 返回aPerformance对象的副本，用来添加新的数据，而不去修改传递进来的参数，尽量保持数据不可变（immutable）
  statementData.performances = invoice.performances.map(enrichPerformances);

  //  - 1.5 将totalAmount和totalVolumeCredits函数搬移到statement下
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData)

  //  - 1.3 移除renderPlainText形参中的invoice, 将invoice下的customer、performances通过data参数带进来
  return renderPlainText(statementData, plays);

  //  - 1.4 将playFor、amountFor、volumeCreditsFor函数搬移到erichPerformances函数
  function enrichPerformances(aPerformance) {
    let result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  }

  function totalVolumeCredits(data) {
    return data.performances.reduce((acc, perf) => acc + perf.volumeCredits, 0);
  }

  function totalAmount(data) {
    return data.performances.reduce((acc, perf) => acc + perf.amount, 0);
  }

  function playFor(aPerformence) {
    return plays[aPerformence.playID];
  }

  function amountFor(aPerformence) {
    let result = 0;
    switch (playFor(aPerformence).type) {
      case "tragedy":
        result = 40000;
        if (aPerformence.audience > 30) {
          result += 1000 * (aPerformence.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (aPerformence.audience > 20) {
          result += 10000 + 500 * (aPerformence.audience - 20);
        }
        result += 300 * aPerformence.audience;
        break;
      default:
        throw new Error(`unknown type: ${playFor(aPerformence).type}`);
    }
    return result;
  }

  function volumeCreditsFor(perf) {
    let result = 0;
    result += Math.max(perf.audience - 30, 0);
    if ("comedy" === playFor(perf).type) result += Math.floor(perf.audience / 5);
    return result;
  }
}

function renderPlainText(data, plays) {
  let result = `Statement for ${data.customer}\n`;
  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
  }
  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;
  return result;

  function usd(aNumber) {
    return new Intl.NumberFormat("en-US",
      {
        style: "currency", currency: "USD",
        minimumFractionDigits: 2
      }).format(aNumber / 100);
  }
}

module.exports = {
  statement
}
