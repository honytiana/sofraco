const path = require('path');
const ExcelJS = require('exceljs');
const fs = require('fs');

const Tesseract = require('tesseract.js');
const { createWorker } = require('tesseract.js');


exports.readImage = async (file, company) => {

    const filePath = file;
    const fileNameWithExtensionArr = filePath.split('/');
    const fileNameWithExtension = fileNameWithExtensionArr[fileNameWithExtensionArr.length - 1];
    const filename = fileNameWithExtension.split('.')[0];
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
    switch (company.toUpperCase()) {
        // case 'APICIL':
        //     infos = await readImage(file);
        //     break;
        // case 'APREP':
        //     infos = await readImage(file);
        //     break;
        // case 'AVIVA':
        //     infos = await readImage(file);
        //     break;
        // case 'AVIVA SURCO':
        //     infos = await readImage(file);
        //     break;
        // case 'CARDIF':
        //     infos = await readImage(file);
        //     break;
        // case 'CBP FRANCE':
        //     infos = await readImage(file);
        //     break;
        // case 'CEGEMA':
        //     infos = await readImage(file);
        //     break;
        // case 'ERES':
        //     infos = await readImage(file);
        //     break;
        // case 'GENERALI':
        //     infos = await readImage(file);
        //     break;
        // case 'HODEVA':
        //     infos = await readImage(file);
        //     break;
        // case 'METLIFE':
        //     infos = await readImage(file);
        //     break;
        // case 'SWISSLIFE':
        //     infos = await readImage(file);
        //     break;
        // case 'SWISSLIFE SURCO':
        //     infos = await readImage(file);
        //     break;
        default:
            console.log('Pas de compagnie correspondante');
    }
    return infos;
};

