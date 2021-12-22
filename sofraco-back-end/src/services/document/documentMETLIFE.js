const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');
const { execSync } = require('child_process');
const splitPdfService = require('../pdf/splitPDF');
const time = require('../utils/time');
const fileService = require('../utils/files');
const redefinition = require('../utils/redefinition');
const imageManagment = require('../images/imageManagment');

const { workerData, parentPort } = require('worker_threads');
if (parentPort !== null) {
    parentPort.postMessage({ metlife: workerData });
}

const getTextFromImages = (images) => {
    let textFilePaths = [];
    try {
        let imgs;
        if (images.cell) {
            imgs = images.cell;
        } else {
            imgs = images;
        }
        for (let image of imgs) {
            const fileNameWthoutExtension = fileService.getFileNameWithoutExtension(image);
            const destFullPath = path.join(__dirname, '..', '..', '..', 'documents', 'texte', `${fileNameWthoutExtension}`);
            let executionTimeTesseract;
            try {
                const tesseractStartTime = performance.now();
                execSync(`tesseract ${image} ${destFullPath} --psm 6`);
                const tesseractStopTime = performance.now();
                executionTimeTesseract = tesseractStopTime - tesseractStartTime;
                console.log('Execution time Tesseract : ', time.millisecondToTime(executionTimeTesseract));
                textFilePaths.push(`${destFullPath}.txt`);
            } catch (err) {
                console.log(err);
                console.log(`Temps de traitement : ${time.millisecondToTime(executionTimeTesseract)}`);
            }
        }
        return textFilePaths;
    } catch (err) {
        console.log(err);
    }
}

exports.readPdfMETLIFE = async (file) => {
    let infos = { executionTime: 0, executionTimeMS: 0, infos: [] };
    console.log(`${new Date()} DEBUT TRAITEMENT METLIFE`);
    const excecutionStartTime = performance.now();
    let imagesPDF;
    const useFile = false;
    if (useFile) {
        imagesPDF = fs.readFileSync(path.join(__dirname, 'imagesMetlife.json'), { encoding: 'utf-8' });
        imagesPDF = JSON.parse(imagesPDF);
    } else {
        imagesPDF = await splitPdfService.splitPDFMETLIFE(file);
    }
    for (let images of imagesPDF) {
        // pathToPDF = path.join(__dirname, '..', '..', '..', 'documents', 'splited_PDF', pathToPDF);
        let useFiles = false;
        let allTextFiles = [];
        if (useFiles) {
            console.log(`${new Date()} DEBUT IMPORTER LINES METLIFE`);
            allTextFiles = fs.readFileSync(path.join(__dirname, 'apiviatxtfile.json'), { encoding: 'utf-8' });
            allTextFiles = JSON.parse(allTextFiles);
            console.log(`${new Date()} FIN IMPORTER LINES METLIFE`);
        } else {
            console.log(`${new Date()} DEBUT TRAITEMENT IMAGES METLIFE`);
            let imagesOpenCV = [];
            let imageFirstPage;
            for (let i = 0; i < images.length; i++) {
                if (i === 0) {
                    imageFirstPage = images[i];
                }
                if (i > 1) {
                    imagesOpenCV.push(images[i]);
                }
            }
            delete require.cache[require.resolve('../pdf/splitPDF')];
            delete require.cache[require.resolve('../images/imageManagment')];
            const allFilesFromOpenCV = await imageManagment.loadOpenCV(imagesOpenCV, 'METLIFE');
            console.log(`${new Date()} FIN TRAITEMENT IMAGES METLIFE`);
            const allFilesFromFirstPage = getTextFromImages([imageFirstPage]);
            allTextFiles.push(allFilesFromFirstPage[0]);
            console.log(`${new Date()} DEBUT IMPORTER LINES METLIFE`);
            for (let files of allFilesFromOpenCV) {
                let i = 0;
                let contratTextsFiles = [];
                for (let file of files) {
                    if (i > 1) {
                        const textFilePaths = getTextFromImages(file);
                        if (contratTextsFiles.length > 0) {
                            if (contratTextsFiles[contratTextsFiles.length - 1].length === 11) {
                                contratTextsFiles.push(textFilePaths);
                            } else {
                                allTextFiles.push(contratTextsFiles);
                                contratTextsFiles = [];
                                contratTextsFiles.push(textFilePaths);
                            }
                            if (files.length - 1 === i) {
                                allTextFiles.push(contratTextsFiles);
                            }
                        } else {
                            contratTextsFiles.push(textFilePaths);
                        }
                    }
                    i++;
                }
            }
            console.log(`${new Date()} FIN IMPORTER LINES METLIFE`);
        }
        const infoBordereau = readBordereauMETLIFE(allTextFiles);
        infos.infos.push(infoBordereau);
    }

    const excecutionStopTime = performance.now();
    let executionTimeMS = excecutionStopTime - excecutionStartTime;
    infos.executionTime = time.millisecondToTime(executionTimeMS);
    infos.executionTimeMS = executionTimeMS;
    console.log('Total Execution time : ', infos.executionTime);
    console.log(`${new Date()} FIN TRAITEMENT METLIFE`);
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

const readBordereauMETLIFE = (textFilePath) => {
    const readBordereauMETLIFEStartTime = performance.now();
    let infos = { syntheseDesCommissions: null, detailDesPolices: [] };
    let syntheseDesCommissions = {};

    let i = 0;
    for (let textFile of textFilePath) {
        if (i === 0) {
            const content = fs.readFileSync(textFile, { encoding: 'utf-8' });
            let data = content.split('\n');
            data = data.filter((element) => {
                return element.trim() !== '';
            });
            let periodeEncaissement;
            let codeApporteurBeneficiaireCommissions;
            let codeApporteurEmetteur;
            let reportSoldePrecedent;
            let nombrePolicesSurLaPeriode;
            let primesEncaisseesSurLaPeriode;
            let stCommissionsCalculeesSurLaPeriode;
            let stCommissionsReprisesSurLaPeriode;
            let stCommissionsDeduitesSurLaPeriode;
            let stOperationsDiversesSurLaPeriode;
            let totalCommissionsDues;
            periodeEncaissement = data[redefinition.reIndexOf(data, /Période d'encaissement du/) + 1];
            codeApporteurBeneficiaireCommissions = data[redefinition.reIndexOf(data, /Code apporteur bénéficiaire des commissions/) + 1];
            codeApporteurEmetteur = data[redefinition.reIndexOf(data, /Code apporteur émetteur/) + 1];
            reportSoldePrecedent = data.filter((element) => {
                return element.match(/Report solde précédent.+/)
            });
            reportSoldePrecedent = reportSoldePrecedent[0].split(':')[1].trim();
            reportSoldePrecedent = parseFloat(reportSoldePrecedent.split('€')[0].trim());

            nombrePolicesSurLaPeriode = data.filter((element) => {
                return element.match(/Nombre de polices sur la période.+/)
            });
            nombrePolicesSurLaPeriode = parseInt(nombrePolicesSurLaPeriode[0].split(':')[1].trim());
            if (isNaN(nombrePolicesSurLaPeriode)) {
                nombrePolicesSurLaPeriode = '';
            }

            primesEncaisseesSurLaPeriode = data.filter((element) => {
                return element.match(/Total des primes encaissées sur la période.+/)
            });
            primesEncaisseesSurLaPeriode = primesEncaisseesSurLaPeriode[0].split(':')[1].trim();
            primesEncaisseesSurLaPeriode = parseFloat(primesEncaisseesSurLaPeriode.split('€')[0].trim());

            stCommissionsCalculeesSurLaPeriode = data.filter((element) => {
                return element.match(/.+commissions calculées sur la période.+/)
            });
            stCommissionsCalculeesSurLaPeriode = stCommissionsCalculeesSurLaPeriode[0].split(':')[1].trim();
            stCommissionsCalculeesSurLaPeriode = parseFloat(stCommissionsCalculeesSurLaPeriode.split('€')[0].trim());

            stCommissionsReprisesSurLaPeriode = data.filter((element) => {
                return element.match(/.+commissions reprises sur la période.+/)
            });
            stCommissionsReprisesSurLaPeriode = stCommissionsReprisesSurLaPeriode[0].split(':')[1].trim();
            stCommissionsReprisesSurLaPeriode = parseFloat(stCommissionsReprisesSurLaPeriode.split('€')[0].trim());

            stCommissionsDeduitesSurLaPeriode = data.filter((element) => {
                return element.match(/.+commissions déduites sur la période.+/)
            });
            stCommissionsDeduitesSurLaPeriode = stCommissionsDeduitesSurLaPeriode[0].split(':')[1].trim();
            stCommissionsDeduitesSurLaPeriode = parseFloat(stCommissionsDeduitesSurLaPeriode.split('€')[0].trim());

            stOperationsDiversesSurLaPeriode = data.filter((element) => {
                return element.match(/.+opérations diverses sur la période.+/)
            });
            stOperationsDiversesSurLaPeriode = stOperationsDiversesSurLaPeriode[0].split(':')[1].trim();
            stOperationsDiversesSurLaPeriode = parseFloat(stOperationsDiversesSurLaPeriode.split('€')[0].trim());

            totalCommissionsDues = data.filter((element) => {
                return element.match(/.+commissions dues.+/)
            });
            totalCommissionsDues = totalCommissionsDues[0].split(':')[1].trim();
            totalCommissionsDues = parseFloat(totalCommissionsDues.split('€')[0].trim());
            totalCommissionsDues = isNaN(totalCommissionsDues) ?
                (reportSoldePrecedent + stCommissionsCalculeesSurLaPeriode + stCommissionsDeduitesSurLaPeriode + stCommissionsReprisesSurLaPeriode + stOperationsDiversesSurLaPeriode) :
                totalCommissionsDues;
            syntheseDesCommissions = {
                periodeEncaissement,
                codeApporteurBeneficiaireCommissions,
                codeApporteurEmetteur,
                reportSoldePrecedent,
                nombrePolicesSurLaPeriode,
                primesEncaisseesSurLaPeriode,
                stCommissionsCalculeesSurLaPeriode,
                stCommissionsReprisesSurLaPeriode,
                stCommissionsDeduitesSurLaPeriode,
                stOperationsDiversesSurLaPeriode,
                totalCommissionsDues
            };
            infos.syntheseDesCommissions = syntheseDesCommissions;
        } else {
            let contrats = [];
            for (let text of textFile) {
                if (text.length === 11) {
                    const contrat = {
                        contrat: {
                            police: fs.readFileSync(text[0], { encoding: 'utf-8' }).trim().replace(/\n/g, ' '),
                            assure: fs.readFileSync(text[1], { encoding: 'utf-8' }).trim().replace(/\n/g, ' '),
                            produit: fs.readFileSync(text[2], { encoding: 'utf-8' }).trim().replace(/\n/g, ' '),
                        },
                        prime: {
                            fractionnement: fs.readFileSync(text[3], { encoding: 'utf-8' }).trim().replace(/\n/g, ' '),
                            periode: fs.readFileSync(text[4], { encoding: 'utf-8' }).trim().replace(/\n/g, ' '),
                            etat: fs.readFileSync(text[5], { encoding: 'utf-8' }).trim().replace(/\n/g, ' '),
                            montant: fs.readFileSync(text[6], { encoding: 'utf-8' }).trim().replace(/\n/g, ' '),
                        },
                        commission: {
                            mode: fs.readFileSync(text[7], { encoding: 'utf-8' }).trim().replace(/\n/g, ' '),
                            taux: fs.readFileSync(text[8], { encoding: 'utf-8' }).trim().replace(/\n/g, ' ').replace(/ /g, ''),
                            status: fs.readFileSync(text[9], { encoding: 'utf-8' }).trim().replace(/\n/g, ' ').replace(/ /g, ''),
                            montant: fs.readFileSync(text[10], { encoding: 'utf-8' }).trim().replace(/\n/g, ' ').replace(/ /g, '')
                        }
                    };
                    contrat.contrat.police = contrat.contrat.police.replace('$', 'S');
                    contrat.contrat.assure = contrat.contrat.assure;
                    contrat.contrat.produit = contrat.contrat.produit;
                    contrat.prime.fractionnement = contrat.prime.fractionnement.replace();
                    contrat.prime.periode = contrat.prime.periode.replace();
                    contrat.prime.etat = contrat.prime.etat.replace();
                    contrat.prime.montant = parseFloat(contrat.prime.montant.replace(/[^\d]*(\d+,+\d+)€*/, '$1').replace(',', '.'));
                    contrat.commission.mode = contrat.commission.mode;
                    contrat.commission.taux = contrat.commission.taux;
                    contrat.commission.status = contrat.commission.status;
                    contrat.commission.montant = parseFloat(contrat.commission.montant.replace(/[^\d]*(\d+,+\d+)€*/, '$1').replace(',', '.'));
                    contrats.push(contrat);
                }
                if (text.length === 5) {
                    const sousTotalPolice = {
                        police: fs.readFileSync(text[2], { encoding: 'utf-8' }).trim().replace(/\n/g, ' ').replace(/ /g, ''),
                        sousTotalPolice: fs.readFileSync(text[4], { encoding: 'utf-8' }).trim().replace(/\n/g, ' ').replace(/ /g, ''),
                    };
                    sousTotalPolice.police = sousTotalPolice.police.replace('$', 'S');
                    sousTotalPolice.sousTotalPolice = parseFloat(sousTotalPolice.sousTotalPolice.replace(/[^\d]*(\d+,+\d+)€*/, '$1').replace(',', '.'));
                    contrats.push(sousTotalPolice);
                    infos.detailDesPolices.push(contrats);
                    contrats = [];
                }

            }
        }
        i++;
    }

    let headers = { firstHeaders: null, secondHeader: null };
    headers.firstHeaders = ['CONTRAT', 'PRIME', 'COMMISSION'];
    headers.secondHeader = [
        'Police',
        'Assure',
        'Produit',
        'Fractionnement',
        'Periode',
        'Etat',
        'Montant',
        'Mode',
        'Taux',
        'Status',
        'Montant'
    ];
    let ocr = { headers, infos, executionTime: 0, executionTimeMS: 0 };
    const readBordereauMETLIFEStopTime = performance.now();
    const executionTimeMS = readBordereauMETLIFEStopTime - readBordereauMETLIFEStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log('Read bordereau METLIFE time : ', executionTime);
    return ocr;
}
