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
};
