const Apartment = require('../models/apartment.model');
const dbo = require("../db/conn");

const notificationWorkerFactory = function() {
    return {
        run: function() {
            let db_connection = dbo.getDb("ParkingApp");
            db_connection
            .collection("Apts")
            .find({}).toArray(function (err, result){
                if (err){
                    result.status(500);
                    result.send(err.message);
                }
                for (let i = 0; i < result.length; i++) {
                    Apartment(result[i]).sendNotifications();
                }
            });
        },
    };
};

module.exports = notificationWorkerFactory();
