const fs = require('fs');
const path = require('path');

exports.getFileName = (filePath) => {
    const filePathArr = filePath.split('/');
    const fileName = filePathArr[filePathArr.length - 1];
    return fileName;
};

exports.getFileExtension = (filePath) => {
    const fileName = this.getFileName(filePath);
    const fileNameArr = fileName.split('.');
    const extension = fileNameArr[fileNameArr.length - 1];
    return extension;
};

exports.getFileNameWithoutExtension = (filePath) => {
    const fileName = this.getFileName(filePath);
    const fileNameArr = fileName.split('.');
    const fileNameWithoutExtension = fileNameArr[0];
    return fileNameWithoutExtension;
};

exports.createDirectory = (directory) => {
    try {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory)
        }
    } catch (err) {
        throw err;
    }
};

exports.deleteDirectory = (directory) => {
    fs.rm(directory, { recursive: true }, (err) => {
        if (err) throw err;
    });
};

exports.deleteFilesinDirectory = (directory) => {
    fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            if (file !== '.gitkeep') {
                if (fs.existsSync(file)) {
                    fs.unlink(path.join(directory, file), err => {
                        if (err) throw err;
                    });
                }
            }
        }
    });
};

exports.deleteFile = (file) => {
    if (fs.existsSync(file)) {
        fs.unlink(file, err => {
            if (err) throw err;
        });
    }
};
