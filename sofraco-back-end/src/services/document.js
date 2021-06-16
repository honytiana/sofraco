const path = require('path');
const ExcelJS = require('exceljs');
const fs = require('fs');

const Tesseract = require('tesseract.js');
const Pdf2Img = require('pdf2img-promises');
const { createWorker } = require('tesseract.js');

const config = require('../../config.json');
const Document = require('../models/document');


exports.readExcel = async (file) => {
    const filePath = file.path;
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePaht);

    const worksheets = workbook.worksheets;
    let allRows = [];
    let infos = { collective: [], individual: [], totals: { collective: '', individual: '', general: '' } };

    for (let worksheet of worksheets) {
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 4) {
                if (typeof row.getCell('L').value === 'string' &&
                    row.getCell('L').value.trim() === '' &&
                    row.getCell('M').value.trim() === '' &&
                    row.getCell('I').value.trim() !== '') {
                    if (row.getCell('C').value.trim().toUpperCase() === 'TOTAL COLLECTIF') {
                        infos.totals.collective = row.getCell('I').value.trim();
                    }
                    if (row.getCell('C').value.trim().toUpperCase() === 'TOTAL INDIVIDUELS') {
                        infos.totals.individual = row.getCell('I').value.trim();
                    }
                    if (row.getCell('C').value.trim().toUpperCase() === 'TOTAL GENERAL') {
                        infos.totals.general = row.getCell('I').value.trim();
                    }
                }

                const obj = {
                    code: (typeof row.getCell('L').value === 'string') ?
                        row.getCell('L').value.trim() :
                        row.getCell('L').value,
                    cabinet: row.getCell('M').value.trim(),
                    commission: row.getCell('I').value.trim(),
                };
                allRows.push(obj);
            }
        });
    }

    for (let element of allRows) {
        if (element.code === '' &&
            element.cabinet === '' &&
            element.commission === '') {
            infos.collective = allRows.slice(0, allRows.indexOf(element));
            infos.individual = allRows.slice(allRows.indexOf(element) + 1, allRows.length - 1);
            infos.collective.pop();
            infos.individual.pop();
            infos.individual.pop();
            break;
        }
    };

    return infos;
};

exports.readPdf = (file) => {

    const filename = file.filename.split('.')[0];
    let converter = new Pdf2Img();
    const worker = createWorker();
    let infos = { collective: [], individual: [], totals: { collective: '', individual: '', general: '' } };

    converter.setOptions({
        type: 'jpg',
        size: 1024,
        density: 600,
        outputdir: path.join(__dirname, '..', '..', 'documents', 'temp'),
    });

    converter.convert(file.path)
        .then((info) => {
            const message = info.message;
            let ln = message.length;
            message.forEach(async (img, index) => {
                await worker.load();
                await worker.loadLanguage();
                await worker.initialize();
                const { data: { text } } = await worker.recognize(img.path);
                const content = text;
                fs.writeFile(path.join(__dirname, '..', '..', 'documents', 'texte', `${filename}${(1 < ln) ? '_p' + index + 1 : ''}.txt`), content, () => {
                    console.log('Fichier créé');
                })
            })
            return infos;

        })
        .catch(err => {
            console.error(err);
        });
};

exports.readImage = async (file) => {

    const filename = file.filename.split('.')[0];
    const worker = createWorker();
    let infos = { collective: [], individual: [], totals: { collective: '', individual: '', general: '' } };

    await worker.load();
    await worker.loadLanguage();
    await worker.initialize();
    const { data: { text } } = await worker.recognize(file.path);
    const content = text;
    fs.writeFile(path.join(__dirname, '..', '..', 'documents', 'texte', `${filename}.txt`), content, () => {
        console.log('Fichier créé');
    });
    return infos;
};

