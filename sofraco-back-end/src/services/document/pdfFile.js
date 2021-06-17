const path = require('path');
const ExcelJS = require('exceljs');
const fs = require('fs');

const Tesseract = require('tesseract.js');
const Pdf2Img = require('pdf2img-promises');
const { createWorker } = require('tesseract.js');

exports.readPdfMETLIFE = (file) => {

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

