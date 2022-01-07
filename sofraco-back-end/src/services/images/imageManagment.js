const path = require('path');
const imageMETLIFE = require('./imageMETLIFE');
const imageAPIVIA = require('./imageAPIVIA');

exports.loadOpenCV = (images, company) => {
    require('events').EventEmitter.prototype._maxListeners = 100;
    delete require.cache[require.resolve('../../../opencv.js')];
    delete require.cache[require.resolve('./imageMETLIFE')];
    delete require.cache[require.resolve('./imageAPIVIA')];
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve('../../../opencv.js')];
            console.log(`----- WebAssembly memory lenght = ${WebAssembly.Memory.length} -----------------`);
            global.Module = {
                onRuntimeInitialized: async () => {
                    const dirPath = path.join(__dirname, '..', '..', '..', 'documents', 'temp');
                    let allFiles = []
                    let numImage = 1;
                    for (let image_name of images) {
                        let file_names;
                        let cw;
                        switch (company) {
                            case 'APIVIA':
                                cw = [190, 180, 160, 100, 260, 200, 220, 80, 190, 190, 172, 172, 172];
                                file_names = await imageAPIVIA.getCellFromImageAPIVIA(
                                    cv,
                                    image_name.replace(/.+\/([^/])/, '$1'),
                                    dirPath,
                                    dirPath,
                                    show_tracage = false,
                                    frame_data = false,
                                    crop_lines = false,
                                    crop_cell = true,
                                    cell_width = cw
                                );
                                break;
                            case 'METLIFE':
                                console.log(`------ Image numero : ${numImage} ------`);
                                cw = [170, 230, 199, 270, 175, 202, 198, 200, 200, 200, 199];
                                file_names = await imageMETLIFE.getCellFromImageMETLIFE(
                                    cv,
                                    image_name.replace(/.+\/([^/])/, '$1'),
                                    dirPath,
                                    dirPath,
                                    show_tracage = false,
                                    frame_data = false,
                                    crop_lines = false,
                                    crop_cell = true,
                                    cell_width = cw
                                );
                                break;
                            case 'METLIFE2':
                                file_names = await imageMETLIFE.getImageBottom(
                                    cv,
                                    image_name.replace(/.+\/([^/])/, '$1'),
                                    dirPath,
                                    dirPath,
                                    show_tracage = false,
                                    crop_cell = true
                                );
                                break;
                        }
                        allFiles.push(file_names);
                        numImage++;
                    }
                    resolve(allFiles);
                }
            };
            global.cv = require('../../../opencv.js');
        } catch (err) {
            throw err;
        }

    });
}