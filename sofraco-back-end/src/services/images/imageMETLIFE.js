const Jimp = require('jimp');
const path = require('path');

const { JSDOM } = require('jsdom');
const { Canvas, createCanvas, Image, ImageData, loadImage } = require('canvas');
const dom = new JSDOM();
global.document = dom.window.document;
// The rest enables DOM image and canvas and is provided by node-canvas
global.Image = Image;
global.HTMLCanvasElement = Canvas;
global.ImageData = ImageData;
global.HTMLImageElement = Image;

function is_valid_abcisse(cx, img_cv) {
    res = false
    if (cx >= 0 && cx <= img_cv.cols) {
        res = true
    }
    return res
}

function is_valid_ord(cy, img_cv) {
    res = false
    if (cy >= 0 && cy <= img_cv.rows) {
        res = true
    }
    return res
}

const getCellFromImageMETLIFE = async (file_name, input_path, output_path, show_tracage = false, frame_data = false, crop_lines = false, crop_cell = false, cell_width = []) => {
    let data_output = []
    try {
        const input = input_path + '/' + file_name;
        const output = output_path + '/' + file_name.replace('.', '_out.');
        const outputPathTracage = output_path + '/tracage/' + file_name.replace('.', '_out.');
        const image = await loadImage(input);
        const img = cv.imread(image);
        const jimp_img = await Jimp.read(input);

        let gray = new cv.Mat();
        cv.cvtColor(img, gray, cv.COLOR_BGR2GRAY);
        let edges = new cv.Mat();
        cv.Canny(gray, edges, 50, 500, 3);
        const minLineLength = 20;
        const maxLineGap = 30;
        let lines = new cv.Mat();
        // get all lines
        cv.HoughLinesP(edges, lines, 1, Math.PI / 180, 100, minLineLength, maxLineGap);
        let lines_tab = [];
        for (let i = 0; i < lines.rows; i += 4) {
            lines_tab.push({ coord: [lines.data32S[i], lines.data32S[i + 1], lines.data32S[i + 2], lines.data32S[i + 3]], height: 2 })
        }
        gray.delete()
        edges.delete()
        lines.delete()

        const sort_line = (e1, e2) => {
            return e1.coord[1] - e2.coord[1];
        }
        // sort lines tab
        lines_tab.sort(sort_line);

        //filter lines tab to have good distane and width
        let lines_tab_valid = [lines_tab[0]];
        for (let i = 1; i < lines_tab.length; i++) {
            let x1 = lines_tab[i].coord[0];
            let y1 = lines_tab[i].coord[1];
            let x2 = lines_tab[i].coord[2];
            let y2 = lines_tab[i].coord[3];

            let xi_1 = lines_tab_valid[lines_tab_valid.length - 1].coord[0];
            let yi_1 = lines_tab_valid[lines_tab_valid.length - 1].coord[1];
            let xi_2 = lines_tab_valid[lines_tab_valid.length - 1].coord[2];
            let yi_2 = lines_tab_valid[lines_tab_valid.length - 1].coord[3];

            d = Math.abs(y1 - yi_1);
            if (i > 0 && d > 20 && x2 - x1 > 2200) {
                // lines_tab[i].height = d;
                lines_tab_valid[lines_tab_valid.length - 1].height = d;
                lines_tab_valid.push(lines_tab[i]);
            }
        }

        // compute average heigth
        // let heights = [];
        // let one_tier = Math.floor(lines_tab_valid.length / 3);
        // for (let i = one_tier; i < lines_tab_valid.length - one_tier; i++) {
        //     heights.push(lines_tab_valid[i].height);
        // }
        // for (let l2 of lines_tab_valid) {
        //     heights.push(l2.height);
        // }
        // let avg_h = heights.reduce((a, b) => a + b) / heights.length;

        lines_tab_valid[lines_tab_valid.length - 1].height = 50;

        let i = 1;
        for (let line of lines_tab_valid) {
            let x1 = line.coord[0];
            let y1 = line.coord[1];
            let x2 = line.coord[2];
            let y2 = line.coord[3];
            if (x2 - x1 > 2200) {
                let line_output = {};
                let h = -parseInt(line.height)
                console.log(`height : ${line.height}`)
                // if ((avg_h * 0.9 > h || h > avg_h * 1.2) && i < 4) {
                //     h = parseInt(avg_h);
                // }
                // if (h > avg_h * 1.2) {
                //     h = parseInt(avg_h);
                // }
                let y_rows = y1 - h;
                let width_rows = x2 - x1
                let x_cell = x1;
                if (is_valid_ord(y_rows, img)) {
                    let c = 1;
                    let cells_output = [];
                    if (-h > 100) {
                        for (let w_cell of cell_width) {
                            let x2_cell = x_cell + w_cell;
                            let y2_cell = y1 - h;
                            let width_rect = x2_cell - x_cell;
                            let height_rect = h
                            let rectangleColor = new cv.Scalar(255, 0, 0);
                            let point1 = new cv.Point(x_cell, y1);
                            let point2 = new cv.Point(x2_cell, y2_cell);
                            // console.log("x_cell: " + x_cell + " y2_cell: " + y2_cell + " width_rect: " + width_rect + " h: " + height_rect)
                            // if (is_valid_ord(y2_cell, img) && is_valid_abcisse(x2_cell, img)) {
                            if (show_tracage) {
                                try {
                                    cv.rectangle(img, point1, point2, rectangleColor, 2, cv.LINE_AA, 0);
                                } catch (err) {
                                    console.log("error tracage");
                                    console.log(err);
                                }
                            }
                            if (crop_cell) {
                                try {
                                    // const cropped_cell = await Jimp.read(input);
                                    const cropped_cell = new Jimp(jimp_img);
                                    cropped_cell.crop(x_cell, y2_cell, width_rect, height_rect);
                                    name_cell = output.replace('.', '_l_' + i + '_c_' + c + '.');
                                    cropped_cell.write(name_cell);
                                    cells_output.push(name_cell);
                                } catch (err) {
                                    console.log("error crop");
                                    console.log(err);
                                }
                            }
                            // }
                            x_cell = x2_cell
                            c += 1
                        }
                    }
                    let cell_width2 = [1246, 355, 250, 200, 200];
                    if (-h < 60) {
                        for (let w_cell of cell_width2) {
                            let x2_cell = x_cell + w_cell;
                            let y2_cell = y1 - h;
                            let width_rect = x2_cell - x_cell;
                            let height_rect = h
                            let rectangleColor = new cv.Scalar(255, 0, 0);
                            let point1 = new cv.Point(x_cell, y1);
                            let point2 = new cv.Point(x2_cell, y2_cell);
                            // console.log("x_cell: " + x_cell + " y2_cell: " + y2_cell + " width_rect: " + width_rect + " h: " + height_rect)
                            // if (is_valid_ord(y2_cell, img) && is_valid_abcisse(x2_cell, img)) {
                            if (show_tracage) {
                                try {
                                    cv.rectangle(img, point1, point2, rectangleColor, 2, cv.LINE_AA, 0);
                                } catch (err) {
                                    console.log("error tracage");
                                    console.log(err);
                                }
                            }
                            if (crop_cell) {
                                try {
                                    // const cropped_cell = await Jimp.read(input);
                                    const cropped_cell = new Jimp(jimp_img);
                                    cropped_cell.crop(x_cell, y2_cell, width_rect, height_rect);
                                    name_cell = output.replace('.', '_l_' + i + '_c_' + c + '.');
                                    cropped_cell.write(name_cell);
                                    cells_output.push(name_cell);
                                } catch (err) {
                                    console.log("error crop");
                                    console.log(err);
                                }
                            }
                            // }
                            x_cell = x2_cell
                            c += 1
                        }
                    }
                    if (cells_output.length > 0) { line_output.cell = cells_output; }

                    if (crop_lines) {
                        try {
                            // const cropped_image = await Jimp.read(input);
                            const cropped_image = new Jimp(jimp_img)
                            cropped_image.crop(x1, y_rows, width_rows, h);
                            n = output.replace('.', '_l_' + i + '.');
                            cropped_image.write(n);
                            line_output.line = n
                            // if (frame_data):
                            //     detect_cell(n)
                        } catch (err) {
                            console.log("error crop 2");
                            console.log(err);
                        }

                    }
                    i += 1
                    data_output.push(line_output);
                }
            }
        }
        if (show_tracage) {
            // cv.imwrite(output, img)
            new Jimp({
                width: img.cols,
                height: img.rows,
                data: Buffer.from(img.data)
            })
                .write(outputPathTracage);
        }
        img.delete();
        const jimp_img_out = await Jimp.read(input);
    } catch (err) {
        console.log(err);
    }

    return data_output;
}

exports.loadOpenCV = (images) => {
    return new Promise((resolve, reject) => {
        global.Module = {
            async onRuntimeInitialized() {
                // let cw = [190, 180, 160, 100, 260, 200, 220, 80, 190, 190, 172, 172, 172];
                let cw = [170, 230, 199, 270, 175, 202, 198, 200, 200, 200, 199];
                const dirPath = path.join(__dirname, '..', '..', '..', 'documents', 'temp');
                let allFiles = []
                for (let image_name of images) {
                    const file_names = await getCellFromImageMETLIFE(
                        image_name.replace(/.+\/([^/])/, '$1'),
                        dirPath,
                        dirPath,
                        show_tracage = true,
                        frame_data = false,
                        crop_lines = false,
                        crop_cell = false,
                        cell_width = cw
                    );
                    allFiles.push(file_names);
                }
                resolve(allFiles);
            }
        }

        global.cv = require('../../../opencv.js');
    })
}