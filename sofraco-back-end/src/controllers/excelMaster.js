const path = require('path');
const fs = require('fs');

const config = require('../../config.json');
const fileService = require('../services/utils/files');
const excelMasterHandler = require('../handlers/excelMasterHandler');
const excelMasterService = require('../services/excelMaster/excelMasterManagement');

exports.createExcelMaster = async (req, res) => {
    const authorization = req.headers.authorization;
    const result = await excelMasterService.create(authorization);
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
    try {
        const excelMaster = await excelMasterHandler.getExcelMaster(req.params.id);
        res.status(200).json(excelMaster);
    } catch (err) {
        res.status(400).json({ err });
    }
}

exports.getExcelMasters = async (req, res) => {
    console.log('get excel masters');
    try {
        const excelMasters = await excelMasterHandler.getExcelMasters();
        res.status(200).json(excelMasters);
    } catch (err) {
        res.status(400).json({ err });
    }
}

exports.getExcelMastersByCourtier = async (req, res) => {
    console.log('get excel masters by courtier');
    try {
        const excelMasters = await excelMasterHandler.getExcelMastersByCourtier(req.params.courtier);
        res.status(200).json(excelMasters);
    } catch (err) {
        res.status(400).json({ err });
    }
}

exports.getExcelMastersByYearMonth = async (req, res) => {
    console.log('get excelMaster by year and month');
    try {
        const year = req.params.year;
        const month = req.params.month;
        const excelMaster = await excelMasterHandler.getExcelMastersByYearMonth(year, month);
        res.status(200).json(excelMaster);
    } catch (err) {
        res.status(400).json({ err });
    }
}

exports.getExcelMastersCourtierByYearMonth = async (req, res) => {
    console.log('get excelMaster of company by year and month');
    try {
        const courtier = req.params.courtier;
        const year = req.params.year;
        const month = req.params.month;
        const type = req.params.type;
        const excelMaster = await excelMasterHandler.getExcelMastersCourtierByYearMonth(courtier, year, month, type);
        res.status(200).json(excelMaster);
    } catch (err) {
        res.status(400).json({ err });
    }
}

exports.getExcelMastersZip = async (req, res) => {
    console.log('get excel masters zip');
    try {
        const excelMastersGlobalZip = await excelMasterHandler.getZipGlobalContainer();
        const fileName = fileService.getFileName(excelMastersGlobalZip.path);
        res.contentType('application/zip');
        res.download(excelMastersGlobalZip.path, fileName);
        res.status(200);
    } catch (err) {
        res.status(400).json({ err });
    }
}

exports.getExcelMasterZip = async (req, res) => {
    console.log('get excel master zip');
    try {
        const excelMasters = await excelMasterHandler.getExcelMastersZip();
        for (let excelMaster of excelMasters) {
            res.contentType('application/zip');
            res.download(excelMaster.path);
        }
        res.status(200);
    } catch (err) {
        res.status(400).json({ err });
    }
}

exports.updateExcelMaster = (req, res) => {
    console.log('update')
}

exports.deleteAllCorrespondances = async (req, res) => {
    console.log('Delete all excelMasters');
    try {
        await excelMasterHandler.deleteAllExcelMaster();
        res.status(200).end('excelMasters deleted');
    } catch (error) {
        res.status(500).json({ error });
    }
}
