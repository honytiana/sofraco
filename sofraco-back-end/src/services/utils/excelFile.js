exports.borderType = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
};

exports.font = { bold: false, name: 'Arial', size: 10 };

exports.setSimpleCell = (workSheet, rowNumber, cell, value, font = font) => {
    const row = workSheet.getRow(rowNumber);
    row.font = font;
    row.getCell(cell).value = value;
};

exports.setStylizedCell = (workSheet, rowNumber, cell, value, border, borderType = this.borderType, font = this.font, numFmt = '', fill = 'ffffff', alignmentHorizontal = 'center', alignmentVertical = 'middle', wrapText = false) => {
    const row = workSheet.getRow(rowNumber);
    row.getCell(cell).font = font;
    row.getCell(cell).value = value;
    row.getCell(cell).numFmt = numFmt;
    row.getCell(cell).alignment = { horizontal: alignmentHorizontal, vertical: alignmentVertical, wrapText : wrapText };
    if (border) {
        row.getCell(cell).border = borderType;
    }
    row.getCell(cell).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fill }
    };
};

exports.setMergedCell = (cellInfo, border, borderType = this.borderType, font = this.font, numFmt = '', fill = 'ffffff', alignmentHorizontal = 'center', alignmentVertical = 'middle', wrapText = false) => {
    if (cellInfo.mergedCells) {
        cellInfo.workSheet.mergeCells(cellInfo.mergedCells);
    }
    this.setStylizedCell(cellInfo.workSheet, cellInfo.rowNumber, cellInfo.cell, cellInfo.value, border, font, numFmt = '', borderType, fill, alignmentHorizontal, alignmentVertical, wrapText);
};