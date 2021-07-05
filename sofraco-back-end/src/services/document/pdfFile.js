const path = require('path');
const Pdf2Img = require('pdf2img-promises');


exports.convertPDFToImg = async (file) => {
    const filePath = file;
    const fileNameWithExtensionArr = filePath.split('/');
    const fileNameWithExtension = fileNameWithExtensionArr[fileNameWithExtensionArr.length - 1];
    const filename = fileNameWithExtension.split('.')[0];
    let converter = new Pdf2Img();
    converter.setOptions({
        type: 'jpg',
        size: 1024,
        density: 600,
        outputdir: path.join(__dirname, '..', '..', '..', 'documents', 'temp'),
    });
    const data = await converter.convert(file);
    const images = data.message;
    return images;
}
