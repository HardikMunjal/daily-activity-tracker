var csv = require("csvtojson");
var moment = require("moment");


let activity = {
    bulkUploadData: function (req, res, next) {
        // Convert a csv file with csvtojson
        csv()
        .fromFile('C:/Users/hardik.munjal/hcl/backend/data_files/activity_july.csv')
        .then(function(items){ //when parse finished, result will be emitted here.
            console.log(items.length,items[156]); 
            //items.pop();

            req.getConnection(function (err, connection) {
                if (err) return next(err);

                var query = "INSERT INTO tracker(date,task_id,user_id,remarks,frequency) VALUES ?";
                 
                //console.log(query, values);
                connection.query(query, [items.map(item => [moment(item.date).format('YYYY-MM-DD'), item.taskid, item.userid, item.remarks, item.frequency])], function (err, results) {
                    if (err) return next(err);
                    res.json(results);
                });
            })
        })
    },
    getActivityData: function (req, res, next) {
        req.getConnection(function (err, connection) {
            if (err) return next(err);

            var query = "select SUM(frequency) as total, t2.name, week(date) as week_number from tracker t1 LEFT JOIN tasks t2 ON t1.task_id = t2.id group by t1.task_id ,week(t1.date) order by t1.task_id;";
             
            //console.log(query, values);
            connection.query(query, [], function (err, results) {
                if (err) return next(err);
                res.json(results);
            });
        })

    },

    getTotalActivityData: function (req, res, next) {
        req.getConnection(function (err, connection) {
            if (err) return next(err);

            var query = "select DATEDIFF(max(date), min(date)) as daysdiff ,SUM(frequency) as total,t1.task_id, t2.name from tracker t1 LEFT JOIN tasks t2  ON t1.task_id = t2.id  group by t1.task_id  order by t1.task_id;";
             
            //console.log(query, values);
            connection.query(query, [], function (err, results) {
                if (err) return next(err);
                res.json(results);
            });
        })

    },

    getScoreRange: function (req, res, next) {
        req.getConnection(function (err, connection) {
            if (err) return next(err);

            var query = "select x1.date,x1.remarks,x1.total as dayScore,SUM(x2.total) as totalScore  from ( select t1.date,t1.remarks, SUM(t1.frequency * t2.score) as total from tracker t1  LEFT JOIN tasks t2  ON t1.task_id = t2.id  group by t1.date order by t1.date) as x1  inner join (select a1.date,a1.remarks, SUM(a1.frequency * a2.score) as total from tracker a1 LEFT JOIN tasks a2 ON a1.task_id = a2.id group by a1.date order by a1.date) as x2  on x1.date >= x2.date group by x1.date order by x1.date";
            //console.log(query, values);
            connection.query(query, [], function (err, results) {
                if (err) return next(err);
                res.json(results);
            });
        })

    }
}

module.exports = activity;