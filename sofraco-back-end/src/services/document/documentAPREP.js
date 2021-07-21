const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');
const { exec, execSync, spawnSync } = require('child_process');
const PDFParser = require("pdf2json");
const Jimp = require('jimp');
const pdfService = require('./pdfFile');
const splitPdfService = require('../pdf/splitPDF');
const easyOCR = require('../easyOCR/easyOCR');
const time = require('../time/time');
const fileService = require('./files');


const reIndexOf = (arr, rx) => {
    const length = arr.length;
    for (let i = 0; i < length; i++) {
        if (arr[i].match(rx)) {
            return i;
        }
    }
    return -1;
};

const reLastIndexOf = (arr, rx) => {
    const length = arr.length;
    let lastIndexOf = -1;
    for (let i = 0; i < length; i++) {
        if (arr[i].match(rx)) {
            lastIndexOf = i;
        }
    }
    return lastIndexOf;
}

exports.readPdfAPREP = async (file) => {
    let infos = { executionTime: 0, infos: null };
    console.log('DEBUT TRAITEMENT APREP');
    const excecutionStartTime = performance.now();
    const images = await pdfService.convertPDFToImg(file);
    const textFilePaths = getTextFromImages(images);
    // const textFilePaths = fs.readdirSync(path.join(__dirname, '..', '..', '..', 'documents', 'texte'));
    const infoBordereau = readBordereauAPREP(textFilePaths);
    infos.infos = infoBordereau;
    const excecutionStopTime = performance.now();
    let executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    infos.executionTime = executionTime;
    infos.executionTimeMS = executionTimeMS;
    console.log('FIN TRAITEMENT APREP');
    return infos;
};

const getTextFromImages = (images) => {
    let textFilePaths = [];
    for (let image of images) {
        const fileNameWthoutExtension = fileService.getFileNameWithoutExtension(image);
        const fileNameArr = fileNameWthoutExtension.split('_');
        const numero = fileNameArr[fileNameArr.length - 1];
        const destFullPath = path.join(__dirname, '..', '..', '..', 'documents', 'texte', `${fileNameWthoutExtension}`);
        try {
            const tesseractStartTime = performance.now();
            // --psm 4 : Assume a single column of text of variable sizes.
            execSync(`tesseract ${image} ${destFullPath} --psm 4`);
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

const readBordereauAPREP = (textFilePaths) => {
    const readBordereauAPREPStartTime = performance.now();
    let infos = { infosBordereau: null, contrats: [] };
    for (let textFilePath of textFilePaths) {
        // textFilePath = path.join(__dirname, '..', '..', '..', 'documents', 'texte', textFilePath);
        const content = fs.readFileSync(textFilePath, { encoding: 'utf-8' });
        let data = content.split('\n');
        data = data.filter((element) => {
            return element.trim() !== '';
        });
        const fileNameWithoutExtension = fileService.getFileNameWithoutExtension(textFilePath);
        const nameArr = fileNameWithoutExtension.split('_');
        const numero = nameArr[nameArr.length - 1];
        if (numero === '1') {
            let infosBordereau = {
                lieu: null,
                datebordereau: null,
                numOrias: null,
                objet: null,
                designation: null,
                montantHT: null
            };
            const rDateLieuBordereau = /^([^\d]*) (\d{1,2}[/]\d{1,2}[/]\d{1,4})+$/i;
            const rNumOrias = /^(N°[^\d]+)(\d+)$/i;
            const rObjet = /^Objet : ([^\d]+)$/i;
            const rDesignationMontantHT = /^([^\d]+) (\d+,\d*).*€$/i;
            data.forEach((d, i) => {
                if (d.match(rDateLieuBordereau)) {
                    infosBordereau.lieu = d.replace(rDateLieuBordereau, '$1');
                    const dateBordereau = d.replace(rDateLieuBordereau, '$2');
                    const dateBordereauArray = dateBordereau.split('/');
                    infosBordereau.datebordereau = new Date(parseInt(dateBordereauArray[2]), parseInt(dateBordereauArray[1]) - 1, parseInt(dateBordereauArray[0]), 0, 0, 0);
                }
                if (d.match(rNumOrias)) {
                    infosBordereau.numOrias = d.replace(rNumOrias, '$2');
                }
                if (d.match(rObjet)) {
                    infosBordereau.objet = d.replace(rObjet, '$1');
                }
                if (d.match(rDesignationMontantHT)) {
                    infosBordereau.designation = d.replace(rDesignationMontantHT, '$1');
                    infosBordereau.montantHT = d.replace(rDesignationMontantHT, '$2');
                }
            });
            infos.infosBordereau = infosBordereau;
        } else {
            const regex = /^(\d{1,2}[/]\d{1,2}[/]\d{1,4})?.+(\d{1,2}[/]\d{1,2}[/]\d{1,4})+.+\d+[,]?\d % \d+[,]\d+$/i;
            const firstIndexUtil = reIndexOf(data, regex);
            const lastIndexUtil = reLastIndexOf(data, regex);
            const details = data.filter((d, index) => {
                return index >= firstIndexUtil && index <= lastIndexUtil;
            });
            let newDetails = [];
            details.forEach((detail, index) => {
                if (((index + 1) <= (details.length - 1)) && (details[index + 1].length < 30)) {
                    detail = `${detail} ${details[index + 1]}`;
                    newDetails.push(detail);
                    details.splice(index + 1, 1);
                } else {
                    newDetails.push(detail);
                }
            })

            newDetails.forEach((element, index) => {
                let contrat = {
                    datePrelevement: null,
                    numeroContrat: null,
                    datePaiement: null,
                    nom: '',
                    prenoms: '',
                    fract: '',
                    primeCommissionnement: null,
                    tauxCommissionApporteur: null,
                    commissionApporteur: null,
                    verificationCommissionApporteur: null
                };
                const rContrat1 = /^(\d{1,2}[/]\d{1,2}[/]\d{1,4})+ (.+) (\d{1,2}[/]\d{1,2}[/]\d{1,4})+ ([^\d]+) ([^\d]+) ([^\d]+) (\d+[,]*\d*) (\d+[,]*\d*) % (\d+[,]*\d*)([^\d]*)$/i;
                const rContrat2 = /^([^\d]+\d+.*\d*) (\d{1,2}[/]\d{1,2}[/]\d{1,4})+ ([^\d]+) ([^\d]+) ([^\d]+) (\d+[,]*\d*) (\d+[,]*\d*) % (\d+[,]*\d*)([^\d]*)$/i;
                if (element.match(rContrat1)) {
                    const datePrelevement = element.replace(rContrat1, '$1');
                    const datePrelevementArray = datePrelevement.split('/');
                    contrat.datePrelevement = new Date(parseInt(datePrelevementArray[2]), parseInt(datePrelevementArray[1]) - 1, parseInt(datePrelevementArray[0]), 0, 0, 0);

                    contrat.numeroContrat = element.replace(rContrat1, '$2');

                    const datePaiement = element.replace(rContrat1, '$3');
                    const datePaiementArray = datePaiement.split('/');
                    contrat.datePaiement = new Date(parseInt(datePaiementArray[2]), parseInt(datePaiementArray[1]) - 1 , parseInt(datePaiementArray[0]), 0, 0, 0);

                    contrat.nom = element.replace(rContrat1, '$4');
                    contrat.prenoms = element.replace(rContrat1, '$5$10');
                    contrat.fract = element.replace(rContrat1, '$6');
                    contrat.primeCommissionnement = element.replace(rContrat1, '$7');
                    contrat.primeCommissionnement = parseFloat(contrat.primeCommissionnement.replace(',', '.'));
                    contrat.tauxCommissionApporteur = element.replace(rContrat1, '$8');
                    contrat.tauxCommissionApporteur = parseFloat(contrat.tauxCommissionApporteur.replace(',', '.'));
                    contrat.commissionApporteur = element.replace(rContrat1, '$9');
                    contrat.commissionApporteur = parseFloat(contrat.commissionApporteur.replace(',', '.'));
                }
                if (element.match(rContrat2)) {
                    contrat.datePrelevement = '';
                    contrat.numeroContrat = element.replace(rContrat2, '$1');

                    const datePaiement = element.replace(rContrat2, '$2');
                    const datePaiementArray = datePaiement.split('/');
                    contrat.datePaiement = new Date(parseInt(datePaiementArray[2]), parseInt(datePaiementArray[1]) - 1, parseInt(datePaiementArray[0]), 0, 0, 0);

                    contrat.nom = element.replace(rContrat2, '$3');
                    contrat.prenoms = element.replace(rContrat2, '$4$9');
                    contrat.fract = element.replace(rContrat2, '$5');
                    contrat.primeCommissionnement = element.replace(rContrat2, '$6');
                    contrat.primeCommissionnement = parseFloat(contrat.primeCommissionnement.replace(',', '.'));
                    contrat.tauxCommissionApporteur = element.replace(rContrat2, '$7');
                    contrat.tauxCommissionApporteur = parseFloat(contrat.tauxCommissionApporteur.replace(',', '.'));
                    contrat.commissionApporteur = element.replace(rContrat2, '$8');
                    contrat.commissionApporteur = parseFloat(contrat.commissionApporteur.replace(',', '.'));
                }
                
                const vCommissionApporteur = ((contrat.primeCommissionnement * contrat.tauxCommissionApporteur) / 100).toFixed(2);
                if (Math.abs(parseFloat(vCommissionApporteur)) === Math.abs(contrat.commissionApporteur) ||
                    (Math.abs(parseFloat(vCommissionApporteur)) + 0.01) === Math.abs(contrat.commissionApporteur) ||
                    (Math.abs(parseFloat(vCommissionApporteur)) - 0.01) === Math.abs(contrat.commissionApporteur)) {
                    contrat.verificationCommissionApporteur = true;
                } else {
                    contrat.verificationCommissionApporteur = false;
                }

                infos.contrats.push(contrat);
            })
        }
    }
    const readBordereauAPREPStopTime = performance.now();
    const executionTimeMS = readBordereauAPREPStopTime - readBordereauAPREPStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Read bordereau APREP time : ', executionTime);
    return infos;
}
