const path = require('path');
const fs = require('fs');

const config = require('../../config.json');
const ExcelMaster = require('../models/excelMaster');
const excelMasterService = require('../services/excelMaster/excelMasterManagement');

exports.createExcelMaster = (req, res) => {
    // const data = req.body;
    // const excelMaster = new ExcelMaster();
    const data = excelMasterService.create();
    // excelMaster.save()
    //     .then((data) => {
    //         console.log('Post excelMaster');
    res.status(200).json('');
    //     })
    //     .catch((err) => {
    //         throw err;
    //     });

};

exports.getExcelMaster = (req, res) => {
    console.log('get excelMaster');
    ExcelMaster.findById(req.params.id, (err, doc) => {
        if (err) {
            throw err;
        } else {
            res.status(200).json(doc);
        }
    });
}


exports.getExcelMasters = (req, res) => {
    console.log('get excel masters');
    ExcelMaster.find((err, doc) => {
        if (err) {
            throw err;
        } else {
            res.status(200).json(doc);
        }
    });
}

exports.updateExcelMaster = (req, res) => {
    console.log('update')
}
