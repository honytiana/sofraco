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
    let images = [];
    let iteration = 0;
    console.log(`${new Date()} DEBUT REGROUPEMENT PAR BORDEREAU METLIFE`);
    try {
        while (pathsToPDF.length > 0) {
            delete require.cache[require.resolve('../../../opencv.js')];
            delete require.cache[require.resolve('../images/imageManagment')];
            delete require.cache[require.resolve('../utils/pdfFile')];
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
                        fileService.deleteFile(pathsToPDF[i]);
                    }
                    images.push(img);
                    pathsToPDF.splice(0, numero);
                    break;
                }
            }
            iteration++;
        }
    } catch (err) {
        throw err;
    }

    console.log(`${new Date()} FIN REGROUPEMENT PAR BORDEREAU METLIFE`);
    console.log(`Taille images : ${images.length}`);
    return images;
};

exports.split100pagesMax = async (file) => {
    console.log(`${new Date()} DEBUT SEPARATION par 100 pages`);
    const fileName = fileService.getFileNameWithoutExtension(file);
    let currentPDFBytes = fs.readFileSync(file);
    const currentPDFDoc = await PDFDocument.load(currentPDFBytes);
    const pageNumbers = currentPDFDoc.getPageCount();
    if (pageNumbers <= 100) {
        console.log(`${new Date()} SEPARATION par 100 pages`);
        return [file];
    } else {
        const pathsToPDF = await this.splitPDFToSinglePagePDF(file);
        let numberOfPages = [];
        const testPages = false;
        if (!testPages) {
            while (pathsToPDF.length > 0) {
                const lenthPathsToPDFInitial = pathsToPDF.length;
                for (let i = (pathsToPDF.length >= 100 ? 99 : pathsToPDF.length - 1); i >= 0; i--) {
                    if (pathsToPDF.length < lenthPathsToPDFInitial) {
                        break;
                    }
                    const image = await pdfService.convertPDFToImg(pathsToPDF[i]);
                    const allFilesFromOpenCV = await imageManagment.loadOpenCV(image, 'METLIFE2');
                    const textFilePath = getTextFromImages(allFilesFromOpenCV);
                    const content = fs.readFileSync(textFilePath, { encoding: 'utf-8' });
                    let data = content.split('\n');
                    for (let d of data) {
                        if (d.match(/Page 1[/]\d/i)) {
                            const dArray = d.split('/');
                            const numero = parseInt(dArray[dArray.length - 1]);
                            const numberOfPage = i + numero;
                            numberOfPages.push(numberOfPage);
                            pathsToPDF.splice(0, numberOfPage);
                            break;
                        }
                    }
                }
            }
            const directorySplitedPDF = path.join(__dirname, '..', '..', '..', 'documents', 'splited_PDF');
            fileService.deleteFilesinDirectory(directorySplitedPDF);
        }
        else {
            numberOfPages = [100, 100, 100, 64];
        }
        let pdfNumero = 1;
        let pdfPaths = [];
        for (let page of numberOfPages) {
            const newPDF = await PDFDocument.create();
            for (let i = 0; i < page; i++) {
                const [pageToAdd] = await newPDF.copyPages(currentPDFDoc, [i]);
                newPDF.addPage(pageToAdd);
            }
            const pdfBytes = await newPDF.save();
            const pathPdf = path.join(__dirname, '..', '..', '..', 'documents', 'uploaded', `${fileName}_${pdfNumero}.pdf`);
            fs.writeFileSync(pathPdf, pdfBytes);
            pdfPaths.push(pathPdf);
            pdfNumero++;
        }
        console.log(`${new Date()} FIN SEPARATION par 100 pages`);
        return pdfPaths;
    }
};

exports.splitPDFMETLIFEByBordereaux = async (file) => {
    try {
        console.log(`${new Date()} DEBUT SEPARATION PDF METLIFE`);
        const pathsToPDF = await this.splitPDFToSinglePagePDF(file);
        const fileName = fileService.getFileNameWithoutExtension(file);
        console.log(`${new Date()} FIN SEPARATION PDF METLIFE`);
        console.log(`${new Date()} DEBUT REGROUPEMENT PAR BORDEREAU PDF METLIFE`);
        let currentPDFBytes = fs.readFileSync(file);
        const currentPDFDoc = await PDFDocument.load(currentPDFBytes);
        let pdfPaths = [];
        let pdfNumero = 1;
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
                    const newPDF = await PDFDocument.create();
                    for (let i = 0; i < numero; i++) {
                        const [pageToAdd] = await newPDF.copyPages(currentPDFDoc, [i]);
                        newPDF.addPage(pageToAdd);
                    }
                    const pdfBytes = await newPDF.save();
                    const pathPdf = path.join(__dirname, '..', '..', '..', 'documents', 'uploaded', `${fileName}_${pdfNumero}.pdf`);
                    fs.writeFileSync(pathPdf, pdfBytes);
                    pathsToPDF.splice(0, numero);
                    pdfPaths.push(pathPdf);
                    break;
                }
            }
            pdfNumero++;
        }
        console.log(`${new Date()} FIN SEPARATION par bordereaux`);
        return pdfPaths;
    } catch (err) {
        throw err;
    }
};

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
