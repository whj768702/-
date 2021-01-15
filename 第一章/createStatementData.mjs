class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performances = aPerformance;
    this.play = aPlay;
  }
  get amount() {
    let result = 0;
    switch (this.play.type) {
      case 'tragedy':
        result = 40000;
        if (this.performances.audience > 30) {
          result += 1000 * (this.performances.audience - 30);
        }
        break;
      case 'comedy':
        result = 30000;
        if (this.performances.audience > 20) {
          result += 10000 + 500 * (this.performances.audience - 20);
        }
        result += 300 * this.performances.audience;
        break;
      default:
        throw new Error(`unknown type: ${this.play.type}`);
    }
    return result;
  }
  get volumeCredits() {
    let volumeCredits = 0;
    volumeCredits += Math.max(this.performances.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ('comedy' === this.play.type) volumeCredits += Math.floor(this.performances.audience / 5);
    return volumeCredits;
  }
}

function createStatementData(invoice, plays) {
  const result = {
    customer: invoice.customer,
    performances: invoice.performances.map(enrichPerformance),
  };
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredits = totalVolumeCredits(result);
  return result;

  function enrichPerformance(aPerformance) {
    const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance));
    const result = Object.assign({}, aPerformance);
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    // result.amount = amountFor(result);
    // result.volumeCredits = volumeCreditsFor(result);
    return result;
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  function amountFor(aPerformance) {
    return new PerformanceCalculator(aPerformance, playFor(aPerformance)).amount;
  }

  function volumeCreditsFor(aPerformance) {
    return new PerformanceCalculator(aPerformance, playFor(aPerformance)).volumeCredits;
    // let volumeCredits = 0;
    // volumeCredits += Math.max(aPerformance.audience - 30, 0);
    // // add extra credit for every ten comedy attendees
    // if ('comedy' === aPerformance.play.type) volumeCredits += Math.floor(aPerformance.audience / 5);
    // return volumeCredits;
  }

  function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }

  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }
}

export default createStatementData;
