exports.setIndexHeaders = (cell, colNumber, arrReg, indexesHeader) => {
    for (let reg in arrReg) {
        if (cell.value.match(arrReg[reg])) {
            const values = Object.values(indexesHeader);
            const test = values.some(ih => {
                return ih === [colNumber, (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value]
            });
            if (!test && indexesHeader[reg] === null) {
                indexesHeader[reg] = [colNumber, (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value];
            }
            delete arrReg[reg];
            break;
        }
    }
};

exports.createContratSimpleHeader = (row, indexesHeader) => {
    let contrat = {};
    let error = [];
    for (let ih in indexesHeader) {
        if (indexesHeader[ih] !== null) {
            const value = row.getCell(indexesHeader[ih][0]).value;
            if (ih.match(/date/i) || ih.match(/periode/i)) {
                if (value !== null && typeof value === 'number') {
                    contrat[ih] = new Date(0, 0, value, 0, 0, 0);
                } else {
                    contrat[ih] = (indexesHeader[ih] !== null) && ((typeof value === 'string') ?
                        value.trim() : value);
                }
            } else {
                contrat[ih] = (indexesHeader[ih] !== null) && ((typeof value === 'string') ?
                    value.trim() : value);
            }
        }
        if (indexesHeader[ih] !== null) {
            const value = row.getCell(indexesHeader[ih][0]).value;
            if (value === null || value === '') {
                error.push(row.getCell(indexesHeader[ih][0]).address);
            }
        }
    }
    return { contrat, error };
}

exports.createContratDoubleHeader = (row, indexesFirstHeader, indexesSecondHeader, indexesHeader) => {
    let contrat = {};
    let error = [];
    for (let iF in indexesFirstHeader) {
        contrat[iF] = {};
    }
    for (let i in contrat) {
        for (let s in indexesSecondHeader) {
            const value = row.getCell(indexesSecondHeader[s][0]).value;
            if (s in indexesHeader[i]) {
                contrat[i][s] = (indexesSecondHeader[s] !== null) && ((typeof value === 'string') ?
                    value.trim() : value);
                if (indexesSecondHeader[s] !== null) {
                    if (value === null || value === '') {
                        error.push(row.getCell(indexesSecondHeader[s][0]).address);
                    }
                }
            }
        }
    }
    return { contrat, error };
}

exports.regroupContratByCourtier = (allContrats, codeCourtier) => {
    let allContratsPerCourtier = [];
    let courtiers = [];
    allContrats.forEach((element, index) => {
        if (courtiers.indexOf(element[codeCourtier]) < 0) {
            courtiers.push(element[codeCourtier]);
        }
    })
    for (let courtier of courtiers) {
        let contratCourtier = { courtier: '', contrats: [] };
        allContrats.forEach((element, index) => {
            contratCourtier.courtier = courtier;
            if (element[codeCourtier] === contratCourtier.courtier) {
                contratCourtier.contrats.push(element);
            }
        });
        allContratsPerCourtier.push(contratCourtier);
    }
    return allContratsPerCourtier;
};