const path = require('path');
const { execSync } = require('child_process');
const splitPdfService = require('../pdf/splitPDF');
const fileService = require('./files');


exports.convertPDFToImg = async (file) => {
    const filePath = file;
    const pdfPaths = await splitPdfService.splitPDFToSinglePagePDF(filePath);
    let imagePaths = [];
    for (let pdfPath of pdfPaths) {
        const pdfName = fileService.getFileNameWithoutExtension(pdfPath);
        const finalPath = path.join(__dirname, '..', '..', '..', 'documents', 'temp', `${pdfName}.jpg`);
        execSync(`gm convert -append -flatten -density 300 ${pdfPath} ${finalPath}`);
        imagePaths.push(finalPath);
    }
    return imagePaths;
}
