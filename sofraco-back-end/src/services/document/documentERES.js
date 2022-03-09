const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');
const { execSync } = require('child_process');
const pdfService = require('../utils/pdfFile');
const time = require('../utils/time');
const fileService = require('../utils/files');
const redefinition = require('../utils/redefinition');
const imageManagment = require('../images/imageManagment');

const { workerData, parentPort } = require('worker_threads');
if (parentPort !== null) {
    parentPort.postMessage({ eres: workerData });
}

exports.readPdfERES = async (file) => {
    let infos = { executionTime: 0, infos: null };
    console.log(`${new Date()} DEBUT TRAITEMENT ERES`);
    const excecutionStartTime = performance.now();
    let useFiles = false;
    let allTextFiles = [];
    if (useFiles) {
        console.log(`${new Date()} DEBUT IMPORTER LINES ERES`);
        allTextFiles = fs.readFileSync(path.join(__dirname, 'erestxtfile.json'), { encoding: 'utf-8' });
        allTextFiles = JSON.parse(allTextFiles);
        console.log(`${new Date()} FIN IMPORTER LINES ERES`);
    } else {
        const images = await pdfService.convertPDFToImg(file);
        console.log(`${new Date()} DEBUT TRAITEMENT IMAGES ERES`);
        const allFiles = await imageManagment.loadOpenCV(images, 'ERES');
        console.log(`${new Date()} FIN TRAITEMENT IMAGES ERES`);
        console.log(`${new Date()} DEBUT IMPORTER LINES ERES`);
        for (let files of allFiles) {
            let contratTextsFiles = [];
            for (let lines of files) {
                const textFilePaths = getTextFromImages(lines);
                contratTextsFiles.push(textFilePaths);
            }
            allTextFiles.push(contratTextsFiles);
        }
        console.log(`${new Date()} FIN IMPORTER LINES ERES`);
    }
    const infoBordereau = readBordereauERES(allTextFiles);
    infos.infos = infoBordereau;
    const excecutionStopTime = performance.now();
    let executionTimeMS = excecutionStopTime - excecutionStartTime;
    infos.executionTime = time.millisecondToTime(executionTimeMS);
    infos.executionTimeMS = executionTimeMS;
    console.log('Total Execution time : ', infos.executionTime);
    console.log(`${new Date()} FIN TRAITEMENT ERES`);
    return infos;
};

const getTextFromImages = (images) => {
    let textFilePaths = [];
    let imgs;
    if (images.cell) {
        imgs = images.cell;
    } else {
        imgs = images;
    }
    for (let image of imgs) {
        const fileNameWthoutExtension = fileService.getFileNameWithoutExtension(image);
        const fileNameArr = fileNameWthoutExtension.split('_');
        const numero = fileNameArr[fileNameArr.length - 1];
        const destFullPath = path.join(__dirname, '..', '..', '..', 'documents', 'texte', `${fileNameWthoutExtension}`);
        try {
            const tesseractStartTime = performance.now();
            // --psm 11 : Sparse text. Find as much text as possible in no particular order
            execSync(`tesseract ${image} ${destFullPath} --psm 11`);
            const tesseractStopTime = performance.now();
            const executionTimeTesseract = tesseractStopTime - tesseractStartTime;
            console.log('Execution time Tesseract : ', time.millisecondToTime(executionTimeTesseract));
            textFilePaths.push(`${destFullPath}.txt`);
        } catch (err) {
            console.log(err);
            console.log(`Temps de traitement : ${time}`);
        }
    }
    return textFilePaths;
}

const readBordereauERES = (textFilePaths) => {
    const readBordereauERESStartTime = performance.now();
    let allContrats = [];
    for (let textFile of textFilePaths) {
        for (let line of textFile) {
            const contrat = {
                codeEntreprise: fs.readFileSync(line[0], { encoding: 'utf-8' }).trim().replace(/\n/g, ' '),
                raisonSocial: fs.readFileSync(line[1], { encoding: 'utf-8' }).trim().replace(/\n/g, ' '),
                conseiller: fs.readFileSync(line[2], { encoding: 'utf-8' }).trim().replace(/\n/g, ' '),
                montantVersee: fs.readFileSync(line[3], { encoding: 'utf-8' }).trim().replace(/\n/g, ' '),
                droitEntree: fs.readFileSync(line[4], { encoding: 'utf-8' }).trim().replace(/\n/g, ' '),
                commissionARegler: fs.readFileSync(line[5], { encoding: 'utf-8' }).trim().replace(/\n/g, ' ')
            };
            if (contrat.codeEntreprise.match(/\d+/)) {
                contrat.codeEntreprise = contrat.codeEntreprise.replace(/\s/g, '');
                contrat.codeEntreprise = contrat.codeEntreprise.replace(/(\d+)/i, '$1');
                contrat.raisonSocial = contrat.raisonSocial.replace(/(.+)/i, '$1');
                contrat.conseiller = contrat.conseiller.replace(/(.+)/i, '$1');
                contrat.montantVersee = contrat.montantVersee.replace(/\s/g, '');
                contrat.montantVersee = contrat.montantVersee.replace(/(\d+,*\d*)/i, '$1');
                contrat.montantVersee = parseFloat(contrat.montantVersee.replace(',', '.'));
                contrat.droitEntree = contrat.droitEntree.replace(/\s/g, '');
                contrat.droitEntree = contrat.droitEntree.replace(/(\d+,*\d*)/i, '$1');
                contrat.droitEntree = parseFloat(contrat.droitEntree.replace(',', '.'));
                contrat.commissionARegler = contrat.commissionARegler.replace(/\s/g, '');
                contrat.commissionARegler = contrat.commissionARegler.replace(/(\d+,*\d*)/i, '$1');
                contrat.commissionARegler = parseFloat(contrat.commissionARegler.replace(',', '.'));
                allContrats.push(contrat);
            }
        }
    }

    let allContratsPerCourtier = [];
    let conseillers = [];
    allContrats.forEach((element, index) => {
        const conseiller = { code: element.conseiller, cabinet: element.conseiller };
        if (!conseillers.some(c => { return c.code === conseiller.code })) {
            conseillers.push(conseiller);
        }
    })
    for (let conseiller of conseillers) {
        let contratCourtier = {
            conseiller: conseiller,
            contrats: []
        };
        allContrats.forEach((element, index) => {
            if (element.conseiller === contratCourtier.conseiller.code) {
                contratCourtier.contrats.push(element);
            }
        });
        allContratsPerCourtier.push(contratCourtier);
    }

    let ocr = { allContratsPerCourtier, executionTime: 0, executionTimeMS: 0 };
    const readBordereauERESStopTime = performance.now();
    const executionTimeMS = readBordereauERESStopTime - readBordereauERESStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Read bordereau ERES time : ', executionTime);
    return ocr;
}

