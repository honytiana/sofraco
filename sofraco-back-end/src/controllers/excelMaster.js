const path = require('path');
const fs = require('fs');

const config = require('../../config.json');
const ExcelMaster = require('../models/excelMaster');
const excelMasterService = require('../services/excelMaster/excelMasterManagement');

exports.createExcelMaster = async (req, res) => {
    const message = await excelMasterService.create();
    if (message.excelMasters && message.message) {
        res.status(200).json({ message: message.message, excelMasters: message.excelMasters });
    } else {
        res.status(500).end(message);
    }

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
