const path = require('path');
const fs = require('fs');
const PDFParser = require("pdf2json");
const { PDFDocument } = require('pdf-lib');
const { performance } = require('perf_hooks');
const time = require('../utils/time');
const fileService = require('../utils/files');

exports.splitPDFMETLIFE = (file) => {
    console.log('DEBUT SEPARATION PDF METLIFE');
    const excecutionStartTime = performance.now();
    let pdfParser = new PDFParser(this, 1);
    const fileName = fileService.getFileNameWithoutExtension(file);
    pdfParser.loadPDF(file);
    return new Promise((resolve, reject) => {
        pdfParser.on("pdfParser_dataError", (errData) => {
            reject(errData.parserError);
        });
        pdfParser.on("pdfParser_dataReady", async (pdfData) => {
            const pdfContent = pdfParser.getRawTextContent();
            const separateur = '\r\n';
            const pdfContentArr = pdfContent.split(separateur);
            let pathToPdf = [];
            const pageNumero = pdfContentArr.filter((mot, index) => {
                return mot.match(/^Page 1[/]\d/i);
            });
            const pageNumbers = pageNumero.map((numero, index) => {
                return parseInt(numero.charAt(numero.length - 1));
            });

            let currentPDFBytes = fs.readFileSync(file);
            const currentPDFDoc = await PDFDocument.load(currentPDFBytes);
            let currentPageNumero = 0;
            let pdfNumero = 1;
            for (let numbers of pageNumbers) {
                if (pageNumbers.length === 1) {
                    fs.writeFileSync(path.join(__dirname, '..', '..', '..', 'documents', 'splited_PDF', `${fileName}_${pdfNumero}.pdf`), currentPDFBytes);
                    pathToPdf.push(path.join(__dirname, '..', '..', '..', 'documents', 'splited_PDF', `${fileName}_${pdfNumero}.pdf`));
                } else {
                    let pages = [];
                    for (let i = 0; i < numbers; i++) {
                        pages.push(currentPageNumero);
                        currentPageNumero++;
                    }
                    const newPDF = await PDFDocument.create();
                    const copiedPages = await newPDF.copyPages(currentPDFDoc, pages);
                    for (let page of copiedPages) {
                        newPDF.addPage(page);
                    }
                    const pdfBytes = await newPDF.save();
                    fs.writeFileSync(path.join(__dirname, '..', '..', '..', 'documents', 'splited_PDF', `${fileName}_${pdfNumero}.pdf`), pdfBytes);
                    pathToPdf.push(path.join(__dirname, '..', '..', '..', 'documents', 'splited_PDF', `${fileName}_${pdfNumero}.pdf`));
                    pdfNumero++;
                }
            }
            const excecutionStopTime = performance.now();
            let executionTime = excecutionStopTime - excecutionStartTime;
            console.log('Split pdf time : ', time.millisecondToTime(executionTime));
            console.log('FIN SEPARATION PDF METLIFE');
            resolve(pathToPdf);
        });
    })
}

exports.splitPDFToSinglePagePDF = async (file) => {
    console.log('DEBUT SEPARATION PDF');
    const excecutionStartTime = performance.now();
    const fileName = fileService.getFileNameWithoutExtension(file);
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
    console.log('FIN SEPARATION PDF');
    return pathToPdf;
}
