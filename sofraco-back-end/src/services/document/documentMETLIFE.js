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

exports.readPdfMETLIFE = async (file) => {
    try {
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
        console.log(`${new Date()} IMAGES LENGTH ${imagesPDF.length}`);
        try {
            await treatmentImagesMetlife(imagesPDF, infos);
        } catch (err) {
            throw err;
        }
        const excecutionStopTime = performance.now();
        let executionTimeMS = excecutionStopTime - excecutionStartTime;
        infos.executionTime = time.millisecondToTime(executionTimeMS);
        infos.executionTimeMS = executionTimeMS;
        console.log('Total Execution time : ', infos.executionTime);
        console.log(`${new Date()} FIN TRAITEMENT METLIFE`);
        return infos;
    } catch (err) {
        throw err;
    }
};

const treatmentImagesMetlife = async (imagesPDF, infos) => {
    let numBordereau = 1;
    try {
        for (let images of imagesPDF) {
            // pathToPDF = path.join(__dirname, '..', '..', '..', 'documents', 'splited_PDF', pathToPDF);
            let useFiles = false;
            let allTextFiles = [];
            let allTxtFiles = [];
            if (useFiles) {
                console.log(`${new Date()} DEBUT IMPORTER LINES METLIFE`);
                allTextFiles = fs.readFileSync(path.join(__dirname, 'apiviatxtfile.json'), { encoding: 'utf-8' });
                allTextFiles = JSON.parse(allTextFiles);
                console.log(`${new Date()} FIN IMPORTER LINES METLIFE`);
            } else {
                console.log(`${new Date()} DEBUT TRAITEMENT IMAGES METLIFE`);
                console.log(`------ Bordereau numero : ${numBordereau} ------`);
                const { allFilesFromOpenCV, imageFirstPage } = await openCVTreatmentMetlife(images)
                console.log(`${new Date()} FIN TRAITEMENT IMAGES METLIFE`);
                const allFilesFromFirstPage = getTextFromImages([imageFirstPage]);
                fileService.deleteFile(imageFirstPage);
                allTextFiles.push(allFilesFromFirstPage[0]);
                console.log(`${new Date()} DEBUT RECUPERATION TEXTE METLIFE`);
                allTxtFiles = getAllTextFiles(allFilesFromOpenCV, allTextFiles);
                console.log(`${new Date()} FIN RECUPERATION TEXTE METLIFE`);
            }
            const infoBordereau = readBordereauMETLIFE(allTxtFiles);
            infos.infos.push(infoBordereau);
            numBordereau++;
        }
    } catch (err) {
        throw err;
    }
}

const openCVTreatmentMetlife = async (images) => {
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
    return { allFilesFromOpenCV, imageFirstPage };
};

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

const getAllTextFiles = (allFilesFromOpenCV, allTextFiles) => {
    for (let files of allFilesFromOpenCV) {
        let i = 0;
        let contratTextsFiles = [];
        for (let file of files) {
            if (i > 1) {
                const textFilePaths = getTextFromImages(file);
                fileService.deleteFile(file);
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
    const allTxtFiles = allTextFiles;
    return allTxtFiles;
};

const readBordereauMETLIFE = (textFilePath) => {
    try {
        const readBordereauMETLIFEStartTime = performance.now();
        let infos = { syntheseDesCommissions: null, detailDesPolices: [] };
        let i = 0;
        for (let textFile of textFilePath) {
            if (i === 0) {
                const syntheseDesCommissions = readSyntheseCommissionsBordereauMETLIFE(textFile, redefinition);
                infos.syntheseDesCommissions = syntheseDesCommissions;
            } else {
                const detailDesPolices = readDetailsPolicesBordereauMETLIFE(textFile);
                infos.detailDesPolices.push(detailDesPolices);
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
    } catch (err) {
        throw err;
    }
};

const readSyntheseCommissionsBordereauMETLIFE = (textFile, redefinition) => {
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
    periodeEncaissement = data[redefinition.reIndexOf(data, /P??riode d'encaissement du/) + 1];
    codeApporteurBeneficiaireCommissions = data[redefinition.reIndexOf(data, /Code apporteur b??n??ficiaire des commissions/) + 1];
    codeApporteurEmetteur = data[redefinition.reIndexOf(data, /Code apporteur ??metteur/) + 1];
    reportSoldePrecedent = data.filter((element) => {
        return element.match(/Report solde pr??c??dent.+/)
    });
    reportSoldePrecedent = reportSoldePrecedent[0].split(':')[1].trim();
    reportSoldePrecedent = parseFloat(reportSoldePrecedent.split('???')[0].trim());

    nombrePolicesSurLaPeriode = data.filter((element) => {
        return element.match(/Nombre de polices sur la p??riode.+/)
    });
    nombrePolicesSurLaPeriode = parseInt(nombrePolicesSurLaPeriode[0].split(':')[1].trim());
    if (isNaN(nombrePolicesSurLaPeriode)) {
        nombrePolicesSurLaPeriode = '';
    }

    primesEncaisseesSurLaPeriode = data.filter((element) => {
        return element.match(/Total des primes encaiss??es sur la p??riode.+/)
    });
    primesEncaisseesSurLaPeriode = primesEncaisseesSurLaPeriode[0].split(':')[1].trim();
    primesEncaisseesSurLaPeriode = parseFloat(primesEncaisseesSurLaPeriode.split('???')[0].trim());

    stCommissionsCalculeesSurLaPeriode = data.filter((element) => {
        return element.match(/.+commissions calcul??es sur la p??riode.+/)
    });
    stCommissionsCalculeesSurLaPeriode = stCommissionsCalculeesSurLaPeriode[0].split(':')[1].trim();
    stCommissionsCalculeesSurLaPeriode = parseFloat(stCommissionsCalculeesSurLaPeriode.split('???')[0].trim());

    stCommissionsReprisesSurLaPeriode = data.filter((element) => {
        return element.match(/.+commissions reprises sur la p??riode.+/)
    });
    stCommissionsReprisesSurLaPeriode = stCommissionsReprisesSurLaPeriode[0].split(':')[1].trim();
    stCommissionsReprisesSurLaPeriode = parseFloat(stCommissionsReprisesSurLaPeriode.split('???')[0].trim());

    stCommissionsDeduitesSurLaPeriode = data.filter((element) => {
        return element.match(/.+commissions d??duites sur la p??riode.+/)
    });
    stCommissionsDeduitesSurLaPeriode = stCommissionsDeduitesSurLaPeriode[0].split(':')[1].trim();
    stCommissionsDeduitesSurLaPeriode = parseFloat(stCommissionsDeduitesSurLaPeriode.split('???')[0].trim());

    stOperationsDiversesSurLaPeriode = data.filter((element) => {
        return element.match(/.+op??rations diverses sur la p??riode.+/)
    });
    stOperationsDiversesSurLaPeriode = stOperationsDiversesSurLaPeriode[0].split(':')[1].trim();
    stOperationsDiversesSurLaPeriode = parseFloat(stOperationsDiversesSurLaPeriode.split('???')[0].trim());

    totalCommissionsDues = data.filter((element) => {
        return element.match(/.+commissions dues.+/)
    });
    totalCommissionsDues = totalCommissionsDues[0].split(':')[1].trim();
    totalCommissionsDues = parseFloat(totalCommissionsDues.split('???')[0].trim());
    totalCommissionsDues = isNaN(totalCommissionsDues) ?
        (reportSoldePrecedent + stCommissionsCalculeesSurLaPeriode + stCommissionsDeduitesSurLaPeriode + stCommissionsReprisesSurLaPeriode + stOperationsDiversesSurLaPeriode) :
        totalCommissionsDues;
    const syntheseDesCommissions = {
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
    return syntheseDesCommissions;
};

const readDetailsPolicesBordereauMETLIFE = (textFile) => {
    let detailDesPolices = [];
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
            contrat.prime.fractionnement = contrat.prime.fractionnement;
            contrat.prime.periode = contrat.prime.periode;
            contrat.prime.etat = contrat.prime.etat;
            contrat.prime.montant = parseFloat(contrat.prime.montant.replace(/[^\d]*(\d+,+\d+)???*/, '$1').replace(',', '.'));
            contrat.commission.mode = contrat.commission.mode;
            contrat.commission.taux = contrat.commission.taux;
            contrat.commission.status = contrat.commission.status;
            contrat.commission.montant = parseFloat(contrat.commission.montant.replace(/[^\d]*(\d+,+\d+)???*/, '$1').replace(',', '.'));
            contrats.push(contrat);
        }
        if (text.length === 5) {
            const sousTotalPolice = {
                police: fs.readFileSync(text[2], { encoding: 'utf-8' }).trim().replace(/\n/g, ' ').replace(/ /g, ''),
                sousTotalPolice: fs.readFileSync(text[4], { encoding: 'utf-8' }).trim().replace(/\n/g, ' ').replace(/ /g, ''),
            };
            sousTotalPolice.police = sousTotalPolice.police.replace('$', 'S');
            sousTotalPolice.sousTotalPolice = parseFloat(sousTotalPolice.sousTotalPolice.replace(/[^\d]*(\d+,+\d+)???*/, '$1').replace(',', '.'));
            contrats.push(sousTotalPolice);
            detailDesPolices = contrats;
            contrats = [];
        }
    }
    return detailDesPolices;
};
