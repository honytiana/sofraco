const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const { performance } = require('perf_hooks');
const { exec, execSync, spawnSync } = require('child_process');
const easyOCR = require('../easyOCR/easyOCR');
const fs = require('fs');
const path = require('path');
const time = require('../time/time');
const fileService = require('./files');
const pdfService = require('./pdfFile');

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

exports.readPdfSLADE = async (file) => {
    let infos = { executionTime: 0, infos: [] };
    console.log('DEBUT TRAITEMENT SLADE');
    const excecutionStartTime = performance.now();
    // const images = await pdfService.convertPDFToImg(file);
    const textFilePaths = fs.readdirSync(path.join(__dirname, '..', '..', '..', 'documents', 'texte'));
    // const textFilePaths = getTextFromImages(images);
    const infoBordereau = readBordereauSLADE(textFilePaths);
    infos.infos.push(infoBordereau);
    const excecutionStopTime = performance.now();
    let executionTimeMS = excecutionStopTime - excecutionStartTime;
    executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    infos.executionTime = executionTime;
    infos.executionTimeMS = executionTimeMS;
    console.log('FIN TRAITEMENT SLADE');
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
        detailDesPolices: null
    };
    let dDPolice = [];
    for (let textFilePath of textFilePaths) {
        textFilePath = path.join(__dirname, '..', '..', '..', 'documents', 'texte', textFilePath);
        const content = fs.readFileSync(textFilePath, { encoding: 'utf-8' });
        let data = content.split('\n');
        data = data.filter((element) => {
            return element.trim() !== '';
        });
        const fileNameWithoutExtension = fileService.getFileNameWithoutExtension(textFilePath);
        const nameArr = fileNameWithoutExtension.split('_');
        const numero = nameArr[nameArr.length - 1];
        if(numero === '1') {
            infos.syntheseDesCommissions.periodeConcernee = data[reIndexOf(data, /Période concernée/) + 1];
            infos.syntheseDesCommissions.codeApporteur = data[reIndexOf(data, /Code apporteur/) + 1];
            infos.syntheseDesCommissions.referenceBordereau = data[reIndexOf(data, /Référence bordereau/) + 2];
            infos.syntheseDesCommissions.nombrePrimeSurLaPeriode = data[reIndexOf(data, /Nombre de primes sur la période/) - 1];
            infos.syntheseDesCommissions.totalPrimesEncaisseesSurLaPeriode = data[reIndexOf(data, /Total des primes encaissées sur la période/) + 1];
            infos.syntheseDesCommissions.totalCommissionsCalculeesSurLaPeriode = data[reIndexOf(data, /Total des commissions calculées sur la période/) + 1];
            infos.syntheseDesCommissions.reportSoldePrecedent = data[reIndexOf(data, /Report solde précédent/) + 1];
            infos.syntheseDesCommissions.totalCommissionsDues = data[reIndexOf(data, /Total des commissions dues/) + 1];
            data.splice(data.indexOf(infos.syntheseDesCommissions.periodeConcernee), 1);
            data.splice(data.indexOf(infos.syntheseDesCommissions.codeApporteur), 1);
            data.splice(data.indexOf(infos.syntheseDesCommissions.referenceBordereau), 1);
            data.splice(data.indexOf(infos.syntheseDesCommissions.nombrePrimeSurLaPeriode), 1);
            data.splice(data.indexOf(infos.syntheseDesCommissions.totalPrimesEncaisseesSurLaPeriode), 1);
            data.splice(data.indexOf(infos.syntheseDesCommissions.totalCommissionsCalculeesSurLaPeriode), 1);
            data.splice(data.indexOf(infos.syntheseDesCommissions.reportSoldePrecedent), 1);
            data.splice(data.indexOf(infos.syntheseDesCommissions.totalCommissionsDues), 1);
        }
        if (numero === '1' || numero === '2') {
            const firstCode = reIndexOf(data, /^\d+$/);
            const details = data.slice(firstCode);
            let newDetails = [];
            const maxI = details.length / 4;
            for (let i = 0; i < maxI; i++) {
                let contrat = [];
                if (details.length > 0) {
                    contrat.push(details[0]);
                    details.splice(0, 1);
                    const lastIndexUtil = reIndexOf(details, /^\d+$/);
                    if (lastIndexUtil > 0) {
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

            newDetails.forEach((element, index) => {
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
                let dPolices = [];
                const rNomPoliceAssure = /^([^\d]+)([\d]+( [\d]*)*)([^\d]*)$/i;
                const rDateEffet = /^(\d{1,2}[/]\d{1,2}[/]\d{1,4})$/;
                const rPrimePeriode = /^(du \d{1,2}[/]\d{1,2}[/]\d{1,4} au)$/;
                const rPeriodiciteMensuel = /^(mensuel)$/i;
                const rPeriodiciteAnnuel = /^(annuel)$/i;
                const rCommissionLineaire = /^(linéaire)$/i;
                const rCommissionEscompt = /^(escompté)/i;
                const rCommissionRembours = /^(rembours)/i;
                const rContratProduit = /^(slade .+)$/i;
                detailsPolice.agence.code = element[0];
                newDetails.splice(0, 1);
                if (element.match(rNomPoliceAssure)) {
                    detailsPolice.agence.nom = element.replace(rNomPoliceAssure, '$1');
                    detailsPolice.contrat.police = element.replace(rNomPoliceAssure, '$2');
                    detailsPolice.contrat.assure = element.replace(rNomPoliceAssure, '$3');
                    // continue;
                }
                if (element.match(rContratProduit)) {
                    detailsPolice.contrat.produit = element.replace(rContratProduit, '$1');
                    // continue;
                }
                if (element.match(rDateEffet)) {
                    detailsPolice.contrat.dateEffet = element.replace(rDateEffet, '$1');
                    newDetails.splice(index, 1);
                    // continue;
                }
                if (element.match(rPrimePeriode)) {
                    detailsPolice.prime.periode = element.replace(rPrimePeriode, '$1');
                    // continue;
                }
                if (element.match(rPeriodiciteMensuel)) {
                    detailsPolice.prime.periodicite = element.replace(rPeriodiciteMensuel, '$1');
                    // continue;
                }
                if (element.match(rPeriodiciteAnnuel)) {
                    detailsPolice.prime.periodicite = element.replace(rPeriodiciteAnnuel, '$1');
                    // continue;
                }
                if (element.match(rCommissionLineaire)) {
                    detailsPolice.commissions.mode = element.replace(rCommissionLineaire, '$1');
                    // continue;
                }
                if (element.match(rCommissionEscompt)) {
                    detailsPolice.commissions.mode = element.replace(rCommissionEscompt, '$1');
                    // continue;
                }
                if (element.match(rCommissionRembours)) {
                    detailsPolice.commissions.mode = element.replace(rCommissionRembours, '$1');
                    // continue;
                }
                if (element.length > 10) {
                    if (reIndexOf(element, /^a{1}$/i) > 0) {
                        element.splice(reIndexOf(element, /^a{1}$/i), 1);
                    }

                    const polices = element.filter((e, i) => {
                        return e.match(/^S\d+$/) || e.match(/^A\d+$/);
                    });
                    polices.forEach((p, i) => {
                        element.splice(element.indexOf(p), 1);
                    });
                    const policesLength = polices.length;

                    const chiffres = element.filter((e, i) => {
                        return e.match(/^[^a-z]{0,1}[\d\s]*\d+[.]{0,1}\d+\s*€*$/i);
                    });

                    let sousTotalPoliceMontant = chiffres[chiffres.length - 1];
                    element.splice(element.indexOf(sousTotalPoliceMontant), 1);
                    sousTotalPoliceMontant = sousTotalPoliceMontant.replace('~', '-');
                    sousTotalPoliceMontant = parseFloat(sousTotalPoliceMontant);
                    element.splice(reIndexOf(element, /Sous-total/i), 1);
                    const sousTotalPolice = polices[0];

                    chiffres.splice(chiffres.length - 1, 1);
                    chiffres.forEach((c, i) => {
                        element.splice(element.indexOf(c), 1);
                    });
                    let allMontantsEtTaux = [];
                    const maxLength = chiffres.length / 3;
                    for (let i = 0; i < maxLength; i++) {
                        if (chiffres.length > 0) {
                            const mt = chiffres.slice(0, 3);
                            chiffres.splice(0, 3);
                            allMontantsEtTaux.push(mt);
                        } else {
                            break;
                        }
                    }

                    const fractionnements = element.filter((e, i) => {
                        return e.match(/^annuel$/i) || e.match(/^mensuel$/i);
                    });
                    fractionnements.forEach((f, i) => {
                        element.splice(element.indexOf(f), 1);
                    });

                    const etats = element.filter((e, i) => {
                        return e.match(/^sold/i) || e.match(/^annul/i) || e.match(/^rembours/i);
                    });
                    etats.forEach((e, index) => {
                        if (etats.length > policesLength) {
                            if (e.match(/^sold/i)) {
                                etats.splice(index, 1);
                            }
                        }
                    })
                    etats.forEach((e, i) => {
                        element.splice(element.indexOf(e), 1);
                    });

                    const modes = element.filter((e, i) => {
                        return e.match(/^escompt/i) || e.match(/^linéaire$/i) || e.match(/^lineaire$/i) || e.match(/^lin[eé]?/i) || e.match(/^rembours/i);
                    });
                    modes.forEach((e, i) => {
                        element.splice(element.indexOf(e), 1);
                    });

                    let periodes = element.filter((e, i) => {
                        return e.match(/^du \d{1,2}[/]\d{1,2}[/]\d{1,4}/) ||
                            e.match(/^au \d{1,2}[/]\d{1,2}[/]\d{1,4}/) ||
                            e.match(/^du$/) ||
                            e.match(/^au$/) ||
                            e.match(/^\d{1,2}[/]\d{1,2}[/]\d{1,4}/);
                    });
                    periodes.forEach((p, i) => {
                        element.splice(element.indexOf(p), 1);
                    });
                    periodes.forEach((p, i) => {
                        if (p.match(/^du$/) ||
                            p.match(/^au$/)) {
                            let pr = `${p} ${periodes[i + 1]}`;
                            periodes.splice(periodes.indexOf(periodes[i + 1]), 1);
                            periodes.splice(periodes.indexOf(p), 1, pr);
                        }
                    })
                    let allperiodes = [];
                    const maxPeriodeLength = periodes.length / 2;
                    for (let i = 0; i < maxPeriodeLength; i++) {
                        if (periodes.length > 0) {
                            const period = periodes.slice(0, 2);
                            periodes.splice(0, 2);
                            allperiodes.push(period);
                        } else {
                            break;
                        }
                    }

                    const status = element.filter((e, i) => {
                        return e.match(/^sold/i) || e.match(/^reprise$/i) || e.match(/à payer/i) || e.match(/payer/i);
                    });
                    status.forEach((s, i) => {
                        element.splice(element.indexOf(s), 1);
                    });

                    const mots = element.slice();
                    mots.forEach((e, i) => {
                        if (e.match(/^M$/) || e.match(/^Mme$/)) {
                            const pronom = e;
                            const nom = mots[i + 1];
                            const name = `${pronom} ${nom}`;
                            mots.splice(mots.indexOf(pronom), 1);
                            mots.splice(mots.indexOf(nom), 1, name);
                        }
                    });
                    let allMots = [];
                    let lengthMots = mots.length;
                    for (let i = 0; i < policesLength; i++) {
                        if (mots.length > lengthMots / policesLength) {
                            let m = [];
                            m[0] = mots[0];
                            mots.splice(0, 1);
                            m.push(...mots.slice(0, reIndexOf(mots, /^M[me]{0,1}.+/)));
                            mots.splice(0, reIndexOf(mots, /^M[me]{0,1}.+/));
                            allMots.push(m);
                        } else {
                            let m = mots.slice();
                            mots.splice(mots.indexOf(m), 1);
                            allMots.push(m);
                        }
                    }

                    let assures = [];
                    let produits = [];
                    allMots.forEach((mots, index) => {
                        if (mots.length === 5) {
                            assures.push(`${mots[0]} ${mots[2]}`);
                            produits.push(`${mots[1]} ${mots[3]} ${mots[4]}`);
                        } else if (mots.length === 6) {
                            assures.push(`${mots[0]} ${mots[1]} ${mots[3]}`);
                            produits.push(`${mots[2]} ${mots[4]} ${mots[5]}`);
                        } else if (mots.length < 5) {
                            assures.push(`${mots[0]}`);
                            produits.push(`${mots[1]} ${mots[2]} ${mots[3]}`);
                        }
                    });

                    allMontantsEtTaux = allMontantsEtTaux.map((mt, index) => {
                        let newMt = []
                        mt.forEach((m, i) => {
                            m = m.replace('~', '-');
                            m = m.replace(/\s/, '');
                            newMt.push(parseFloat(m));
                        })
                        return newMt;
                    });

                    let montantsTaux = [];
                    allMontantsEtTaux.forEach((mt, index) => {
                        const montantPrime = mt[0];
                        const taux = mt[1];
                        const montantCommission = mt[2];
                        const vmontantCommission = parseFloat(((montantPrime * taux) / 100).toFixed(2));
                        let verificationMontantCommission;
                        if (Math.abs(vmontantCommission) === Math.abs(montantCommission) ||
                            (Math.abs(vmontantCommission) + 0.01) === Math.abs(montantCommission) ||
                            (Math.abs(vmontantCommission) - 0.01) === Math.abs(montantCommission)) {
                            verificationMontantCommission = true;
                        } else {
                            verificationMontantCommission = false;
                        }
                        const montants = {
                            montantPrime,
                            taux,
                            montantCommission,
                            verificationMontantCommission
                        };
                        montantsTaux.push(montants);
                    });

                    for (let i = 0; i < policesLength; i++) {
                        const contrat = {
                            police: polices[i],
                            assure: assures[i],
                            produit: produits[i]
                        };
                        const prime = {
                            fractionnement: fractionnements[i],
                            periode: `${allperiodes[i][0]} ${allperiodes[i][1]}`,
                            etat: etats[i],
                            montant: montantsTaux[i].montantPrime
                        };
                        let commissions = {
                            mode: modes[i],
                            taux: montantsTaux[i].taux,
                            status: status[i],
                            montant: montantsTaux[i].montantCommission,
                            verificationMontantCommission: montantsTaux[i].verificationMontantCommission
                        };
                        dPolices.push({
                            contrat,
                            prime,
                            commissions
                        });

                    }
                    let mtcommissions = [];
                    dPolices.forEach((e, i) => {
                        mtcommissions.push(e.commissions.montant);
                    })
                    let vsTPoliceMonant = mtcommissions.reduce((previous, current) => {
                        return previous + current;
                    });
                    const vsousTotalPoliceMonant = vsTPoliceMonant.toFixed(2);
                    let verifSousTotalPoliceMonant;
                    if (parseFloat(vsousTotalPoliceMonant) === sousTotalPoliceMontant ||
                        parseFloat(vsousTotalPoliceMonant) + 0.01 === sousTotalPoliceMontant ||
                        parseFloat(vsousTotalPoliceMonant) - 0.01 === sousTotalPoliceMontant) {
                        verifSousTotalPoliceMonant = true;
                    } else {
                        verifSousTotalPoliceMonant = false;
                    }

                    dDPolice.push({ police: dPolices, sousTotalPolice, sousTotalPoliceMontant, verifSousTotalPoliceMonant });
                }
            })
        }
        infos.detailDesPolices = dDPolice;
    }
    const readBordereauSLADEStopTime = performance.now();
    const executionTimeMS = readBordereauSLADEStopTime - readBordereauSLADEStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Read bordereau APREP time : ', executionTime);
    return infos;
}

exports.readExcelSWISSLIFESURCO = async (file) => {
    console.log('DEBUT TRAITEMENT SWISSLIFE SURCO');
    const excecutionStartTime = performance.now();
    let filePath = file;
    const fileName = fileService.getFileNameWithoutExtension(filePath);
    const extension = fileService.getFileExtension(filePath);
    if (extension.toUpperCase() === 'XLS') {
        let originalFile = XLSX.readFile(filePath);
        filePath = path.join(__dirname, '..', '..', '..', 'documents', 'uploaded', `${fileName}.xlsx`);
        XLSX.writeFile(originalFile, filePath);
    }
    const workbook = new ExcelJS.Workbook();
    const swisslifefile = fs.readFileSync(filePath);
    await workbook.xlsx.load(swisslifefile);
    const worksheets = workbook.worksheets;
    let headers = [];
    let allContrats = [];
    let ocr = { headers: null, allContratsPerCourtier: [], executionTime: 0 };
    for (let worksheet of worksheets) {
        if (worksheet.name === worksheets[0].name ||
            worksheet.name === worksheets[1].name ||
            worksheet.name === worksheets[2].name ||
            worksheet.name === worksheets[4].name) {
            let rowNumberHeader;
            worksheet.eachRow((row, rowNumber) => {
                if (typeof row.getCell('A').value === 'string' && row.getCell('A').value.match(/Apporteur/i)) {
                    rowNumberHeader = rowNumber;
                    row.eachCell((cell, colNumber) => {
                        const currentCellValue = (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim().replace(/\n/g, ' ') : cell.value.replace(/\n/g, ' ');
                        if (headers.indexOf(currentCellValue) < 0) {
                            headers.push(currentCellValue);
                        }
                    });
                }
                if (rowNumber > rowNumberHeader) {
                    const contrat = {
                        apporteurVente: (typeof row.getCell('A').value === 'string') ?
                            row.getCell('A').value.trim() :
                            row.getCell('A').value,
                        dateComptabVente: (typeof row.getCell('B').value === 'string') ?
                            row.getCell('B').value.trim() :
                            row.getCell('B').value,
                        numeroPolice: (typeof row.getCell('C').value === 'string') ?
                            row.getCell('C').value.trim() :
                            row.getCell('C').value,
                        codeProduit: (typeof row.getCell('D').value === 'string') ?
                            row.getCell('D').value.trim() :
                            row.getCell('D').value,
                        nomClient: (typeof row.getCell('E').value === 'string') ?
                            row.getCell('E').value.trim() :
                            row.getCell('E').value,
                        cotisationPonderee: (typeof row.getCell('F').value === 'string') ?
                            row.getCell('F').value.trim() :
                            row.getCell('F').value,
                        montantPP: (typeof row.getCell('G').value === 'string') ?
                            row.getCell('G').value.trim() :
                            row.getCell('G').value,
                        dontParUCsurPP: (typeof row.getCell('H').value === 'string') ?
                            row.getCell('H').value.trim() :
                            row.getCell('H').value,
                        montantPU: (typeof row.getCell('I').value === 'string') ?
                            row.getCell('I').value.trim() :
                            row.getCell('I').value,
                        dontParUCsurPU: (typeof row.getCell('J').value === 'string') ?
                            row.getCell('J').value.trim() :
                            row.getCell('J').value,
                        tauxChargement: (typeof row.getCell('K').value === 'string') ?
                            row.getCell('K').value.trim() :
                            row.getCell('K').value,
                        avanceSurco: (typeof row.getCell('L').value === 'string') ?
                            row.getCell('L').value.trim() :
                            row.getCell('L').value,
                        incompressible: (typeof row.getCell('M').value === 'string') ?
                            row.getCell('M').value.trim() :
                            row.getCell('M').value,
                        avanceComprisRepriseIncompressible: (typeof row.getCell('N').value === 'string') ?
                            row.getCell('N').value.trim() :
                            row.getCell('N').value
                    };
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

    ocr = { headers, allContratsPerCourtier, executionTime: 0, executionTimeMS: 0 };
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log('FIN TRAITEMENT SWISSLIFE SURCO');
    return ocr;
};

