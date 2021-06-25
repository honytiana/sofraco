const fs = require('fs');


const reIndexOf = (arr, rx) => {
    const length = arr.length;
    for (let i = 0; i < length; i++) {
        if (arr[i].match(rx)) {
            return i;
        }
    }
    return -1;
};

exports.readPdfMETLIFE = (filesPaths) => {
    let infos = { syntheseDesCommissions: null, detailDesPolices: null };
    let detailDesPolices = [];
    let syntheseDesCommissions = {};
    for (let filePath of filesPaths) {
        const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
        let data = content.split('\n');
        data = data.filter((element) => {
            return element.trim() !== '';
        });
        const filenameA = filePath.split('/');
        const filenameE = filenameA[filenameA.length - 1];
        const filename = filenameE.split('.')[0];
        const nameA = filename.split('_');
        const numero = nameA[nameA.length - 1];
        if (numero === '1') {
            let periodeEncaissement;
            let codeApporteurBeneficiaireCommissions;
            let codeApporteurEmetteur;
            let reportSoldePrecedent;
            let nombrePolicesSurLaPeriode;
            let primesEncaisseesSurLaPeriode;
            let stCommissionsCalculeesSurLaPeriode;
            let stCommissionsReprisesSurLaPeriode;
            let stCommissionsDeduitesSurLaPeriode;
            let stOperationsDiversesSurLaPeriode;
            let totalCommissionsDues;
            periodeEncaissement = data[reIndexOf(data, /Période d'encaissement du/) + 1];
            codeApporteurBeneficiaireCommissions = data[reIndexOf(data, /Code apporteur bénéficiaire des commissions/) + 1];
            codeApporteurEmetteur = data[reIndexOf(data, /Code apporteur émetteur/) + 1];
            reportSoldePrecedent = data.filter((element) => {
                return element.match(/Report solde précédent.+/)
            });
            reportSoldePrecedent = reportSoldePrecedent[0].split(':')[1].trim();

            nombrePolicesSurLaPeriode = data.filter((element) => {
                return element.match(/Nombre de polices sur la période.+/)
            });
            nombrePolicesSurLaPeriode = nombrePolicesSurLaPeriode[0].split(':')[1].trim();

            primesEncaisseesSurLaPeriode = data.filter((element) => {
                return element.match(/Total des primes encaissées sur la période.+/)
            });
            primesEncaisseesSurLaPeriode = primesEncaisseesSurLaPeriode[0].split(':')[1].trim();

            stCommissionsCalculeesSurLaPeriode = data.filter((element) => {
                return element.match(/.+commissions calculées sur la période.+/)
            });
            stCommissionsCalculeesSurLaPeriode = stCommissionsCalculeesSurLaPeriode[0].split(':')[1].trim();

            stCommissionsReprisesSurLaPeriode = data.filter((element) => {
                return element.match(/.+commissions reprises sur la période.+/)
            });
            stCommissionsReprisesSurLaPeriode = stCommissionsReprisesSurLaPeriode[0].split(':')[1].trim();

            stCommissionsDeduitesSurLaPeriode = data.filter((element) => {
                return element.match(/.+commissions déduites sur la période.+/)
            });
            stCommissionsDeduitesSurLaPeriode = stCommissionsDeduitesSurLaPeriode[0].split(':')[1].trim();

            stOperationsDiversesSurLaPeriode = data.filter((element) => {
                return element.match(/.+opérations diverses sur la période.+/)
            });
            stOperationsDiversesSurLaPeriode = stOperationsDiversesSurLaPeriode[0].split(':')[1].trim();

            totalCommissionsDues = data.filter((element) => {
                return element.match(/.+commissions dues.+/)
            });
            totalCommissionsDues = totalCommissionsDues[0].split(':')[1].trim();
            syntheseDesCommissions = {
                periodeEncaissement,
                codeApporteurBeneficiaireCommissions,
                codeApporteurEmetteur,
                reportSoldePrecedent,
                nombrePolicesSurLaPeriode,
                primesEncaisseesSurLaPeriode,
                stCommissionsCalculeesSurLaPeriode,
                stCommissionsReprisesSurLaPeriode,
                stCommissionsDeduitesSurLaPeriode,
                stOperationsDiversesSurLaPeriode,
                totalCommissionsDues
            };
            infos.syntheseDesCommissions = syntheseDesCommissions;
        }
        if (numero === '3' || numero === '4') {
            let details = [];
            data.forEach((element, index) => {
                if (index > 3) {
                    element = element.replace('$', 'S');
                    element = (!element.match(/Sous-total/)) ? element.replace(/[_-]/, ' ') : element;
                    elemeny = element.replace(/[=|]/, ' ')
                    const e = element.split(/\s+/);
                    details.push(e);
                }
            });
            let newDetails = [];
            let content = { ligne1: [], ligne2: [], ligne3: [], ligne4: [] };
            const detailLength = details.length;
            for (let i = 0; i < detailLength / 4; i++) {
                let d = details;
                d.forEach((element, index) => {
                    if (details.length > 4) {
                        if (index === 0) {
                            content.ligne1 = element;
                        }
                        if (index === 1) {
                            content.ligne2 = element;
                        }
                        if (index === 2) {
                            content.ligne3 = element;
                        }
                        if (index === 3) {
                            content.ligne4 = element;
                        };
                        if (content.ligne1.length > 0 && content.ligne2.length > 0 && content.ligne3.length > 0 && content.ligne4.length > 0) {
                            details.splice(0, 4);
                            newDetails.push(content);
                            content = { ligne1: [], ligne2: [], ligne3: [], ligne4: [] };
                            d = details;
                        }
                    }
                })
            }

            newDetails.forEach((element, index) => {
                const police = element.ligne1[reIndexOf(element.ligne1, /.*S\d.+/)] || element.ligne1[0];

                const assure = `${element.ligne1[1]} ${element.ligne1[2]} ${element.ligne2[0]}`;

                const produit = `${element.ligne1[3]} ${element.ligne2[1]} ${element.ligne2[2]} ${element.ligne3[0]} ${element.ligne3.length > 1 ? element.ligne3[1] : ''}`;

                const fractionnement = element.ligne1[reIndexOf(element.ligne1, /annuel/i)] ||
                    element.ligne1[reIndexOf(element.ligne1, /mensuel/i)];

                const periode = `${element.ligne1[element.ligne1.indexOf('du')]} ${element.ligne1[reIndexOf(element.ligne1, /^.*\d{1,2}[/]\d{1,2}[/]\d{1,2}.*$/)] ||
                    element.ligne1[element.ligne1.indexOf('du') + 1]} ${element.ligne2[element.ligne2.lenght - 1]}`;

                const etat = element.ligne1[reIndexOf(element.ligne1, /sold.*/)];

                const montant = element.ligne1[reIndexOf(element.ligne1, /^\d+.*€/)] ||
                    element.ligne1[element.ligne1.indexOf(etat) + 1];

                const mode = element.ligne1[reIndexOf(element.ligne1, /escompté/i)] ||
                    element.ligne1[reIndexOf(element.ligne1, /linéaire/i)] ||
                    element.ligne1[reIndexOf(element.ligne1, /escom.*/i)] ||
                    element.ligne1[reIndexOf(element.ligne1, /lin.*/i)] ||
                    element.ligne1[reIndexOf(element.ligne1, /escamp.*/i)] || '';

                const taux = element.ligne1[reIndexOf(element.ligne1, /^\d{1,3}/)] ||
                    element.ligne1[element.ligne1.indexOf(mode) + 1];

                const status = element.ligne1[reIndexOf(element.ligne1, /calculée/i)] ||
                    element.ligne1[reIndexOf(element.ligne1, /reprise/i)] ||
                    element.ligne1[reIndexOf(element.ligne1, /payer/i)] || '';

                const montantc = element.ligne1[reIndexOf(element.ligne1, /^\d.*€/)] ||
                    element.ligne1[element.ligne1.indexOf(status) + 1];

                const sousTotalPolice = element.ligne4[2];
                const sousTotalMontant = element.ligne4[3];

                const contrat = {
                    police,
                    assure,
                    produit
                };
                const prime = {
                    fractionnement,
                    periode,
                    etat,
                    montant
                };
                let commissions = {
                    mode,
                    taux,
                    status,
                    montant: montantc
                }
                detailDesPolices.push({
                    contrat,
                    prime,
                    commissions,
                    sousTotalPolice,
                    sousTotalMontant
                })
            })
            infos.detailDesPolices = detailDesPolices;
        }
    }
    return infos;

};

