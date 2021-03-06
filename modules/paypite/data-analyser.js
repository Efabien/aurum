const moment = require('moment');

module.exports = class DataAnalyser {
  constructor() {

  }

  getTodaySells(data) {
    const todayStarting = moment().startOf('day').unix();
    return data.filter(item => {
      return moment(item.createdAt).unix() > todayStarting;
    });
  }

  getQuantAndValueOfSells(data) {
    const quantity = data.reduce((total, item) => {
      return total += item.amount;
    }, 0);
    const fiatAmount = data.reduce((total, item) => {
      let toTake = 0;
      if (item.meta && item.meta.currentRate) {
        toTake = item.meta.currentRate * item.amount;
      } else if (item.meta && item.meta.sellPrice) {
        toTake = (item.meta.sellPrice.unit || 0) * item.amount;
      }
      return total += toTake;
    }, 0);
    return [quantity, fiatAmount];
  }

  getMarketEvolutionOn2Rows(row1, row2) {
    const [quantity1] = this.getQuantAndValueOfSells(row1);
    const [quantity2] = this.getQuantAndValueOfSells(row2);
    const direction = (quantity2 - quantity1) < 0 ? '-' : '+';
    const diff = (quantity2 - quantity1) > 0 ? (quantity2 - quantity1) : (quantity1 - quantity2);
    return direction + ' ' + ( diff / quantity1 * 100).toFixed(2) + '%';
  }

  sellsPerday(data) {
    return this._splitData(data, 'DD/MM/YYYY');
  }

  sellsPerHour(data) {
    return data.map(row => {
      return this._splitData(row, 'H');
    });
  }

  weekAnalyse(history) {
    const perDay = this.sellsPerday(history);
    const lastDays = perDay.slice(0, 7);
    return lastDays.map(day => {
      return this.dayAnalyse(day);
    });
  }

  dayAnalyse(data) {
    data = data.map(item => {
      item.meta.rate = item.meta.currentRate || item.meta.sellPrice.unit;
      return item;
    });
    const opening = data[data.length - 1].meta.rate;
    const closing = data[0].meta.rate;
    const rates = data.map(item => item.meta.rate);
    const low = Math.min(...rates);
    const hight = Math.max(...rates); 
    const [quantity, fiatAmount] = this.getQuantAndValueOfSells(data);
    return { opening, closing, low, hight, quantity, fiatAmount, date: data[0].createdAt };
  }

  _splitData(data, format) {
    return data.reduce((accumulator, item) => {
      const currentDateTag = moment(item.createdAt).format(format);
      const previusDateTag = !accumulator.length ?
        '0' :
        moment(accumulator[accumulator.length - 1][0].createdAt).format(format);
      if (previusDateTag !== currentDateTag){
        accumulator.push([item]);
        return accumulator;
      }
      accumulator[accumulator.length - 1].push(item);
      return accumulator;
    }, []);
  }
};
