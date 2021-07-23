const path = require('path');
const fs = require('fs');

const config = require('../../config.json');
const fileService = require('../services/document/files');
const excelMasterHandler = require('../handlers/excelMasterHandler');
const excelMasterService = require('../services/excelMaster/excelMasterManagement');

exports.createExcelMaster = async (req, res) => {
    const result = await excelMasterService.create();
    if (result.excelMasters && result.excelsMastersZipped && result.singleZip && result.message) {
        for (let excelMaster of result.excelMasters) {
            const ems = await excelMasterHandler.createExcelMaster(excelMaster);
        }
        for (let excelMasterZipped of result.excelsMastersZipped) {
            const emz = await excelMasterHandler.createExcelMaster(excelMasterZipped);
        }
        const emsg = await excelMasterHandler.createExcelMaster(result.singleZip);
        res.status(200).json({ message: result.message });
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

exports.getExcelMastersZip = async (req, res) => {
    console.log('get excel masters zip');
    const excelMastersGlobalZip = await excelMasterHandler.getZipGlobalContainer();
    const fileName = fileService.getFileName(excelMastersGlobalZip.path);
    res.contentType('application/zip');
    res.download(excelMastersGlobalZip.path, fileName);
    res.status(200);
}

exports.getExcelMasterZip = async (req, res) => {
    console.log('get excel master zip');
    const excelMasters = await excelMasterHandler.getExcelMastersZip();
    for (let excelMaster of excelMasters) {
        res.contentType('application/zip');
        res.download(excelMaster.path);
    }
    res.status(200);
}

exports.updateExcelMaster = (req, res) => {
    console.log('update')
}
