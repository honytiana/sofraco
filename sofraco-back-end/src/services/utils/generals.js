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