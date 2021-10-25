const path = require('path');
const imageMETLIFE = require('./imageMETLIFE');
const imageAPIVIA = require('./imageAPIVIA');

exports.loadOpenCV = (images, company) => {
    delete require.cache[require.resolve('../../../opencv.js')];
    return new Promise((resolve, reject) => {
        try {
            global.Module = {
                onRuntimeInitialized: async () => {
                    const dirPath = path.join(__dirname, '..', '..', '..', 'documents', 'temp');
                    let allFiles = []
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
                        }
                        allFiles.push(file_names);
                    }
                    resolve(allFiles);
                }
            };
            global.cv = require('../../../opencv.js');
        } catch (err) {
            console.log(err);
        }

    });
}