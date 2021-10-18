exports.getFileName = (filePath) => {
    const filePathArr = filePath.split('/');
    const fileName = filePathArr[filePathArr.length - 1];
    return fileName;
}

exports.getFileExtension = (filePath) => {
    const fileName = this.getFileName(filePath);
    const fileNameArr = fileName.split('.');
    const extension = fileNameArr[fileNameArr.length - 1];
    return extension;
}

exports.getFileNameWithoutExtension = (filePath) => {
    const fileName = this.getFileName(filePath);
    const fileNameArr = fileName.split('.');
    const fileNameWithoutExtension = fileNameArr[0];
    return fileNameWithoutExtension;
}