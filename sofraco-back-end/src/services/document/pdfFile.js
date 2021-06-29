const path = require('path');
const ExcelJS = require('exceljs');
const fs = require('fs');
const Jimp = require('jimp');

const Tesseract = require('tesseract.js');
const Pdf2Img = require('pdf2img-promises');
const { createWorker } = require('tesseract.js');
const { exec, execSync } = require('child_process');

const documentMETLIFE = require('./documentMETLIFE');
const easyOCR = require('../easyOCR/easyOCR');


exports.readPdf = async (file, company) => {
    let infos = null;
    const filePath = file;
    const fileNameWithExtensionArr = filePath.split('/');
    const fileNameWithExtension = fileNameWithExtensionArr[fileNameWithExtensionArr.length - 1];
    const filename = fileNameWithExtension.split('.')[0];
    let converter = new Pdf2Img();

    converter.setOptions({
        type: 'jpg',
        size: 1024,
        density: 600,
        outputdir: path.join(__dirname, '..', '..', '..', 'documents', 'temp'),
    });

    const data = await converter.convert(file.path);
    const message = data.message;
    let filesPaths = [];
    for (let image of message) {
        const filename = image.name.split('.')[0];
        const nameA = filename.split('_');
        const numero = nameA[nameA.length - 1];
        let time = 0;
        const timeout = setInterval(() => {
            time++;
        }, 1000);

        if (numero === '1' || numero === '3' || numero === '4') {
            // const img = await Jimp.read(image.path);
            // img.contrast(0.5);
            // const pathImage = `${image.path.split('.')[0]}_edit.png`;
            // await img.writeAsync(pathImage);
            const destFullPath = path.join(__dirname, '..', '..', '..', 'documents', 'texte', `${image.name.split('.')[0]}`);
            try {
                if (numero === '1') {
                    execSync(`tesseract ${image.path} ${destFullPath}`);
                } else {
                    easyOCR(image.path, destFullPath)
                }
                console.log(`Temps de traitement : ${time}`);
                clearInterval(timeout);
                filesPaths.push(`${destFullPath}.txt`);

            } catch (err) {
                console.log(err);
                console.log(`Temps de traitement : ${time}`);
                clearInterval(timeout);
            }
        }

    }
    switch (company.toUpperCase()) {
        // case 'APREP':
        //     infos = await readPdfMETLIFE(file);
        //     break;
        // case 'AVIVA':
        //     infos = await readPdfMETLIFE(file);
        //     break;
        // case 'AVIVA SURCO':
        //     infos = await readPdfMETLIFE(file);
        //     break;
        // case 'CARDIF':
        //     infos = await readPdfMETLIFE(file);
        //     break;
        // case 'CBP FRANCE':
        //     infos = await readPdfMETLIFE(file);
        //     break;
        // case 'CEGEMA':
        //     infos = await readPdfMETLIFE(file);
        //     break;
        // case 'ERES':
        //     infos = await readPdfMETLIFE(file);
        //     break;
        // case 'GENERALI':
        //     infos = await readPdfMETLIFE(file);
        //     break;
        // case 'HODEVA':
        //     infos = await readPdfMETLIFE(file);
        //     break;
        case 'METLIFE':
            infos = documentMETLIFE.readPdfMETLIFE(filesPaths);
            break;
        // case 'SWISSLIFE':
        //     infos = await readPdfMETLIFE(file);
        //     break;
        // case 'SWISSLIFE SURCO':
        //     infos = await readPdfMETLIFE(file);
        //     break;
        default:
            console.log('Pas de compagnie correspondante');
    }
    return infos;

}

