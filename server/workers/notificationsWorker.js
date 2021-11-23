const Apartment = require('../models/apartment.model');

const notificationWorkerFactory = function() {
  return {
    run: function() {
      Apartment.sendNotifications();
    },
  };
};

module.exports = notificationWorkerFactory();
