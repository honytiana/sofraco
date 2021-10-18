const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');
const { execSync } = require('child_process');
const pdfService = require('../utils/pdfFile');
const time = require('../utils/time');
const fileService = require('../utils/files');
const redefinition = require('../utils/redefinition');


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

exports.readPdfAPREPENCOURS = async (file) => {
    let infos = { executionTime: 0, infos: null };
    console.log('DEBUT TRAITEMENT APREP-ENCOURS');
    const excecutionStartTime = performance.now();
    const images = await pdfService.convertPDFToImg(file);
    const textFilePaths = getTextFromImages(images);
    const textFilePath = combineTextToOneFile(file, textFilePaths);
    const infoBordereau = readBordereauAPREPENCOURS(textFilePath);
    infos.infos = infoBordereau;
    const excecutionStopTime = performance.now();
    let executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    infos.executionTime = executionTime;
    infos.executionTimeMS = executionTimeMS;
    console.log('FIN TRAITEMENT APREP-ENCOURS');
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

const combineTextToOneFile = (file, textFilePaths) => {
    let contentText = '';
    const fileNameWithoutExtension = fileService.getFileNameWithoutExtension(file);
    for (let textFilePath of textFilePaths) {
        // textFilePath = path.join(__dirname, '..', '..', '..', 'documents', 'texte', textFilePath);
        const fileNameWithoutExtension = fileService.getFileNameWithoutExtension(textFilePath);
        const nameArr = fileNameWithoutExtension.split('_');
        const numero = nameArr[nameArr.length - 1];
        if (numero !== '1' && numero !== '2') {
            const content = fs.readFileSync(textFilePath, { encoding: 'utf-8' });
            contentText = `${contentText}\n${content}`;
        }
    }
    const textFilePath = path.join(__dirname, '..', '..', '..', 'documents', 'texte', `${fileNameWithoutExtension}.txt`);
    fs.writeFileSync(textFilePath, contentText);
    return textFilePath;
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
                    infosBordereau.datebordereau = dateBordereau;
                    // infosBordereau.datebordereau = new Date(parseInt(dateBordereauArray[2]), parseInt(dateBordereauArray[1]) - 1, parseInt(dateBordereauArray[0]), 0, 0, 0);
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
            const firstIndexUtil = redefinition.reIndexOf(data, regex);
            const lastIndexUtil = redefinition.reLastIndexOf(data, regex);
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
                    contrat.datePrelevement = datePrelevement;
                    // contrat.datePrelevement = new Date(parseInt(datePrelevementArray[2]), parseInt(datePrelevementArray[1]) - 1, parseInt(datePrelevementArray[0]), 0, 0, 0);

                    contrat.numeroContrat = element.replace(rContrat1, '$2');

                    const datePaiement = element.replace(rContrat1, '$3');
                    const datePaiementArray = datePaiement.split('/');
                    contrat.datePaiement = datePaiement;
                    // contrat.datePaiement = new Date(parseInt(datePaiementArray[2]), parseInt(datePaiementArray[1]) - 1 , parseInt(datePaiementArray[0]), 0, 0, 0);

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
                    contrat.datePaiement = datePaiement;
                    // contrat.datePaiement = new Date(parseInt(datePaiementArray[2]), parseInt(datePaiementArray[1]) - 1, parseInt(datePaiementArray[0]), 0, 0, 0);

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

const readBordereauAPREPENCOURS = (textFilePath) => {
    const readBordereauAPREPENCOURSStartTime = performance.now();
    let infos = { infosBordereau: { headers : [], situation: null }, contrats: [] };
    let content = fs.readFileSync(textFilePath, { encoding: 'utf-8' });
    let data = content.split('\n');
    data = data.filter((element) => {
        return element.trim() !== '';
    });
    const fileNameWithoutExtension = fileService.getFileNameWithoutExtension(textFilePath);
    const nameArr = fileNameWithoutExtension.split('_');
    const numero = nameArr[nameArr.length - 1];
    let details = [];
    data.forEach((d, i) => {
        if (redefinition.reIndexOf(data, /contact.+/i) >= 0 && redefinition.reIndexOf(data, /total ((?!aprep).)/i) >= 0) {
            const contrat = data.slice(redefinition.reIndexOf(data, /contact.+/i), redefinition.reIndexOf(data, /total ((?!aprep).)/i) + 1);
            details.push(contrat);
            data.splice(redefinition.reIndexOf(data, /contact.+/i), contrat.length);
        }
    });
    let months = [];
    for (let d of data) {
        const rHeaders = /((encours) )+(moyenne) (taux) (total)/i;
        const rHeaders2 = /(désignation) ([^\d]+) ([^\d]+) ([^\d]+) ([^\d]+) (moyen) (commissions)/i;
        if (d.match(rHeaders2)) {
            const encours1 = d.replace(rHeaders2, '$2');
            const encours2 = d.replace(rHeaders2, '$3');
            const encours3 = d.replace(rHeaders2, '$4');
            const encours4 = d.replace(rHeaders2, '$5');
            months.push(encours1);
            months.push(encours2);
            months.push(encours3);
            months.push(encours4);
            break;
        }
    }
    infos.infosBordereau.headers = [
        '',
        '',
        `Encours ${months[0]}`,
        `Encours ${months[1]}`,
        `Encours ${months[2]}`,
        `Encours ${months[3]}`,
        'Moyenne',
        'Taux moyen',
        'Total Commission'
    ];
    for (let d of data) {
        const rDate = /commissions trimestrielles.+situation du (\d{1,2}[/]\d{1,2}[/]\d{1,4} au \d{1,2}[/]\d{1,2}[/]\d{1,4})/i;
        if (d.match(rDate)) {
            infos.infosBordereau.situation = d.replace(rDate, '$1');
            break;
        }
    }

    details.forEach((detail, index) => {
        let commissionTrimestrielle = {
            contact: null,
            contrats: [],
            total: {
                nom: null,
                encours1: null,
                encours2: null,
                encours3: null,
                encours4: null,
                moyenne: null,
                totalCommission: null
            }
        }
        let contrat = {
            produit: null,
            contenu: [],
            totalAprepEncours: {
                nom: null,
                encours1: null,
                encours2: null,
                encours3: null,
                encours4: null,
                moyenne: null,
                tauxMoyen: null,
                totalCommission: null
            },
            // verificationCommission: null
        };
        const rContact = /contact : (.+)/i;
        const rProduit = /.*produit : (.+)/i;
        const rProduitS = /^(?!contact)(?!.+produit)(?!encours+)(?!désignation+)(?![(]en %age[)])([^\d]+)$/i;
        const rContrat1 = /^([a-z]* ?[a-z]*\d+) ([^\d]+) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+,?\d*%)+ (\d+ ?\d*,?\d*)+$/i;
        const rContrat2 = /^([a-z]* ?[a-z]*\d+) ([^\d]+) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+,?\d*%)+ (\d+ ?\d*,?\d*)+$/i;
        const rContrat3 = /^([a-z]* ?[a-z]*\d+) ([^\d]+) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+,?\d*%)+ (\d+ ?\d*,?\d*)+$/i;
        const rContrat4 = /^([a-z]* ?[a-z]*\d+) ([^\d]+) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+,?\d*%)+ (\d+ ?\d*,?\d*)+$/i;
        const rTotalAprep1 = /^(total aprep [^\d]+) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+,?\d*%)+ (\d+ ?\d*,?\d*)+$/i;
        const rTotalAprep2 = /^(total aprep [^\d]+) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+,?\d*%)+ (\d+ ?\d*,?\d*)+$/i;
        const rTotalAprep3 = /^(total aprep [^\d]+) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+,?\d*%)+ (\d+ ?\d*,?\d*)+$/i;
        const rTotalAprep4 = /^(total aprep [^\d]+) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+,?\d*%)+ (\d+ ?\d*,?\d*)+$/i;
        const rTotalContrat1 = /^(total (?!aprep)+[a-z\s]*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*)$/i;
        const rTotalContrat2 = /^(total (?!aprep)+[a-z\s]*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*)$/i;
        const rTotalContrat3 = /^(total (?!aprep)+[a-z\s]*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*)$/i;
        const rTotalContrat4 = /^(total (?!aprep)+[a-z\s]*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*) (\d+ ?\d*,?\d*)$/i;

        for (let element of detail) {
            let contenu = {
                numero: null,
                nom: null,
                encours1: null,
                encours2: null,
                encours3: null,
                encours4: null,
                moyenne: null,
                tauxMoyen: null,
                totalCommission: null
            }
            if (element.match(rContact)) {
                commissionTrimestrielle.contact = element.replace(rContact, '$1');
                continue;
            }
            if (element.match(rProduit)) {
                contrat.produit = element.replace(rProduit, '$1');
                continue;
            }
            if (element.match(rProduitS)) {
                contrat.produit = `${contrat.produit} ${element.replace(rProduitS, '$1')}`;
                continue;
            }
            if (element.match(rContrat1)) {
                contenu.numero = element.replace(rContrat1, '$1');
                contenu.nom = element.replace(rContrat1, '$2');
                contenu.encours1 = element.replace(rContrat1, '$3');
                contenu.encours1 = parseFloat(contenu.encours1.replace(' ', '').replace(',', '.'));
                contenu.moyenne = element.replace(rContrat1, '$4');
                contenu.moyenne = parseFloat(contenu.moyenne.replace(' ', '').replace(',', '.'));
                contenu.tauxMoyen = element.replace(rContrat1, '$5');
                contenu.totalCommission = element.replace(rContrat1, '$6');
                contenu.totalCommission = parseFloat(contenu.totalCommission.replace(' ', '').replace(',', '.'));
                contrat.contenu.push(contenu);
                continue;
            }
            if (element.match(rContrat2)) {
                contenu.numero = element.replace(rContrat2, '$1');
                contenu.nom = element.replace(rContrat2, '$2');
                contenu.encours1 = element.replace(rContrat2, '$3');
                contenu.encours1 = parseFloat(contenu.encours1.replace(' ', '').replace(',', '.'));
                contenu.encours2 = element.replace(rContrat2, '$4');
                contenu.encours2 = parseFloat(contenu.encours2.replace(' ', '').replace(',', '.'));
                contenu.moyenne = element.replace(rContrat2, '$5');
                contenu.moyenne = parseFloat(contenu.moyenne.replace(' ', '').replace(',', '.'));
                contenu.tauxMoyen = element.replace(rContrat2, '$6');
                contenu.totalCommission = element.replace(rContrat2, '$7');
                contenu.totalCommission = parseFloat(contenu.totalCommission.replace(' ', '').replace(',', '.'));
                contrat.contenu.push(contenu);
                continue;
            }
            if (element.match(rContrat3)) {
                contenu.numero = element.replace(rContrat3, '$1');
                contenu.nom = element.replace(rContrat3, '$2');
                contenu.encours1 = element.replace(rContrat3, '$3');
                contenu.encours1 = parseFloat(contenu.encours1.replace(' ', '').replace(',', '.'));
                contenu.encours2 = element.replace(rContrat3, '$4');
                contenu.encours2 = parseFloat(contenu.encours2.replace(' ', '').replace(',', '.'));
                contenu.encours3 = element.replace(rContrat3, '$5');
                contenu.encours3 = parseFloat(contenu.encours3.replace(' ', '').replace(',', '.'));
                contenu.moyenne = element.replace(rContrat3, '$6');
                contenu.moyenne = parseFloat(contenu.moyenne.replace(' ', '').replace(',', '.'));
                contenu.tauxMoyen = element.replace(rContrat3, '$7');
                contenu.totalCommission = element.replace(rContrat3, '$8');
                contenu.totalCommission = parseFloat(contenu.totalCommission.replace(' ', '').replace(',', '.'));
                contrat.contenu.push(contenu);
                continue;
            }
            if (element.match(rContrat4)) {
                contenu.numero = element.replace(rContrat4, '$1');
                contenu.nom = element.replace(rContrat4, '$2');
                contenu.encours1 = element.replace(rContrat4, '$3');
                contenu.encours1 = parseFloat(contenu.encours1.replace(' ', '').replace(',', '.'));
                contenu.encours2 = element.replace(rContrat4, '$4');
                contenu.encours2 = parseFloat(contenu.encours2.replace(' ', '').replace(',', '.'));
                contenu.encours3 = element.replace(rContrat4, '$5');
                contenu.encours3 = parseFloat(contenu.encours3.replace(' ', '').replace(',', '.'));
                contenu.encours4 = element.replace(rContrat4, '$6');
                contenu.encours4 = parseFloat(contenu.encours4.replace(' ', '').replace(',', '.'));
                contenu.moyenne = element.replace(rContrat4, '$7');
                contenu.moyenne = parseFloat(contenu.moyenne.replace(' ', '').replace(',', '.'));
                contenu.tauxMoyen = element.replace(rContrat4, '$8');
                contenu.totalCommission = element.replace(rContrat4, '$9');
                contenu.totalCommission = parseFloat(contenu.totalCommission.replace(' ', '').replace(',', '.'));
                contrat.contenu.push(contenu);
                continue;
            }
            if (element.match(rTotalAprep1)) {
                contrat.totalAprepEncours.nom = element.replace(rTotalAprep1, '$1');
                contrat.totalAprepEncours.encours1 = element.replace(rTotalAprep1, '$2');
                contrat.totalAprepEncours.encours1 = parseFloat(contrat.totalAprepEncours.encours1.replace(' ', '').replace(',', '.'));
                contrat.totalAprepEncours.moyenne = element.replace(rTotalAprep1, '$3');
                contrat.totalAprepEncours.moyenne = parseFloat(contrat.totalAprepEncours.moyenne.replace(' ', '').replace(',', '.'));
                contrat.totalAprepEncours.tauxMoyen = element.replace(rTotalAprep1, '$4');
                contrat.totalAprepEncours.totalCommission = element.replace(rTotalAprep1, '$5');
                contrat.totalAprepEncours.totalCommission = parseFloat(contrat.totalAprepEncours.totalCommission.replace(' ', '').replace(',', '.'));
                commissionTrimestrielle.contrats.push(contrat);
                contrat = {
                    produit: null,
                    contenu: [],
                    totalAprepEncours: {
                        nom: null,
                        encours1: null,
                        encours2: null,
                        encours3: null,
                        encours4: null,
                        moyenne: null,
                        tauxMoyen: null,
                        totalCommission: null
                    },
                    // verificationCommission: null
                };
                continue;
            }
            if (element.match(rTotalAprep2)) {
                contrat.totalAprepEncours.nom = element.replace(rTotalAprep2, '$1');
                contrat.totalAprepEncours.encours1 = element.replace(rTotalAprep2, '$2');
                contrat.totalAprepEncours.encours1 = parseFloat(contrat.totalAprepEncours.encours1.replace(' ', '').replace(',', '.'));
                contrat.totalAprepEncours.encours2 = element.replace(rTotalAprep2, '$3');
                contrat.totalAprepEncours.encours2 = parseFloat(contrat.totalAprepEncours.encours2.replace(' ', '').replace(',', '.'));
                contrat.totalAprepEncours.moyenne = element.replace(rTotalAprep2, '$4');
                contrat.totalAprepEncours.moyenne = parseFloat(contrat.totalAprepEncours.moyenne.replace(' ', '').replace(',', '.'));
                contrat.totalAprepEncours.tauxMoyen = element.replace(rTotalAprep2, '$5');
                contrat.totalAprepEncours.totalCommission = element.replace(rTotalAprep2, '$6');
                contrat.totalAprepEncours.totalCommission = parseFloat(contrat.totalAprepEncours.totalCommission.replace(' ', '').replace(',', '.'));
                commissionTrimestrielle.contrats.push(contrat);
                contrat = {
                    produit: null,
                    contenu: [],
                    totalAprepEncours: {
                        nom: null,
                        encours1: null,
                        encours2: null,
                        encours3: null,
                        encours4: null,
                        moyenne: null,
                        tauxMoyen: null,
                        totalCommission: null
                    },
                    // verificationCommission: null
                };
                continue;
            }
            if (element.match(rTotalAprep3)) {
                contrat.totalAprepEncours.nom = element.replace(rTotalAprep3, '$1');
                contrat.totalAprepEncours.encours1 = element.replace(rTotalAprep3, '$2');
                contrat.totalAprepEncours.encours1 = parseFloat(contrat.totalAprepEncours.encours1.replace(' ', '').replace(',', '.'));
                contrat.totalAprepEncours.encours2 = element.replace(rTotalAprep3, '$3');
                contrat.totalAprepEncours.encours2 = parseFloat(contrat.totalAprepEncours.encours2.replace(' ', '').replace(',', '.'));
                contrat.totalAprepEncours.encours3 = element.replace(rTotalAprep3, '$4');
                contrat.totalAprepEncours.encours3 = parseFloat(contrat.totalAprepEncours.encours3.replace(' ', '').replace(',', '.'));
                contrat.totalAprepEncours.moyenne = element.replace(rTotalAprep3, '$5');
                contrat.totalAprepEncours.moyenne = parseFloat(contrat.totalAprepEncours.moyenne.replace(' ', '').replace(',', '.'));
                contrat.totalAprepEncours.tauxMoyen = element.replace(rTotalAprep3, '$6');
                contrat.totalAprepEncours.totalCommission = element.replace(rTotalAprep3, '$7');
                contrat.totalAprepEncours.totalCommission = parseFloat(contrat.totalAprepEncours.totalCommission.replace(' ', '').replace(',', '.'));
                commissionTrimestrielle.contrats.push(contrat);
                contrat = {
                    produit: null,
                    contenu: [],
                    totalAprepEncours: {
                        nom: null,
                        encours1: null,
                        encours2: null,
                        encours3: null,
                        encours4: null,
                        moyenne: null,
                        tauxMoyen: null,
                        totalCommission: null
                    },
                    // verificationCommission: null
                };
                continue;
            }
            if (element.match(rTotalAprep4)) {
                contrat.totalAprepEncours.nom = element.replace(rTotalAprep4, '$1');
                contrat.totalAprepEncours.encours1 = element.replace(rTotalAprep4, '$2');
                contrat.totalAprepEncours.encours1 = parseFloat(contrat.totalAprepEncours.encours1.replace(' ', '').replace(',', '.'));
                contrat.totalAprepEncours.encours2 = element.replace(rTotalAprep4, '$3');
                contrat.totalAprepEncours.encours2 = parseFloat(contrat.totalAprepEncours.encours2.replace(' ', '').replace(',', '.'));
                contrat.totalAprepEncours.encours3 = element.replace(rTotalAprep4, '$4');
                contrat.totalAprepEncours.encours3 = parseFloat(contrat.totalAprepEncours.encours3.replace(' ', '').replace(',', '.'));
                contrat.totalAprepEncours.encours4 = element.replace(rTotalAprep4, '$5');
                contrat.totalAprepEncours.encours4 = parseFloat(contrat.totalAprepEncours.encours4.replace(' ', '').replace(',', '.'));
                contrat.totalAprepEncours.moyenne = element.replace(rTotalAprep4, '$6');
                contrat.totalAprepEncours.moyenne = parseFloat(contrat.totalAprepEncours.moyenne.replace(' ', '').replace(',', '.'));
                contrat.totalAprepEncours.tauxMoyen = element.replace(rTotalAprep4, '$7');
                contrat.totalAprepEncours.totalCommission = element.replace(rTotalAprep4, '$8');
                contrat.totalAprepEncours.totalCommission = parseFloat(contrat.totalAprepEncours.totalCommission.replace(' ', '').replace(',', '.'));
                commissionTrimestrielle.contrats.push(contrat);
                contrat = {
                    produit: null,
                    contenu: [],
                    totalAprepEncours: {
                        nom: null,
                        encours1: null,
                        encours2: null,
                        encours3: null,
                        encours4: null,
                        moyenne: null,
                        tauxMoyen: null,
                        totalCommission: null
                    },
                    // verificationCommission: null
                };
                continue;
            }
            if (element.match(rTotalContrat1)) {
                commissionTrimestrielle.total.nom = element.replace(rTotalContrat1, '$1');
                commissionTrimestrielle.total.encours1 = element.replace(rTotalContrat1, '$2');
                commissionTrimestrielle.total.encours1 = parseFloat(commissionTrimestrielle.total.encours1.replace(' ', '').replace(',', '.'));
                commissionTrimestrielle.total.moyenne = element.replace(rTotalContrat1, '$3');
                commissionTrimestrielle.total.moyenne = parseFloat(commissionTrimestrielle.total.moyenne.replace(' ', '').replace(',', '.'));
                commissionTrimestrielle.total.totalCommission = element.replace(rTotalContrat1, '$4');
                commissionTrimestrielle.total.totalCommission = parseFloat(commissionTrimestrielle.total.totalCommission.replace(' ', '').replace(',', '.'));
                continue;
            }
            if (element.match(rTotalContrat2)) {
                commissionTrimestrielle.total.nom = element.replace(rTotalContrat2, '$1');
                commissionTrimestrielle.total.encours1 = element.replace(rTotalContrat2, '$2');
                commissionTrimestrielle.total.encours1 = parseFloat(commissionTrimestrielle.total.encours1.replace(' ', '').replace(',', '.'));
                commissionTrimestrielle.total.encours2 = element.replace(rTotalContrat2, '$3');
                commissionTrimestrielle.total.encours2 = parseFloat(commissionTrimestrielle.total.encours2.replace(' ', '').replace(',', '.'));
                commissionTrimestrielle.total.moyenne = element.replace(rTotalContrat2, '$4');
                commissionTrimestrielle.total.moyenne = parseFloat(commissionTrimestrielle.total.moyenne.replace(' ', '').replace(',', '.'));
                commissionTrimestrielle.total.totalCommission = element.replace(rTotalContrat2, '$75');
                commissionTrimestrielle.total.totalCommission = parseFloat(contrat.totalAprepEncours.totalCommission.replace(' ', '').replace(',', '.'));
                continue;
            }
            if (element.match(rTotalContrat3)) {
                commissionTrimestrielle.total.nom = element.replace(rTotalContrat3, '$1');
                commissionTrimestrielle.total.encours1 = element.replace(rTotalContrat3, '$2');
                commissionTrimestrielle.total.encours1 = parseFloat(commissionTrimestrielle.total.encours1.replace(' ', '').replace(',', '.'));
                commissionTrimestrielle.total.encours2 = element.replace(rTotalContrat3, '$3');
                commissionTrimestrielle.total.encours2 = parseFloat(commissionTrimestrielle.total.encours2.replace(' ', '').replace(',', '.'));
                commissionTrimestrielle.total.encours3 = element.replace(rTotalContrat3, '$4');
                commissionTrimestrielle.total.encours3 = parseFloat(commissionTrimestrielle.total.encours3.replace(' ', '').replace(',', '.'));
                commissionTrimestrielle.total.moyenne = element.replace(rTotalContrat3, '$5');
                commissionTrimestrielle.total.moyenne = parseFloat(commissionTrimestrielle.total.moyenne.replace(' ', '').replace(',', '.'));
                commissionTrimestrielle.total.totalCommission = element.replace(rTotalContrat3, '$6');
                commissionTrimestrielle.total.totalCommission = parseFloat(contrat.totalAprepEncours.totalCommission.replace(' ', '').replace(',', '.'));
                continue;
            }
            if (element.match(rTotalContrat4)) {
                commissionTrimestrielle.total.nom = element.replace(rTotalContrat4, '$1');
                commissionTrimestrielle.total.encours1 = element.replace(rTotalContrat4, '$2');
                commissionTrimestrielle.total.encours1 = parseFloat(commissionTrimestrielle.total.encours1.replace(' ', '').replace(',', '.'));
                commissionTrimestrielle.total.encours2 = element.replace(rTotalContrat4, '$3');
                commissionTrimestrielle.total.encours2 = parseFloat(commissionTrimestrielle.total.encours2.replace(' ', '').replace(',', '.'));
                commissionTrimestrielle.total.encours3 = element.replace(rTotalContrat4, '$4');
                commissionTrimestrielle.total.encours3 = parseFloat(commissionTrimestrielle.total.encours3.replace(' ', '').replace(',', '.'));
                commissionTrimestrielle.total.encours4 = element.replace(rTotalContrat4, '$5');
                commissionTrimestrielle.total.encours4 = parseFloat(commissionTrimestrielle.total.encours4.replace(' ', '').replace(',', '.'));
                commissionTrimestrielle.total.moyenne = element.replace(rTotalContrat4, '$6');
                commissionTrimestrielle.total.moyenne = parseFloat(commissionTrimestrielle.total.moyenne.replace(' ', '').replace(',', '.'));
                commissionTrimestrielle.total.totalCommission = element.replace(rTotalContrat4, '$7');
                commissionTrimestrielle.total.totalCommission = parseFloat(commissionTrimestrielle.total.totalCommission.replace(' ', '').replace(',', '.'));
                continue;
            }

            // const vCommissionApporteur = ((contrat.primeCommissionnement * contrat.tauxCommissionApporteur) / 100).toFixed(2);
            // if (Math.abs(parseFloat(vCommissionApporteur)) === Math.abs(contrat.commissionApporteur) ||
            //     (Math.abs(parseFloat(vCommissionApporteur)) + 0.01) === Math.abs(contrat.commissionApporteur) ||
            //     (Math.abs(parseFloat(vCommissionApporteur)) - 0.01) === Math.abs(contrat.commissionApporteur)) {
            //     contrat.verificationCommissionApporteur = true;
            // } else {
            //     contrat.verificationCommissionApporteur = false;
            // }

        };
        infos.contrats.push(commissionTrimestrielle);
    })
    const readBordereauAPREPENCOURSStopTime = performance.now();
    const executionTimeMS = readBordereauAPREPENCOURSStopTime - readBordereauAPREPENCOURSStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Read bordereau APREP-ENCOURS time : ', executionTime);
    return infos;
}
