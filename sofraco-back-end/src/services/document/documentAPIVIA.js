const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');
const { execSync } = require('child_process');
const pdfService = require('../utils/pdfFile');
const time = require('../utils/time');
const fileService = require('../utils/files');
const imageAPIVIA = require('../images/imageAPIVIA');
const imageManagment = require('../images/imageManagment');


exports.readPdfAPIVIA = async (file) => {
    let infos = { executionTime: 0, executionTimeMS: 0, infos: null };
    console.log('DEBUT TRAITEMENT APIVIA');
    const excecutionStartTime = performance.now();
    let useFiles = false;
    let allTextFiles = [];
    if (useFiles) {
        // let allFiles = fs.readFileSync(path.join(__dirname, 'apiviaimg.json'), { encoding: 'utf-8' });
        // allFiles = JSON.parse(allFiles);
        console.log('DEBUT IMPORTER LINES APIVIA');
        allTextFiles = fs.readFileSync(path.join(__dirname, 'apiviatxtfile.json'), { encoding: 'utf-8' });
        allTextFiles = JSON.parse(allTextFiles);
        console.log('FIN IMPORTER LINES APIVIA');
    } else {
        const images = await pdfService.convertPDFToImg(file);
        console.log('DEBUT TRAITEMENT IMAGES APIVIA');
        const allFiles = await imageManagment.loadOpenCV(images, 'APIVIA');
        console.log('FIN TRAITEMENT IMAGES APIVIA');
        console.log('DEBUT IMPORTER LINES APIVIA');
        for (let files of allFiles) {
            let contratTextsFiles = [];
            for (let lines of files) {
                const textFilePaths = getTextFromImages(lines);
                contratTextsFiles.push(textFilePaths);
            }
            allTextFiles.push(contratTextsFiles);
        }
        console.log('FIN IMPORTER LINES APIVIA');
    }
    const infoBordereau = readBordereauAPIVIA(allTextFiles);
    infos.infos = infoBordereau;
    const excecutionStopTime = performance.now();
    let executionTimeMS = excecutionStopTime - excecutionStartTime;
    infos.executionTime = time.millisecondToTime(executionTimeMS);
    infos.executionTimeMS = executionTimeMS;
    console.log('Total Execution time : ', infos.executionTime);
    console.log('FIN TRAITEMENT APIVIA');
    return infos;
};

const getTextFromImages = (images) => {
    let textFilePaths = [];
    for (let cell of images.cell) {
        const fileNameWthoutExtension = fileService.getFileNameWithoutExtension(cell);
        const destFullPath = path.join(__dirname, '..', '..', '..', 'documents', 'texte', `${fileNameWthoutExtension}`);
        let executionTimeTesseract;
        try {
            const tesseractStartTime = performance.now();
            execSync(`tesseract ${cell} ${destFullPath} --psm 6`);
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
}

const readBordereauAPIVIA = (textFilePath) => {
    const readBordereauAPIVIAStartTime = performance.now();
    let allContrats = [];
    let dataHead = '"Echéance"';
    dataHead += ',"N° Contrat"';
    dataHead += ',"Vos réf."';
    dataHead += ',"Ent"';
    dataHead += ',"Client"';
    dataHead += ',"Produit"';
    dataHead += ',"Date Effet"';
    dataHead += ',"Fract."';
    dataHead += ',"Prime ann. client"';
    dataHead += ',"Prime ann. commiss"';
    dataHead += ',"Taux"';
    dataHead += ',"Comm"';
    dataHead += ',"Frais dossier"';
    let fullData = dataHead + '\n';
    let apiviaCSV = path.join(__dirname, '..', '..', '..', 'documents', 'csv', 'apivia.csv');
    for (let textFile of textFilePath) {
        for (let line of textFile) {
            const contrat = {
                echeance: fs.readFileSync(line[0], { encoding: 'utf-8' }).trim().replace(/\n/g, ' '),
                numContrat: fs.readFileSync(line[1], { encoding: 'utf-8' }).trim().replace(/\n/g, ' '),
                reference: fs.readFileSync(line[2], { encoding: 'utf-8' }).trim().replace(/\n/g, ' '),
                ent: fs.readFileSync(line[3], { encoding: 'utf-8' }).trim().replace(/\n/g, ' '),
                client: fs.readFileSync(line[4], { encoding: 'utf-8' }).trim().replace(/\n/g, ' '),
                produit: fs.readFileSync(line[5], { encoding: 'utf-8' }).trim().replace(/\n/g, ' '),
                dateEffet: fs.readFileSync(line[6], { encoding: 'utf-8' }).trim().replace(/\n/g, ' '),
                fractionnement: fs.readFileSync(line[7], { encoding: 'utf-8' }).trim().replace(/\n/g, ' '),
                primeAnnuelClient: fs.readFileSync(line[8], { encoding: 'utf-8' }).trim().replace(/\n/g, ' ').replace(/ /g, ''),
                primeAnnuelCommission: fs.readFileSync(line[9], { encoding: 'utf-8' }).trim().replace(/\n/g, ' ').replace(/ /g, ''),
                taux: fs.readFileSync(line[10], { encoding: 'utf-8' }).trim().replace(/\n/g, ' ').replace(/ /g, ''),
                commission: fs.readFileSync(line[11], { encoding: 'utf-8' }).trim().replace(/\n/g, ' ').replace(/ /g, ''),
                fraisDossier: fs.readFileSync(line[12], { encoding: 'utf-8' }).trim().replace(/\n/g, ' ').replace(/ /g, '')
            };
            if (contrat.echeance.match(/.*\d{1}.*\d{1}.*[-].*\d{1}.*\d{1}.*[-].*\d{1}.*\d{1}.*\d{1}.*\d{1}.*/)) {
                contrat.echeance = contrat.echeance.replace(
                    /.*(\d{1}).*(\d{1}).*[-].*(\d{1}).*(\d{1}).*[-].*(\d{1}).*(\d{1}).*(\d{1}).*(\d{1}).*/,
                    '$1$2-$3$4-$5$6$7$8'
                );
                contrat.numContrat = contrat.numContrat.replace(/.*([a-z]+\d+).*/i, '$1');
                contrat.reference = contrat.reference.replace();
                contrat.ent = contrat.ent.replace();
                contrat.client = contrat.client.replace();
                contrat.produit = contrat.produit.replace();
                contrat.dateEffet = contrat.dateEffet.replace(
                    /.*(\d{1}).*(\d{1}).*[-].*(\d{1}).*(\d{1}).*[-].*(\d{1}).*(\d{1}).*(\d{1}).*(\d{1}).*/,
                    '$1$2-$3$4-$5$6$7$8'
                );
                contrat.fractionnement = contrat.fractionnement.replace(/.*([a-z]{1})/i, '$1');
                contrat.primeAnnuelClient = parseFloat(contrat.primeAnnuelClient.replace(/[^\d]*(\d+,+\d+)€*/, '$1').replace(',', '.'));
                contrat.primeAnnuelCommission = parseFloat(contrat.primeAnnuelCommission.replace(/[^\d]*(\d+,+\d+)€*/, '$1').replace(',', '.'));
                contrat.taux = parseFloat(contrat.taux.replace(/[^\d]*(\d+,+\d+)/, '$1').replace(',', '.'));
                contrat.commission = parseFloat(contrat.commission.replace(/[^\d]*(\d+,+\d+)€*/, '$1').replace(',', '.'));
                contrat.fraisDossier = parseFloat(contrat.fraisDossier.replace(/[^\d]*(\d+,+\d+)€*/, '$1').replace(',', '.'));
                allContrats.push(contrat);
                // let dataLine = `"${contrat.echeance}"`;
                // dataLine += `,"${contrat.numContrat}"`;
                // dataLine += `,"${contrat.reference}"`;
                // dataLine += `,"${contrat.ent}"`;
                // dataLine += `,"${contrat.client}"`;
                // dataLine += `,"${contrat.produit}"`;
                // dataLine += `,"${contrat.dateEffet}"`;
                // dataLine += `,"${contrat.fractionnement}"`;
                // dataLine += `,"${contrat.primeAnnuelClient}"`;
                // dataLine += `,"${contrat.primeAnnuelCommission}"`;
                // dataLine += `,"${contrat.taux}"`;
                // dataLine += `,"${contrat.commission}"`;
                // dataLine += `,"${contrat.fraisDossier}"`;

                // fullData += dataLine + '\n';
            }
        }
    }

    // fs.writeFileSync(apiviaCSV, fullData);
    let allContratsPerCourtier = [];
    let courtiers = [];
    allContrats.forEach((element, index) => {
        if (courtiers.indexOf(element.reference.toUpperCase()) < 0) {
            courtiers.push(element.reference.toUpperCase());
        }
    })
    for (let courtier of courtiers) {
        let contratCourtier = { courtier: '', contrats: [] };
        allContrats.forEach((element, index) => {
            contratCourtier.courtier = courtier;
            if (element.reference.toUpperCase() === contratCourtier.courtier.toUpperCase()) {
                contratCourtier.contrats.push(element);
            }
        });
        allContratsPerCourtier.push(contratCourtier);
    }

    const headers = [
        'Echéance',
        'N° Contrat',
        'Vos réf.',
        'Ent',
        'Client',
        'Produit',
        'Date Effet',
        'Fract.',
        'Prime ann. client',
        'Prime ann. commiss',
        'Taux',
        'Comm',
        'Frais dossier'
    ];
    let ocr = { headers, allContratsPerCourtier, executionTime: 0, executionTimeMS: 0 };
    const readBordereauAPIVIAStopTime = performance.now();
    const executionTimeMS = readBordereauAPIVIAStopTime - readBordereauAPIVIAStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log('Read bordereau APIVIA time : ', executionTime);
    return ocr;
}
