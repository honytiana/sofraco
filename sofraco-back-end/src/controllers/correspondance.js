const path = require('path');

const config = require('../../config.json');
const companyHandler = require('../handlers/companyHandler');
const correspondanceHandler = require('../handlers/correspondanceHandler');
const courtierHandler = require('../handlers/courtierHandler');
const correspondanceService = require('../services/features/correspondances');

exports.createCorrespondance = async (req, res) => {
    try {
        const correspondances = await correspondanceService.readExcelTableauCorrespondance(req.params.role);
        let i = 0;
        for (let correspondance of correspondances) {
            const corr = await correspondanceHandler.getCorrespondanceByCourtier(correspondance.courtier);
            if (corr) {
                for (let company of correspondance.companies) {
                    await correspondanceHandler.addCodeCourtier(correspondance.courtier, company.idCompany, company.company, company.companyGlobalName, company.particular, company.code);
                }
            } else {
                const c = await correspondanceHandler.createCorrespondance(correspondance);
            }
            i++;
        }
        const corr = await correspondanceHandler.getCorrespondances();
        for (let c of corr) {
            let a = false;
            let ae = false;
            let e = false;
            let h = false;
            const courtier = await courtierHandler.getCourtierById(c.courtier);
            const apivia = await companyHandler.getCompanyByName('APIVIA');
            const arpepEncours = await companyHandler.getCompanyByName('APREP ENCOURS');
            const eres = await companyHandler.getCompanyByName('ERES');
            const hodeva = await companyHandler.getCompanyByName('HODEVA');
            for (let comp of c.companies) {
                if (comp.company === 'APIVIA') {
                    a = true;
                }
                if (comp.company === 'APREP ENCOURS') {
                    ae = true;
                }
                if (comp.company === 'ERES') {
                    e = true;
                }
                if (comp.company === 'HODEVA') {
                    h = true;
                }
            }
            if (!a) {
                await correspondanceHandler.addCodeCourtier(c.courtier, apivia._id, apivia.name, apivia.globalName, '', `${courtier.lastName} ${courtier.firstName}`);
            }
            if (!ae) {
                await correspondanceHandler.addCodeCourtier(c.courtier, arpepEncours._id, arpepEncours.name, arpepEncours.globalName, arpepEncours.name, courtier.cabinet);
            }
            if (!e) {
                await correspondanceHandler.addCodeCourtier(c.courtier, eres._id, eres.name, eres.globalName, '', `${courtier.lastName} ${courtier.firstName}`);
            }
            if (!h) {
                await correspondanceHandler.addCodeCourtier(c.courtier, hodeva._id, hodeva.name, hodeva.globalName, '', courtier.cabinet);
            }
        }

        res.status(200).end(`${new Date()} Correspondances added`);
    } catch (error) {
        res.status(400).json({ error })
    }

};

exports.addCodeCourtier = async (req, res) => {
    console.log(`${new Date()} Add code courtier`);
    const courtier = req.params.courtier;
    const idCompany = req.body.company;
    const particular = req.body.particular;
    const code = req.body.code;
    try {
        const company = await companyHandler.getCompany(idCompany);
        const corr = await correspondanceHandler.getCorrespondanceByCourtier(courtier);
        if (corr) {
            const correspondances = await correspondanceHandler.addCodeCourtier(courtier, idCompany, company.name, company.globalName, particular, code);
        } else {
            const correspondance = {
                courtier,
                companies: [
                    {
                        idCompany: idCompany,
                        company: company.name,
                        companyGlobalName: company.globalName,
                        particular: particular,
                        code: code,
                        is_enabled: true
                    }

                ]
            };
            const c = await correspondanceHandler.createCorrespondance(correspondance);
        }
        res.status(200).end(`Code added`);
    } catch (error) {
        res.status(400).json({ error })
    }
};

exports.editCodeCourtier = async (req, res) => {
    console.log(`${new Date()} Modifier le code courtier`);
    const courtier = req.params.courtier;
    const company = req.body.company;
    const particular = req.body.particular;
    const code = req.body.code;
    try {
        const correspondances = await correspondanceHandler.editCodeCourtier(courtier, company, code);
        res.status(200).end(`Code modifié`);
    } catch (error) {
        res.status(400).json({ error })
    }
};

exports.getCorrespondance = async (req, res) => {
    console.log(`${new Date()} get correspondance`);
    try {
        const correspondance = await correspondanceHandler.getCorrespondance(req.params.id);
        res.status(200).json(correspondance);
    } catch (error) {
        res.status(400).json({ error });
    }
}

exports.getCorrespondanceByCourtier = async (req, res) => {
    console.log(`${new Date()} get correspondance by courtier`);
    try {
        const correspondance = await correspondanceHandler.getCorrespondanceByCourtier(req.params.courtier);
        res.status(200).json(correspondance);
    } catch (error) {
        res.status(400).json({ error });
    }
}

exports.getCorrespondances = async (req, res) => {
    console.log(`${new Date()} get correspondances`);
    try {
        const correspondances = await correspondanceHandler.getCorrespondances();
        res.status(200).json(correspondances);
    } catch (error) {
        res.status(400).json({ error });
    }
}

exports.updateCorrespondance = async (req, res) => {
    console.log(`${new Date()} update correpondance`);
    try {
        const correspondance = await correspondanceHandler.updateCorrespondance(req.params.id, req.body);
        res.status(200).json(correspondance);
    } catch (error) {
        res.status(500).json({ error });
    }
}

exports.deleteCorrespondance = async (req, res) => {
    console.log(`${new Date()} Delete correspondance`);
    try {
        const corr = await correspondanceHandler.deleteCorrespondance(req.params.id);
        res.status(200).end('Correspondance deleted');
    } catch (error) {
        res.status(500).json({ error });
    }
}

exports.deleteCodeCourtier = async (req, res) => {
    console.log(`${new Date()} Delete code courtier`);
    try {
        const corr = await correspondanceHandler.deleteCodeCourtier(req.params.courtier, req.params.code);
        res.status(200).end('Code courtier deleted');
    } catch (error) {
        res.status(500).json({ error });
    }
}

exports.deleteAllCorrespondances = async (req, res) => {
    console.log(`${new Date()} Delete all correspondances`);
    try {
        await correspondanceHandler.deleteAllCorrespondances();
        res.status(200).end('Correspondances deleted');
    } catch (error) {
        res.status(500).json({ error });
    }
}
