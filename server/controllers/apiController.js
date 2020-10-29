const apiController = {};
const fetch = require('node-fetch');
const db = require('../models.js')

apiController.getWeatherData = async (req, res, next) => {
  const { lat, lng } = req.body;

  let start = new Date().toISOString().replace(':', '%3A').replace(':', '%3A').split('.');
  start[1] = '%2B00%3A00';
  start = start.join('');
  res.locals.start = start;

  let end = new Date();
  end.setMinutes(end.getMinutes() + 1);
  end = end.toISOString().replace(':', '%3A').replace(':', '%3A').split('.');
  end[1] = '%2B00%3A00';
  end = end.join('');
  res.locals.end = end;

  const weatherParams = 'swellHeight,waterTemperature,windDirection';
  const apiKey = '945e95b2-19a0-11eb-b3db-0242ac130002-945e9698-19a0-11eb-b3db-0242ac130002';
  const apiUrl = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${weatherParams}&start=${start}&end=${end}`;
  const configObj = {
    headers: {
      Authorization: apiKey,
    },
  };

  try {
    await fetch(apiUrl, configObj)
      .then((res) => res.json())
      .then((data) => {
        const getAvg = (dataObj) => {
          let values = Object.values(dataObj);
          let avg = values.reduce((acc, cur) => acc + cur) / values.length;
          return avg.toFixed(2);
        };

        const surfConditions = {
          swellHeight: getAvg(data.hours[0].swellHeight) * 3.28,
          waterTemperature: (getAvg(data.hours[0].waterTemperature) * 9) / 5 + 32,
          windDirection: getAvg(data.hours[0].windDirection) * 1,
        };
        res.locals.surfConditions = surfConditions;
        return next();
      });
  } catch (err) {
    return next(err);
  }
};

apiController.getTideData = async (req, res, next) => {
  const { lat, lng } = req.body;

  const apiKey = '945e95b2-19a0-11eb-b3db-0242ac130002-945e9698-19a0-11eb-b3db-0242ac130002';
  const apiUrl = `https://api.stormglass.io/v2/tide/extremes/point?lat=${lat}&lng=${lng}&start=${res.locals.start}&end=${res.locals.end}`;
  const configObj = {
    headers: {
      Authorization: apiKey,
    },
  };

  try {
    await fetch(apiUrl, configObj)
      .then((res) => res.json())
      .then((data) => {
        res.locals.surfConditions.tide = data.data[0].type;
        return next();
      });
  } catch (err) {
    return next(err);
  }
};

apiController.addFavLocation = async (req, res, next) => {
  const { userId, location } = req.body;

  const postConfig = {
    text: 'INSERT INTO user_favorites (userId, location) VALUES ($1, $2) RETURNING *;',
    values: [userId, location],
  };

  try {
    await db.query(postConfig, (err, res) => {
      console.log('added new favorite', res);
      return next();
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = apiController;
