const globalSearchCtlr = require('../api/controller/globalSearchController')
const activityCtlr = require('../api/controller/activityController')
const fs = require('fs')

module.exports = function (app) {
    
    app.get('/', (req, res) => {
        res.sendfile(__dirname + '/index.html');
    });
    app.get('/add-daily-score', (req, res) => {
        res.sendfile('public/activityForm.html');
    });
    app.get('/myscore', (req, res) => {
        res.sendfile(__dirname + 'public/score-dashboard.html');
    });
    app.get('/mydashboard', (req, res) => {
        res.sendfile('public/my-dashboard.html');
    });
    app.get('/rest/globalSearch', globalSearchCtlr.fetchData);
    app.get('/bulk/upload/activity',activityCtlr.bulkUploadData);
    app.get('/activities',activityCtlr.getActivityData)
    app.get('/activity/report',activityCtlr.getTotalActivityData);
    app.get('/activity/score-range',activityCtlr.getScoreRange);
}
