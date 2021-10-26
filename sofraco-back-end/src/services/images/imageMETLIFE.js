const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

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

const is_valid_ord = (cy, img_cv) => {
    res = false
    if (cy >= 0 && cy <= img_cv.rows) {
        res = true
    }
    return res
}

const draw_and_crop_cell = (cv, img, jimp_img, x_cell, y_cell, x2_cell, y2_cell, name_cell, cells_output, crop_cell = true, show_tracage = false) => {
    // draw
    // x2_cell, y2_cell
    // let x2_cell = x_cell + w_cell;
    // let y2_cell = y_rows;
    let point1_draw = new cv.Point(x_cell, y_cell);
    let point2_draw = new cv.Point(x2_cell, y2_cell);
    // crop
    let x_crop = x_cell;
    let y_crop = y_cell;
    let height_rect_crop = Math.abs(y2_cell - y_cell);
    let width_rect_crop = Math.abs(x2_cell - x_cell);
    let rectangleColor = new cv.Scalar(255, 0, 0);

    if (show_tracage) {
        try {
            cv.rectangle(img, point1_draw, point2_draw, rectangleColor, 2, cv.LINE_AA, 0);
        } catch (err) {
            console.log("error tracage");
            console.log(err);
        }
    }
    if (crop_cell) {
        try {
            const cropped_cell = new Jimp(jimp_img);
            cropped_cell.crop(x_crop, y_crop, width_rect_crop, height_rect_crop);
            cropped_cell.write(name_cell);
            cells_output.push(name_cell);
        } catch (err) {
            console.log("error crop");
            console.log(err);
        }
    }
}

exports.getCellFromImageMETLIFE = async (cv, file_name, input_path, output_path, show_tracage = false, frame_data = false, crop_lines = false, crop_cell = false, cell_width = []) => {
    let data_output = [];
    try {
        const input = path.join(input_path, file_name);
        const output = path.join(output_path, file_name.replace('.', '_out.'));
        if (!fs.existsSync(path.join(output_path, 'tracage'))) {
            fs.mkdirSync(path.join(output_path, 'tracage'));
        }
        const outputPathTracage = path.join(output_path, 'tracage', file_name.replace('.', '_out.'));
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
            lines_tab.push({ coord: [lines.data32S[i], lines.data32S[i + 1], lines.data32S[i + 2], lines.data32S[i + 3]], height: 2 });
        }
        gray.delete();
        edges.delete();
        lines.delete();

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

        if (lines_tab_valid[lines_tab_valid.length - 1]) {
            lines_tab_valid[lines_tab_valid.length - 1].height = 50; let i = 1;
            for (let line of lines_tab_valid) {
                let x1_line = line.coord[0];
                let y1_line = line.coord[1];
                let x2_line = line.coord[2];
                let y2_line = line.coord[3];
                if (x2_line - x1_line > 2200) {
                    let line_output = {};
                    let height_rect = parseInt(line.height);
                    let y_rows = y1_line + height_rect;
                    let width_rows = x2_line - x1_line;
                    let x_cell = x1_line;
                    if (is_valid_ord(y_rows, img)) {
                        let c = 1;
                        let cells_output = [];
                        if (height_rect > 80) {
                            for (let w_cell of cell_width) {
                                let x2_cell = x_cell + w_cell;
                                let y2_cell = y_rows;
                                const name_cell = output.replace('.', '_l_' + i + '_c_' + c + '.');
                                draw_and_crop_cell(cv, img, jimp_img, x_cell, y1_line, x2_cell, y2_cell, name_cell, cells_output, crop_cell = true, show_tracage = true);
                                x_cell = x2_cell;
                                c += 1;
                            }
                        }
                        let cell_width2 = [1246, 355, 250, 200, 200];
                        if (height_rect < 60) {
                            for (let w_cell of cell_width2) {
                                let x2_cell = x_cell + w_cell;
                                let y2_cell = y_rows;
                                const name_cell = output.replace('.', '_l_' + i + '_c_' + c + '.');
                                draw_and_crop_cell(cv, img, jimp_img, x_cell, y1_line, x2_cell, y2_cell, name_cell, cells_output, crop_cell = true, show_tracage = true);
                                x_cell = x2_cell;
                                c += 1;
                            }
                        }
                        if (cells_output.length > 0) { line_output.cell = cells_output; }

                        if (crop_lines) {
                            try {
                                // const cropped_image = await Jimp.read(input);
                                const cropped_image = new Jimp(jimp_img);
                                cropped_image.crop(x1_line, y_rows, width_rows, h);
                                n = output.replace('.', '_l_' + i + '.');
                                cropped_image.write(n);
                                line_output.line = n;
                                // if (frame_data):
                                //     detect_cell(n)
                            } catch (err) {
                                console.log("error crop 2");
                                console.log(err);
                            }

                        }
                        i += 1;
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
        }


    } catch (err) {
        console.log(err);
    }

    return data_output;
}

exports.getImageBottom = async (cv, file_name, input_path, output_path, show_tracage = false, crop_cell = false) => {
    let data_output = []
    try {
        const input = input_path + '/' + file_name;
        const output = output_path + '/' + file_name.replace('.', '_out.');
        const outputPathTracage = output_path + '/tracage/' + file_name.replace('.', '_out.');
        const image = await loadImage(input);
        const img = cv.imread(image);
        const jimp_img = await Jimp.read(input);
        let name_cell;

        let gray = new cv.Mat();
        cv.cvtColor(img, gray, cv.COLOR_BGR2GRAY);
        let edges = new cv.Mat();
        cv.Canny(gray, edges, 50, 500, 3);
        let rectangleColor = new cv.Scalar(255, 0, 0);
        let point1 = new cv.Point(2050, 3400);
        let point2 = new cv.Point(2350, 3500);
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
                cropped_cell.crop(2050, 3400, 300, 100);
                name_cell = output.replace('.', '_l_' + '_c_' + '.');
                cropped_cell.write(name_cell);
            } catch (err) {
                console.log("error crop");
                console.log(err);
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
        return name_cell;
    } catch (err) {
        console.log(err);
    }

}
