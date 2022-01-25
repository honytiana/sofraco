exports.setIndexHeaders = (cell, colNumber, arrReg, indexesHeader) => {
    for (let reg in arrReg) {
        if (cell.value.match(arrReg[reg])) {
            indexesHeader[reg] = [colNumber, (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value];
        }
    }
};

exports.createContrat = (row, indexesHeader) => {
    let contrat = {};
    for (let ih in indexesHeader) {
        contrat[ih] = (indexesHeader[ih] !== null) && ((typeof row.getCell(indexesHeader[ih][0]).value === 'string') ?
        row.getCell(indexesHeader[ih][0]).value.trim() :
        row.getCell(indexesHeader[ih][0]).value);
    }
    return contrat;
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