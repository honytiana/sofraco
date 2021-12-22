const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');
const { execSync } = require('child_process');
const pdfService = require('../utils/pdfFile');
const time = require('../utils/time');
const fileService = require('../utils/files');
const redefinition = require('../utils/redefinition');

const { workerData, parentPort } = require('worker_threads');
if (parentPort !== null) {
    parentPort.postMessage({ eres: workerData });
}

exports.readPdfERES = async (file) => {
    let infos = { executionTime: 0, infos: null };
    console.log(`${new Date()} DEBUT TRAITEMENT ERES`);
    const excecutionStartTime = performance.now();
    const images = await pdfService.convertPDFToImg(file);
    const textFilePaths = getTextFromImages(images);
    // const textFilePaths = fs.readdirSync(path.join(__dirname, '..', '..', '..', 'documents', 'texte'));
    const infoBordereau = readBordereauERES(textFilePaths);
    infos.infos = infoBordereau;
    const excecutionStopTime = performance.now();
    let executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    infos.executionTime = executionTime;
    infos.executionTimeMS = executionTimeMS;
    console.log(`${new Date()} FIN TRAITEMENT ERES`);
    const directoryTemp = path.join(__dirname, '..', '..', '..', 'documents', 'temp');
    const directoryTexte = path.join(__dirname, '..', '..', '..', 'documents', 'texte');
    const directorySplitedPDF = path.join(__dirname, '..', '..', '..', 'documents', 'splited_PDF');
    try {
        fileService.deleteFilesinDirectory(directoryTemp);
        fileService.deleteFilesinDirectory(directoryTexte);
        fileService.deleteFilesinDirectory(directorySplitedPDF);
    } catch (err) {
        console.log(err);
    }
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
    let infos = { infosBordereau: { total: null }, contrats: [] };
    for (let textFilePath of textFilePaths) {
        // textFilePath = path.join(__dirname, '..', '..', '..', 'documents', 'texte', textFilePath);
        const content = fs.readFileSync(textFilePath, { encoding: 'utf-8' });
        const rTestContent = /Objet : Facturation des droits d’entrée/i;
        if (!content.match(rTestContent)) {
            let data = content.split('\n');
            data = data.filter((element) => {
                return element.trim() !== '';
            });
            let details = [];
            const rCode = /^\d+$/;
            const rLast = /régler en €/i;
            const rMontant = /^\d+ ?\d*,?\d*$/;
            const rWord = /[a-z.' ]+/i;
            const newData = data.slice(redefinition.reIndexOf(data, rLast) + 1, data.length - 1);
            const lengthNewData = newData.length / 4;
            for (let i = 0; i < lengthNewData; i++) {
                const allIndexOfMontants = redefinition.reAllIndexOf(newData, rMontant);
                if (allIndexOfMontants.length > 0) {
                    const contrat = newData.slice(0, allIndexOfMontants[3] + 1);
                    if (!newData[allIndexOfMontants[3] + 1].match(/total/i)) {
                        if (!newData[allIndexOfMontants[3] + 1].match(/^Conformément/i) &&
                            !newData[allIndexOfMontants[3] + 1].match(/^Eres gestion/i)) {
                            if (newData[allIndexOfMontants[3] + 1].match(rWord) && newData[allIndexOfMontants[3] + 2].match(rWord)) {
                                contrat.push(newData[allIndexOfMontants[3] + 1]);
                            }
                            if (newData[allIndexOfMontants[3] + 1].match(rWord) && newData[allIndexOfMontants[3] + 2].match(/Conformément/i) ||
                                newData[allIndexOfMontants[3] + 1].match(rWord) && newData[allIndexOfMontants[3] + 2].match(/Eres gestion/i)) {
                                contrat.push(newData[allIndexOfMontants[3] + 1]);
                            }
                        }
                    } else {
                        infos.infosBordereau.total = [
                            newData[allIndexOfMontants[3] + 2],
                            newData[allIndexOfMontants[3] + 3],
                            newData[allIndexOfMontants[3] + 4]
                        ];
                        break;
                    }
                    details.push(contrat);
                    newData.splice(0, contrat.length);
                    allIndexOfMontants.splice(0, 4);
                }
            }

            for (let detail of details) {
                let contrat = {
                    codeEntreprise: null,
                    raisonSocial: null,
                    conseiller: null,
                    montantVersee: null,
                    droitEntree: null,
                    commissionARegler: null
                };
                const allIndexOfChiffres = redefinition.reAllIndexOf(detail, rMontant);
                contrat.codeEntreprise = detail[allIndexOfChiffres[0]];
                contrat.montantVersee = detail[allIndexOfChiffres[1]];
                contrat.droitEntree = detail[allIndexOfChiffres[2]];
                contrat.commissionARegler = detail[allIndexOfChiffres[3]];

                detail.splice(detail.indexOf(contrat.codeEntreprise), 1);
                detail.splice(detail.indexOf(contrat.montantVersee), 1);
                detail.splice(detail.indexOf(contrat.droitEntree), 1);
                detail.splice(detail.indexOf(contrat.commissionARegler), 1);

                contrat.montantVersee = parseFloat(contrat.montantVersee.replace(' ', '').replace(',', '.'));
                contrat.droitEntree = parseFloat(contrat.droitEntree.replace(' ', '').replace(',', '.'));
                contrat.commissionARegler = parseFloat(contrat.commissionARegler.replace(' ', '').replace(',', '.'));

                if (detail.length === 2) {
                    contrat.raisonSocial = `${detail[0]}`;
                    contrat.conseiller = `${detail[1]}`;
                }
                if (detail.length === 3) {
                    contrat.raisonSocial = `${detail[1]}`;
                    contrat.conseiller = `${detail[0]} ${detail[2]}`;
                }
                if (detail.length > 3) {
                    contrat.raisonSocial = `${detail[2]}`;
                    contrat.conseiller = `${detail[0]} ${detail[1]} ${detail[3]} ${detail[4]}`;
                }

                // const vCommissionApporteur = ((contrat.primeCommissionnement * contrat.tauxCommissionApporteur) / 100).toFixed(2);
                // if (Math.abs(parseFloat(vCommissionApporteur)) === Math.abs(contrat.commissionApporteur) ||
                //     (Math.abs(parseFloat(vCommissionApporteur)) + 0.01) === Math.abs(contrat.commissionApporteur) ||
                //     (Math.abs(parseFloat(vCommissionApporteur)) - 0.01) === Math.abs(contrat.commissionApporteur)) {
                //     contrat.verificationCommissionApporteur = true;
                // } else {
                //     contrat.verificationCommissionApporteur = false;
                // }

                infos.contrats.push(contrat);
            }

        } else {
            break;
        }
    }
    let allContratsPerConseillers = [];
    let conseillers = [];
    infos.contrats.forEach((element, index) => {
        const conseiller = {code: element.conseiller, cabinet: element.conseiller};
        if (!conseillers.some(c => { return c.code === conseiller.code})) {
            conseillers.push(conseiller);
        }
    })
    for (let conseiller of conseillers) {
        let contratCourtier = {
            conseiller: conseiller,
            contrats: []
        };
        infos.contrats.forEach((element, index) => {
            if (element.conseiller === contratCourtier.conseiller.code) {
                contratCourtier.contrats.push(element);
            }
        });
        allContratsPerConseillers.push(contratCourtier);
    }

    let ocr = { allContratsPerConseillers, executionTime: 0, executionTimeMS: 0 };
    const readBordereauERESStopTime = performance.now();
    const executionTimeMS = readBordereauERESStopTime - readBordereauERESStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Read bordereau ERES time : ', executionTime);
    return ocr;
}

