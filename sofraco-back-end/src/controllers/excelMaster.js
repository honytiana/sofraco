const path = require('path');
const fs = require('fs');

const config = require('../../config.json');
const fileService = require('../services/utils/files');
const excelMasterHandler = require('../handlers/excelMasterHandler');
const excelMasterService = require('../services/excelMaster/excelMasterManagement');

exports.createExcelMaster = async (req, res) => {
    try {
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
            res.status(500).end('error');
        }
    } catch (err) {
        res.status(500).json({ err });
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

exports.getExcelMastersByYearMonthV2 = async (req, res) => {
    console.log('get excelMaster by year and month V2');
    try {
        let excelMaster = [];
        const months = [
            { month: 'Janvier', index: 1 },
            { month: 'Février', index: 2 },
            { month: 'Mars', index: 3 },
            { month: 'Avril', index: 4 },
            { month: 'Mai', index: 5 },
            { month: 'Juin', index: 6 },
            { month: 'Juillet', index: 7 },
            { month: 'Août', index: 8 },
            { month: 'Septembre', index: 9 },
            { month: 'Octobre', index: 10 },
            { month: 'Novembre', index: 11 },
            { month: 'Décembre', index: 12 }
        ];
        let years = [];
        const currentYear = new Date().getFullYear();
        for (let i = 2020; i <= currentYear; i++) {
            years.push(i);
        }
        for (let year of years) {
            let excelMasterPerMonth = [];
            for (let month of months) {
                const excelMaster = await excelMasterHandler.getExcelMastersCourtierByYearMonth(req.params.courtier, year, month.index, req.params.type);
                excelMasterPerMonth.push({ month: month, excelMaster: excelMaster });
            }
            excelMaster.push({ year: year, excelMaster: excelMasterPerMonth });
        }
        res.status(200).json(excelMaster);
    } catch (err) {
        res.status(400).json({ err });
    }
}

exports.getExcelMastersCourtierByYearMonth = async (req, res) => {
    console.log('get excelMaster of courtier by year and month');
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
