//const globalSearchModel = require('../model/globalSearchModel');
const globalConstants = require('../../constants/constant')
const helperFunctions = require('../../helpers/helpers');

let globalSearch = {
    fetchData: function (req, res, next) {

        //pageNo=1&pageSize=25&sortBy=createdOn&searchValue="ServerDown"&consumerComapany=1,2,3,4&module=Breakfix&createdOn=530585353&modifiedOn=34503853
        if (req.query.createdFrom && req.query.createdTo && req.query.createdFrom > req.query.createdTo) {
            let message = 'createdFrom can not be greater than createdTo'
            return res.status(400).send(message);
        }
        if (req.query.modifiedFrom && req.query.modifiedTo && req.query.modifiedFrom > req.query.modifiedTo) {
            let message = 'modifiedFrom can not be greater than modifiedTo'
            return res.status(400).send(message);
        }
        if (!req.query.consumerCompany) {
            let message = 'Consumer company is mandatory'
            return res.status(400).send(message);
        }

        if (!req.query.module) {
            let message = 'module is mandatory'
            return res.status(400).send(message);
        }
        
        if (req.query.module!='Breakfix') {
            let message = 'module not supported'
            return res.status(400).send(message);
        }

        if(req.query.limit>100){
            let message = 'unsupported limit'
            return res.status(400).send(message);
        }

        let limit = req.query.limit || 25;
        let page = req.query.page || 1;
        let sortField = req.query.sortField || 'created_on';
        let sortDir = req.query.sortDir || 'ASC';

        let offset = helperFunctions.getOffset(page, limit);


        let where = 'where consumer_company in(?)';
        let values = [req.query.consumerCompany];

        if (req.query.createdFrom) {
            req.query.createdFrom = new Date(req.query.createdFrom).getTime();
            where = where + ' AND created_on>=?'
            values.push(req.query.createdFrom)
        }
        if (req.query.createdTo) {
            req.query.createdTo = new Date(req.query.createdTo).getTime();
            where = where + ' AND created_on<=?'
            values.push(req.query.createdTo)
        }
        if (req.query.modifiedFrom) {
            req.query.modifiedFrom = new Date(req.query.modifiedFrom).getTime();
            where = where + ' AND modified_on>=?'
            values.push(req.query.modifiedFrom)
        }
        if (req.query.modifiedTo) {
            req.query.modifiedTo = new Date(req.query.modifiedTo).getTime();
            where = where + ' AND modified_on<=?'
            values.push(req.query.modifiedTo)
        }

        let globalSearchFields = globalConstants.globalSearchFields;


        if (req.query.searchValue) {
            //and (description like '%a%' or ci_name like '%a%')
            where = where + ' AND ('
            for (let i = 0; i < globalSearchFields.length; i++) {
                if (i == 0) {
                    where = where + globalSearchFields[i] + " like '%" + req.query.searchValue + "%'"
                } else {
                    where = where + " or " + globalSearchFields[i] + " like '%" + req.query.searchValue + "%'"
                }
            }
            where = where + ')'
        }

        req.getConnection(function (err, connection) {
            if (err) return next(err);
            let query = "select breakfix_id as breakfixId, breakfix_number as breakfixNumber,consumer_company as consumerCompany,consumer_company_name as consumerCompanyName, priority_id as priorityId,priority_id_val as priorityVal, description, ci_name as customerNumber,status_val as statusVal,from_unixtime(created_on/1000) as created_on, from_unixtime(modified_on/1000) as modified_on from breakfix " + where + ' order by '+sortField+ ' '+sortDir+' limit ' +limit+ ' offset '+offset;
            console.log(query, values);
            connection.query(query, values, function (err, results) {
                if (err) return next(err);
                res.json(results);
            });
        })
    }
}

module.exports = globalSearch;