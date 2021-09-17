const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');
const { execSync } = require('child_process');
const pdfService = require('./pdfFile');
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

exports.readPdfAPIVIA = async (file) => {
    let infos = { executionTime: 0, infos: null };
    console.log('DEBUT TRAITEMENT APIVIA');
    const excecutionStartTime = performance.now();
    // const images = await pdfService.convertPDFToImg(file);
    // const textFilePaths = getTextFromImages(images);
    // const textFilePath = combineTextToOneFile(file, textFilePaths);
    const textFilePath = '/media/tiana/data1/PROJETS/DIRIS/SOFRACO/src/Sofraco/sofraco-back-end/documents/texte/APIVIA_JUILLET_2021.txt';
    const infoBordereau = readBordereauAPIVIA(textFilePath);
    infos.infos = infoBordereau;
    const excecutionStopTime = performance.now();
    let executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    infos.executionTime = executionTime;
    infos.executionTimeMS = executionTimeMS;
    console.log('FIN TRAITEMENT APIVIA');
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
            execSync(`tesseract ${image} ${destFullPath} --psm 6`);
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

const combineTextToOneFile = (file, textFilePaths) => {
    let contentText = '';
    const fileNameWithoutExtension = fileService.getFileNameWithoutExtension(file);
    for (let textFilePath of textFilePaths) {
        const fileNameWithoutExtension = fileService.getFileNameWithoutExtension(textFilePath);
        const nameArr = fileNameWithoutExtension.split('_');
        const numero = nameArr[nameArr.length - 1];
        const content = fs.readFileSync(textFilePath, { encoding: 'utf-8' });
        contentText = `${contentText}\n${content}`;
    }
    const textFilePath = path.join(__dirname, '..', '..', '..', 'documents', 'texte', `${fileNameWithoutExtension}.txt`);
    fs.writeFileSync(textFilePath, contentText);
    return textFilePath;
}

const readBordereauAPIVIA = (textFilePath) => {
    const readBordereauAPIVIAStartTime = performance.now();
    let infos = { syntheseDesCommissions: null, detailDesPolices: null };
    // textFilePath = path.join(__dirname, '..', '..', '..', 'documents', 'texte', textFilePath);
    const content = fs.readFileSync(textFilePath, { encoding: 'utf-8' });
    let data = content.split('\n');
    data = data.filter((element) => {
        return element.trim() !== '';
    });
    let codeApporteur;
    for(let element of data) {
        const rCodeApporteur = /Code apporteur (.*)$/;
        if (element.match(rCodeApporteur)) {
            codeApporteur = element.replace(rCodeApporteur, '$1');
            break;
        }
    }

    const firstIndexUtil = reIndexOf(data, /Echéance.+/i) + 1;
    const details = data.filter((d, index) => {
        return index >= firstIndexUtil;
    });
    let newDetails = [];
    const maxI = details.length / 4;
    for (let i = 0; i < maxI; i++) {
        if (details.length > 0) {
            const d = details.slice(0, reIndexOf(details, /apivia/) + 2);
            details.splice(0, reIndexOf(details, /Sous-total/) + 2);
            newDetails.push(d);
        } else {
            break;
        }
    }

    newDetails.forEach((element, index) => {
        let dPolices = [];
        let contrat = {
            echeance: null,
            numeroContrat: null,
            vosRef: null,
            ent: null,
            client: null,
            produit: null,
            dateEffet: null,
            fract: null,
            primeAnnuelClient: null,
            primeAnnuelCommission: null,
            taux: null,
            commission: null,
            fraisDossier: null
        };
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
    infos.detailDesPolices = dDPolice;
    const readBordereauAPIVIAStopTime = performance.now();
    const executionTimeMS = readBordereauAPIVIAStopTime - readBordereauAPIVIAStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Read bordereau APIVIA time : ', executionTime);
    return infos;
}
