/* Magic Mirror
 * Module: MMM-mcfit
 *
 *
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');



module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    fetchData: function(url) {

        request({
            url: url,
            method: 'GET'
        }, (error, response, body) => {

            if (!error) {
                var result = JSON.parse(body); // Parsing an array this line and next line
                this.sendSocketNotification('MCFIT_RESULT', result);
            }else {
                this.sendSocketNotification('MCFIT_RESULT', null);
            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'FETCH_MCFIT') {
            this.fetchData(payload);
        }
    }
});
