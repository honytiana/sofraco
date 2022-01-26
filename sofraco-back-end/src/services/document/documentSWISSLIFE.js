const { performance } = require('perf_hooks');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const time = require('../utils/time');
const fileService = require('../utils/files');
const pdfService = require('../utils/pdfFile');
const redefinition = require('../utils/redefinition');
const generals = require('../utils/generals');
const excelFile = require('../utils/excelFile');
const errorHandler = require('../utils/errorHandler');

const { workerData, parentPort } = require('worker_threads');
if (parentPort !== null) {
    parentPort.postMessage({ swisslife: workerData });
}

exports.readPdfSLADE = async (file) => {
    let infos = { executionTime: 0, infos: [] };
    console.log(`${new Date()} DEBUT TRAITEMENT SLADE`);
    const excecutionStartTime = performance.now();
    const images = await pdfService.convertPDFToImg(file);
    // const textFilePaths = fs.readdirSync(path.join(__dirname, '..', '..', '..', 'documents', 'texte'));
    const textFilePaths = getTextFromImages(images);
    const infoBordereau = readBordereauSLADE(textFilePaths);
    infos.infos.push(infoBordereau);
    const excecutionStopTime = performance.now();
    let executionTimeMS = excecutionStopTime - excecutionStartTime;
    executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    infos.executionTime = executionTime;
    infos.executionTimeMS = executionTimeMS;
    console.log(`${new Date()} FIN TRAITEMENT SLADE`);
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

const readBordereauSLADE = (textFilePaths) => {
    const readBordereauSLADEStartTime = performance.now();
    let infos = {
        syntheseDesCommissions: {
            periodeConcernee: null,
            codeApporteur: null,
            referenceBordereau: null,
            nombrePrimeSurLaPeriode: null,
            totalPrimesEncaisseesSurLaPeriode: null,
            totalCommissionsCalculeesSurLaPeriode: null,
            reportSoldePrecedent: null,
            totalCommissionsDues: null
        },
        detailDesPolices: []
    };
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
            infos.syntheseDesCommissions.periodeConcernee = data[redefinition.reIndexOf(data, /Période concernée/) + 1];
            infos.syntheseDesCommissions.codeApporteur = (data[redefinition.reIndexOf(data, /Code apporteur/) + 1]).match(/^\d+$/) ?
                data[redefinition.reIndexOf(data, /Code apporteur/) + 1] :
                data[redefinition.reIndexOf(data, /Code apporteur/) + 2];
            infos.syntheseDesCommissions.referenceBordereau = data[redefinition.reIndexOf(data, /Référence bordereau/) + 2];
            infos.syntheseDesCommissions.nombrePrimeSurLaPeriode = (data[redefinition.reIndexOf(data, /Nombre de primes sur la période/) - 1].match(/^\d$/)) ?
                data[redefinition.reIndexOf(data, /Nombre de primes sur la période/) - 1] : '';
            infos.syntheseDesCommissions.totalPrimesEncaisseesSurLaPeriode = data[redefinition.reIndexOf(data, /Total des primes encaissées sur la période/) + 1];
            infos.syntheseDesCommissions.totalCommissionsCalculeesSurLaPeriode = data[redefinition.reIndexOf(data, /Total des commissions calculées sur la période/) + 1];
            infos.syntheseDesCommissions.reportSoldePrecedent = data[redefinition.reIndexOf(data, /Report solde précédent/) + 1];
            infos.syntheseDesCommissions.totalCommissionsDues = data[redefinition.reIndexOf(data, /Total des commissions dues/) + 1];
            data.splice(data.indexOf(infos.syntheseDesCommissions.periodeConcernee), 1);
            data.splice(data.indexOf(infos.syntheseDesCommissions.codeApporteur), 1);
            data.splice(data.indexOf(infos.syntheseDesCommissions.referenceBordereau), 1);
            if (infos.syntheseDesCommissions.nombrePrimeSurLaPeriode !== '') {
                data.splice(data.indexOf(infos.syntheseDesCommissions.nombrePrimeSurLaPeriode), 1);
            }
            data.splice(data.indexOf(infos.syntheseDesCommissions.totalPrimesEncaisseesSurLaPeriode), 1);
            data.splice(data.indexOf(infos.syntheseDesCommissions.totalCommissionsCalculeesSurLaPeriode), 1);
            data.splice(data.indexOf(infos.syntheseDesCommissions.reportSoldePrecedent), 1);
            data.splice(data.indexOf(infos.syntheseDesCommissions.totalCommissionsDues), 1);
        }
        if (numero === '1' || numero === '2') {
            const indexfirstCode = redefinition.reIndexOf(data, /^\d+$/);
            let details = [];
            if (data[indexfirstCode - 1].match(/^(du \d{1,2}[/]\d{1,2}[/]\d{1,4} au)$/) &&
                data[indexfirstCode - 2].match(/^(du \d{1,2}[/]\d{1,2}[/]\d{1,4} au)$/)) {
                details = data.slice(indexfirstCode - 2);
            }
            else {
                details = data.slice(indexfirstCode);
            }
            let newDetails = [];
            const maxI = details.length / 4;
            for (let i = 0; i < maxI; i++) {
                let contrat = [];
                if (details.length > 0) {
                    const indexCode = redefinition.reIndexOf(details, /^\d+$/);
                    contrat.push(details[indexCode]);
                    details.splice(indexCode, 1);
                    let lastIndexUtil = redefinition.reIndexOf(details, /^\d+$/);
                    if (lastIndexUtil > 0) {
                        if (details[lastIndexUtil - 1].match(/^(du \d{1,2}[/]\d{1,2}[/]\d{1,4} au)$/)) {
                            lastIndexUtil = lastIndexUtil - 2;
                        }
                        for (let j = 0; j < lastIndexUtil; j++) {
                            contrat.push(details[j]);
                        }
                    } else {
                        contrat = [...contrat, ...details];
                    }
                    details.splice(0, contrat.length - 1);
                    newDetails.push(contrat);
                } else {
                    break;
                }
            }

            for (let newDetail of newDetails) {
                let detailsPolice = {
                    agence: {
                        code: null,
                        nom: null
                    },
                    contrat: {
                        police: null,
                        assure: null,
                        produit: null,
                        dateEffet: null
                    },
                    prime: {
                        periode: null,
                        periodicite: null,
                        montantPreleveTTC: null
                    },
                    commissions: {
                        periode: null,
                        mode: null,
                        montantBaseHT: null,
                        taux: null,
                        montant: null
                    }
                }
                const rNomPoliceAssure = /^([^\d]+)([\d]+( [\d]*)*)([^\d]*)$/i;
                const rAssure = /^(([a-z']+\s*)+)$/i;
                const rDateEffet = /^(\d{1,2}[/]\d{1,2}[/]\d{1,4})$/;
                const rPrimePeriode = /^(du \d{1,2}[/]\d{1,2}[/]\d{1,4} au)$/;
                const rPeriodiciteMensuel = /^(mensuel)$/i;
                const rPeriodiciteAnnuel = /^(annuel)$/i;
                const rCommissionLineaire = /^(linéaire)$/i;
                const rCommissionEscompt = /^(escompté)/i;
                const rCommissionRembours = /^(rembours)/i;
                const rContratProduit = /^(slade .+)$/i;
                const rMontants = /^(\d+,*\d* *€)$/;
                const rTaux = /^(\d+,*\d* *%)$/;
                detailsPolice.agence.code = newDetail[0];
                newDetail.splice(0, 1);
                let dates = [];
                let montants = [];
                for (let element of newDetail) {
                    if (element.match(rPeriodiciteMensuel)) {
                        detailsPolice.prime.periodicite = element.replace(rPeriodiciteMensuel, '$1');
                        continue;
                    }
                    if (element.match(rPeriodiciteAnnuel)) {
                        detailsPolice.prime.periodicite = element.replace(rPeriodiciteAnnuel, '$1');
                        continue;
                    }
                    if (element.match(rCommissionLineaire)) {
                        detailsPolice.commissions.mode = element.replace(rCommissionLineaire, '$1');
                        continue;
                    }
                    if (element.match(rCommissionEscompt)) {
                        detailsPolice.commissions.mode = element.replace(rCommissionEscompt, '$1');
                        continue;
                    }
                    if (element.match(rCommissionRembours)) {
                        detailsPolice.commissions.mode = element.replace(rCommissionRembours, '$1');
                        continue;
                    }
                    if (element.match(rAssure)) {
                        detailsPolice.contrat.assure = `${(detailsPolice.contrat.assure) ? detailsPolice.contrat.assure : ''} ${element.replace(rAssure, '$1')}`;
                        continue;
                    }
                    if (element.match(rContratProduit)) {
                        detailsPolice.contrat.produit = element.replace(rContratProduit, '$1');
                        continue;
                    }
                    if (element.match(rNomPoliceAssure)) {
                        detailsPolice.agence.nom = element.replace(rNomPoliceAssure, '$1');
                        detailsPolice.contrat.police = element.replace(rNomPoliceAssure, '$2');
                        detailsPolice.contrat.assure = element.replace(rNomPoliceAssure, '$4');
                        continue;
                    }
                    if (element.match(rDateEffet)) {
                        dates.push(element.replace(rDateEffet, '$1'));
                        continue;
                    }
                    if (element.match(rPrimePeriode)) {
                        dates.push(element.replace(rPrimePeriode, '$1'));
                        continue;
                    }
                    if (element.match(rMontants)) {
                        montants.push(element.replace(rMontants, '$1'));
                        continue;
                    }
                    if (element.match(rTaux)) {
                        detailsPolice.commissions.taux = element.replace(rTaux, '$1');
                        continue;
                    }

                    if (element.length > 10) {

                        // allMontantsEtTaux = allMontantsEtTaux.map((mt, index) => {
                        //     let newMt = []
                        //     mt.forEach((m, i) => {
                        //         m = m.replace('~', '-');
                        //         m = m.replace(/\s/, '');
                        //         newMt.push(parseFloat(m));
                        //     })
                        //     return newMt;
                        // });

                        // let montantsTaux = [];
                        // allMontantsEtTaux.forEach((mt, index) => {
                        //     const montantPrime = mt[0];
                        //     const taux = mt[1];
                        //     const montantCommission = mt[2];
                        //     const vmontantCommission = parseFloat(((montantPrime * taux) / 100).toFixed(2));
                        //     let verificationMontantCommission;
                        //     if (Math.abs(vmontantCommission) === Math.abs(montantCommission) ||
                        //         (Math.abs(vmontantCommission) + 0.01) === Math.abs(montantCommission) ||
                        //         (Math.abs(vmontantCommission) - 0.01) === Math.abs(montantCommission)) {
                        //         verificationMontantCommission = true;
                        //     } else {
                        //         verificationMontantCommission = false;
                        //     }
                        //     const montants = {
                        //         montantPrime,
                        //         taux,
                        //         montantCommission,
                        //         verificationMontantCommission
                        //     };
                        //     montantsTaux.push(montants);
                        // });

                        // for (let i = 0; i < policesLength; i++) {
                        //     const contrat = {
                        //         police: polices[i],
                        //         assure: assures[i],
                        //         produit: produits[i]
                        //     };
                        //     const prime = {
                        //         fractionnement: fractionnements[i],
                        //         periode: `${allperiodes[i][0]} ${allperiodes[i][1]}`,
                        //         etat: etats[i],
                        //         montant: montantsTaux[i].montantPrime
                        //     };
                        //     let commissions = {
                        //         mode: modes[i],
                        //         taux: montantsTaux[i].taux,
                        //         status: status[i],
                        //         montant: montantsTaux[i].montantCommission,
                        //         verificationMontantCommission: montantsTaux[i].verificationMontantCommission
                        //     };
                        //     dPolices.push({
                        //         contrat,
                        //         prime,
                        //         commissions
                        //     });

                        // }
                        // let mtcommissions = [];
                        // dPolices.forEach((e, i) => {
                        //     mtcommissions.push(e.commissions.montant);
                        // })
                        // let vsTPoliceMonant = mtcommissions.reduce((previous, current) => {
                        //     return previous + current;
                        // });
                        // const vsousTotalPoliceMonant = vsTPoliceMonant.toFixed(2);
                        // let verifSousTotalPoliceMonant;
                        // if (parseFloat(vsousTotalPoliceMonant) === sousTotalPoliceMontant ||
                        //     parseFloat(vsousTotalPoliceMonant) + 0.01 === sousTotalPoliceMontant ||
                        //     parseFloat(vsousTotalPoliceMonant) - 0.01 === sousTotalPoliceMontant) {
                        //     verifSousTotalPoliceMonant = true;
                        // } else {
                        //     verifSousTotalPoliceMonant = false;
                        // }

                        // dDPolice.push({ police: dPolices, sousTotalPolice, sousTotalPoliceMontant, verifSousTotalPoliceMonant });
                    }
                }
                if (dates[0].match(rDateEffet)) {
                    detailsPolice.contrat.dateEffet = dates[0];
                    detailsPolice.prime.periode = `${dates[1]} ${dates[3]}`;
                    detailsPolice.commissions.periode = `${dates[2]} ${dates[4]}`;
                } else {
                    detailsPolice.contrat.dateEffet = dates[2];
                    detailsPolice.prime.periode = `${dates[0]} ${dates[3]}`;
                    detailsPolice.commissions.periode = `${dates[1]} ${dates[4]}`;
                }
                detailsPolice.prime.montantPreleveTTC = montants[0];
                detailsPolice.commissions.montantBaseHT = montants[1];
                detailsPolice.commissions.montant = montants[2];
                infos.detailDesPolices.push(detailsPolice);
            }
        }
    }
    const readBordereauSLADEStopTime = performance.now();
    const executionTimeMS = readBordereauSLADEStopTime - readBordereauSLADEStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Read bordereau SLADE time : ', executionTime);
    return infos;
}

exports.readExcelSWISSLIFESURCO = async (file) => {
    console.log(`${new Date()} DEBUT TRAITEMENT SWISSLIFE SURCO`);
    const excecutionStartTime = performance.now();
    const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
    let headers = [];
    let allContrats = [];
    let errors = [];
    let ocr = { headers: null, allContratsPerCourtier: [], executionTime: 0 };
    const arrReg = {
        apporteurVente: /^Apporteur\s*de\s*la\s*vente$/i,
        dateComptabVente: /^Date\s*comptab.\s*de\s*la\s*vente$/i,
        numeroPolice: /^N°\s*de\s*police$/i,
        codeProduit: /^Code\s*produit$/i,
        nomClient: /^Nom\s*du\s*Client$/i,
        cotisationPonderee: /^Cotisation\s*pondérée$/i,
        montantPP: /^Montant\s*PP$/i,
        dontParUCsurPP: /^Dont\s*part\s*UC\s*sur\s*PP$/i,
        montantPU: /^Montant\s*PU$/i,
        dontParUCsurPU: /^Dont\s*part\s*UC\s*sur\s*PU$/i,
        tauxChargement: /^Taux\s*de\s*chargement$/i,
        avanceSurco: /^Avance\s*surco\s*20%$/i,
        incompressible: /^incompressible$/i,
        avanceComprisRepriseIncompressible: /^avance\s*y\s*compris\s*reprise\s*incompressbile$/i,
    };	

    for (let worksheet of worksheets) {
        if (worksheet.name === worksheets[0].name ||
            worksheet.name === worksheets[1].name ||
            worksheet.name === worksheets[2].name ||
            worksheet.name === worksheets[4].name) {
            let rowNumberHeader;
            let indexesHeader = {
                apporteurVente: null,
                dateComptabVente: null,
                numeroPolice: null,
                codeProduit: null,
                nomClient: null,
                cotisationPonderee: null,
                montantPP: null,
                dontParUCsurPP: null,
                montantPU: null,
                dontParUCsurPU: null,
                tauxChargement: null,
                avanceSurco: null,
                incompressible: null,
                avanceComprisRepriseIncompressible: null
            }
            worksheet.eachRow((row, rowNumber) => {
                if (typeof row.getCell('A').value === 'string' && row.getCell('A').value.match(/Apporteur/i)) {
                    rowNumberHeader = rowNumber;
                    row.eachCell((cell, colNumber) => {
                        const currentCellValue = (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim().replace(/\n/g, ' ') : cell.value.replace(/\n/g, ' ');
                        if (headers.indexOf(currentCellValue) < 0) {
                            headers.push(currentCellValue);
                            generals.setIndexHeaders(cell, colNumber, arrReg, indexesHeader);
                        }
                    });
                    for (let index in indexesHeader) {
                        if (indexesHeader[index] === null) {
                            errors.push(errorHandler.errorReadExcelSWISSLIFESURCO(index));
                        }
                    }
                }
                if (rowNumber > rowNumberHeader) {
                    const {contrat, error} = generals.createContratSimpleHeader(row, indexesHeader);
                    for (let err of error) {
                        errors.push(errorHandler.errorEmptyCell('SWISSLIFE SURCO', err));
                    }
                    allContrats.push(contrat);
                }
            })
        }
    }

    let allContratsPerCourtier = [];
    let courtiers = [];
    allContrats.forEach((element, index) => {
        if (!element.apporteurVente.match(/total/i)) {
            const courtier = { code: element.apporteurVente, libelle: element.apporteurVente };
            if (!courtiers.some(c => { return c.code === courtier.code })) {
                courtiers.push(courtier);
            }
        }
    })
    for (let courtier of courtiers) {
        let contratCourtier = {
            courtier: courtier,
            contrats: []
        };
        allContrats.forEach((element, index) => {
            if (element.apporteurVente === contratCourtier.courtier.code) {
                contratCourtier.contrats.push(element);
            }
        });
        allContratsPerCourtier.push(contratCourtier);
    }

    ocr = { headers, allContratsPerCourtier, errors, executionTime: 0, executionTimeMS: 0 };
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log(`${new Date()} FIN TRAITEMENT SWISSLIFE SURCO`);
    return ocr;
};

