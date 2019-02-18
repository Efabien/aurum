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

  sellsPerday(data) {
    return data.reduce((accumulator, item) => {
      const currentDateTag = moment(item.createdAt).format('DD/MM/YYYY');
      const previusDateTag = !accumulator.length ?
        '0' :
        moment(accumulator[accumulator.length - 1][0].createdAt).format('DD/MM/YYYY');
      if (previusDateTag !== currentDateTag){
        accumulator.push([item]);
        return accumulator;
      }
      accumulator[accumulator.length - 1].push(item);
      return accumulator;
    }, []);
  }
};
