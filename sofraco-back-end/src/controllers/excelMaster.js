const path = require('path');
const fs = require('fs');

const config = require('../../config.json');
const excelMasterHandler = require('../handlers/excelMasterHandler');
const excelMasterService = require('../services/excelMaster/excelMasterManagement');

exports.createExcelMaster = async (req, res) => {
    const result = await excelMasterService.create();
    if (result.excelMasters && result.message) {
        for (let excelMaster of result.excelMasters) {
            const doc = await excelMasterHandler.createExcelMaster(excelMaster);
        }
        res.status(200).json({ message: result.message, excelMasters: result.excelMasters });
    } else {
        res.status(500).end(result);
    }

};

exports.getExcelMaster = async (req, res) => {
    console.log('get excelMaster');
    const excelMaster = await excelMasterHandler.getExcelMaster(req.params.id);
    res.status(200).json(excelMaster);
}

exports.getExcelMasters = async (req, res) => {
    console.log('get excel masters');
    const excelMasters = await excelMasterHandler.getExcelMasters();
    res.status(200).json(excelMasters);
}

exports.updateExcelMaster = (req, res) => {
    console.log('update')
}
