const path = require('path');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const { performance } = require('perf_hooks');
const { execSync } = require('child_process');
const time = require('../utils/time');
const fileService = require('../utils/files');
const pdfService = require('../utils/pdfFile');
const imageManagment = require('../images/imageManagment');

exports.splitPDFMETLIFE = async (file) => {
    console.log(`${new Date()} DEBUT SEPARATION PDF METLIFE`);
    const pathsToPDF = await this.splitPDFToSinglePagePDF(file);
    console.log(`${new Date()} FIN SEPARATION PDF METLIFE`);
    // if (pathsToPDF.length > 100) {
    //     split100pagesMax(file);
    // }
    let images = [];
    let i = 0;
    console.log(`${new Date()} DEBUT REGROUPEMENT PAR BORDEREAU METLIFE`);
    while (pathsToPDF.length > 0) {
        const image = await pdfService.convertPDFToImg(pathsToPDF[0]);
        const allFilesFromOpenCV = await imageManagment.loadOpenCV(image, 'METLIFE2');
        const textFilePath = getTextFromImages(allFilesFromOpenCV);
        const content = fs.readFileSync(textFilePath, { encoding: 'utf-8' });
        let data = content.split('\n');
        for (let d of data) {
            if (d.match(/Page 1[/]\d/i)) {
                const dArray = d.split('/');
                const numero = parseInt(dArray[dArray.length - 1]);
                let img = [];
                for (let i = 0; i < numero; i++) {
                    const image = await pdfService.convertPDFToImg(pathsToPDF[i]);
                    img.push(image[0]);
                }
                images.push(img);
                pathsToPDF.splice(0, numero);
                break;
            }
        }
        i++;
    }
    console.log(`${new Date()} FIN REGROUPEMENT PAR BORDEREAU METLIFE`);
    return images;
};

// const split100pagesMax = async (file) => {
//     console.log(`${new Date()} DEBUT SEPARATION par 100 pages`);
//     const pathsToPDF = await this.splitPDFToSinglePagePDF(file);
//     console.log(`${new Date()} FIN SEPARATION par 100 pages`);
//     let images = [];
//     let i = 0;
//     console.log(`${new Date()} DEBUT REGROUPEMENT PAR BORDEREAU METLIFE`);
//     let numberOfPages = [];
//     let newPDF = null;
//     while (pathsToPDF.length > 0) {
//         const image = await pdfService.convertPDFToImg(pathsToPDF[0]);
//         const allFilesFromOpenCV = await imageManagment.loadOpenCV(image, 'METLIFE2');
//         const textFilePath = getTextFromImages(allFilesFromOpenCV);
//         const content = fs.readFileSync(textFilePath, { encoding: 'utf-8' });
//         let data = content.split('\n');
//         let total = 0;
//         for (let d of data) {
//             if (d.match(/Page 1[/]\d/i)) {
//                 const dArray = d.split('/');
//                 const numero = parseInt(dArray[dArray.length - 1]);
//                 if (total < 100) {
//                     total = total + numero;
//                 } else {
//                     numberOfPages.push(total);
//                     total = 0;
//                     total = total + numero;
//                 }
//                 pathsToPDF.splice(0, numero);
//                 break;
//             }
//         }
//         i++;
//     }
//     let currentPDFBytes = fs.readFileSync(file);
//     const currentPDFDoc = await PDFDocument.load(currentPDFBytes);
//     const pageNumbers = currentPDFDoc.getPageCount();
//     let pdfNumero = 1;
//     let pathToPdf = [];
//     for (let page of numberOfPages) {
//         const newPDF = await PDFDocument.create();
//         const [page] = await newPDF.copyPages(currentPDFDoc, [i]);
//         newPDF.addPage(page);
//         const pdfBytes = await newPDF.save();
//         fs.writeFileSync(path.join(__dirname, '..', '..', '..', 'documents', 'splited_PDF', `${fileName}_${pdfNumero}.pdf`), pdfBytes);
//         pathToPdf.push(path.join(__dirname, '..', '..', '..', 'documents', 'splited_PDF', `${fileName}_${pdfNumero}.pdf`));
//         pdfNumero++;
//     }
//     // for (let i = 0; i < pageNumbers; i++) {
//     //     const newPDF = await PDFDocument.create();
//     //     const [page] = await newPDF.copyPages(currentPDFDoc, [i]);
//     //     newPDF.addPage(page);
//     //     const pdfBytes = await newPDF.save();
//     //     fs.writeFileSync(path.join(__dirname, '..', '..', '..', 'documents', 'splited_PDF', `${fileName}_${pdfNumero}.pdf`), pdfBytes);
//     //     pathToPdf.push(path.join(__dirname, '..', '..', '..', 'documents', 'splited_PDF', `${fileName}_${pdfNumero}.pdf`));
//     //     pdfNumero++;
//     // }
//     const excecutionStopTime = performance.now();
//     let executionTime = excecutionStopTime - excecutionStartTime;
//     console.log('Split pdf time : ', time.millisecondToTime(executionTime));
//     console.log(`${new Date()} FIN SEPARATION PDF`);
//     return pathToPdf;
//     console.log(`${new Date()} FIN REGROUPEMENT PAR BORDEREAU METLIFE`);
//     return numberOfPages;
// };

const getTextFromImages = (image) => {
    let textFilePath;
    try {
        const fileNameWthoutExtension = fileService.getFileNameWithoutExtension(image[0]);
        const destFullPath = path.join(__dirname, '..', '..', '..', 'documents', 'texte', `${fileNameWthoutExtension}`);
        let executionTimeTesseract;
        try {
            const tesseractStartTime = performance.now();
            execSync(`tesseract ${image[0]} ${destFullPath} --psm 6`);
            const tesseractStopTime = performance.now();
            executionTimeTesseract = tesseractStopTime - tesseractStartTime;
            console.log('Execution time Tesseract : ', time.millisecondToTime(executionTimeTesseract));
            textFilePath = `${destFullPath}.txt`;
            return textFilePath;
        } catch (err) {
            console.log(err);
            console.log(`Temps de traitement : ${time.millisecondToTime(executionTimeTesseract)}`);
        }
    } catch (err) {
        console.log(err);
    }
}

exports.splitPDFToSinglePagePDF = async (file) => {
    console.log(`${new Date()} DEBUT SEPARATION PDF`);
    const excecutionStartTime = performance.now();
    const fileName = fileService.getFileNameWithoutExtension(file);
    try {
        let currentPDFBytes = fs.readFileSync(file);
        const currentPDFDoc = await PDFDocument.load(currentPDFBytes);
        const pageNumbers = currentPDFDoc.getPageCount();
        let pdfNumero = 1;
        let pathToPdf = [];
        for (let i = 0; i < pageNumbers; i++) {
            const newPDF = await PDFDocument.create();
            const [page] = await newPDF.copyPages(currentPDFDoc, [i]);
            newPDF.addPage(page);
            const pdfBytes = await newPDF.save();
            fs.writeFileSync(path.join(__dirname, '..', '..', '..', 'documents', 'splited_PDF', `${fileName}_${pdfNumero}.pdf`), pdfBytes);
            pathToPdf.push(path.join(__dirname, '..', '..', '..', 'documents', 'splited_PDF', `${fileName}_${pdfNumero}.pdf`));
            pdfNumero++;
        }
        const excecutionStopTime = performance.now();
        let executionTime = excecutionStopTime - excecutionStartTime;
        console.log('Split pdf time : ', time.millisecondToTime(executionTime));
        console.log(`${new Date()} FIN SEPARATION PDF`);
        return pathToPdf;
    } catch (err) {
        console.log(err);
    }
}
