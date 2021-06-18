const path = require('path');
const ExcelJS = require('exceljs');
const fs = require('fs');

const Tesseract = require('tesseract.js');
const { createWorker } = require('tesseract.js');


exports.readImage = async (file) => {

    const filename = file.filename.split('.')[0];
    const worker = createWorker();
    let infos = { collective: [], individual: [], totals: { collective: '', individual: '', general: '' } };

    await worker.load();
    await worker.loadLanguage();
    await worker.initialize();
    const { data: { text } } = await worker.recognize(file.path);
    const content = text;
    fs.writeFile(path.join(__dirname, '..', '..', '..', 'documents', 'texte', `${filename}.txt`), content, () => {
        console.log('Fichier créé');
    });
    return infos;
};

