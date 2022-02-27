// 一、xxx (step by step)
// Step num. xxx [Rule]
//    - num.1 xxx
//    - num.2 xxx
// 二、xxx
// ...

// Stage2 拆分计算阶段和格式化阶段
// Step 1. 拆分计算阶段
// Step 2. 格式化阶段

import createStatementData from "./tools/createStatementData.js";

function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data, plays) {
  let result = `Statement for ${data.customer}\n`;
  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
  }
  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;
  return result;
}

function htmlStatement(invoice, plays){
  return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(data) {
  let result = `<h1>Statement for ${data.customer}</h1>\n`;
  result += "<table>\n";
  result += "<tr><th>play</th><th>seats</th><th>cost</th></tr>";
  for (let perf of data.performances) {
    result += ` <tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
    result += `<td>${usd(perf.amount)}</td></tr>\n`;
  }
  result += "</table>\n";
  result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`;
  result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;
  return result;
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US",
    {
      style: "currency", currency: "USD",
      minimumFractionDigits: 2
    }).format(aNumber / 100);
}

//  - 2.1 提炼出新的函数createStatementData，并分离到createStatementData.js文件中
/* function createStatementData(invoice, plays){
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformances);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  return statementData;

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
} */

export { statement, htmlStatement };

