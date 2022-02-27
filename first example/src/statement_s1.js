// Stage1 xxx (step by step)
    // Step num. xxx [Rule]
    //    - num.1 xxx
    //    - num.2 xxx
// Stage2 xxx
    // ...

// Stage1 分解statement函数
function statement(invoice, plays) {
    // Step 1. 分离出switch语句，提炼函数amountFor（106）
  function amountFor(aPerformence) {
    // Step 2. 函数参数和内部变量改名
    //    - 2.1 perf改为aPerformance（参数取名时都默认带上其类型名，不定冠词a/an修饰）
    //    - 2.2 thisAmount -> result
    let result = 0;
    //    - 3.3 在函数amountFor内部使用新的函数playFor
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

  function playFor(aPerformence) {
    return plays[aPerformence.playID];
  }

  //   Step 4. 提取函数volumeCreditsFor（106）:包含volumeCredits计算逻辑，volumeCredits作为返回值
  function volumeCreditsFor(perf) {
    let result = 0;
    result += Math.max(perf.audience - 30, 0);
    if ("comedy" === playFor(perf).type) result += Math.floor(perf.audience / 5);
    return result;
  }

  //   Step 5. 移除format变量
  function usd(aNumber) {
    return new Intl.NumberFormat("en-US",
      {
        style: "currency", currency: "USD",
        minimumFractionDigits: 2
      }).format(aNumber / 100);
  }

  //   Step 6. 移除volumeCredits
  //      - 6.3 提炼函数totalVolumeCredits（106）
  function totalVolumeCredits() {
    //    - 6.2 移动语句（223），将累加变量的声明与累加过程集中
    let result = 0;
    //    - 6.1 拆分循环（227），分离累加过程
    for (let perf of invoice.performances) {
      result += volumeCreditsFor(perf);
    }
    return result;
  }

  //    Step 7. 移除totalAmount，参照Step6
  function totalAmount() {
    let result = 0;
    for (let perf of invoice.performances) {
      result += amountFor(perf);
    }
    return result;
  }    

  let result = `Statement for ${invoice.customer}\n`;
  for (let perf of invoice.performances) {
    // Step 3. 移除变量play
    //    - 3.1 以查询取代临时变量（178）
    //    - 3.2 使用内联变量（123）手法内联playFor函数，`const play = playFor(perf)`
    //    - 3.3 使用内联变量（123）手法内联amountFor函数，`let thisAmount = amountFor(perf)`
    // print line for this order
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`;
  }
  result += `Amount owed is ${usd(totalAmount())}\n`;
    //    - 6.4 使用内联变量（123）手法内联totalVolumeCredits函数，`volumeCredits = totalVolumeCredits()`
  result += `You earned ${totalVolumeCredits()} credits\n`;
  return result;
}

module.exports = {
  statement
}
