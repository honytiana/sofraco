const path = require('path');
const fs = require('fs');
const PDFParser = require("pdf2json");
const { PDFDocument } = require('pdf-lib');

exports.splitPDF = (file) => {
    let pdfParser = new PDFParser(this, 1);
    console.log('DEBUT SEPARATION PDF');
    let time = 0;
    const timeout = setInterval(() => {
        time++;
    }, 1000);
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
                fs.writeFileSync(path.join(__dirname, '..', '..', '..', 'documents', 'splitedPDF', `name_${pdfNumero}.pdf`), pdfBytes);
                pathToPdf.push(path.join(__dirname, '..', '..', '..', 'documents', 'splitedPDF', `name_${pdfNumero}.pdf`));
                pdfNumero++;
            }
            console.log(time);
            clearInterval(timeout);
            console.log('FIN SEPARATION PDF');
            resolve(pathToPdf);
        });
    })

}
