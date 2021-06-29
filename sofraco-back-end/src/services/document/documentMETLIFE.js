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
            reportSoldePrecedent = reportSoldePrecedent.split('€')[0].trim();

            nombrePolicesSurLaPeriode = data.filter((element) => {
                return element.match(/Nombre de polices sur la période.+/)
            });
            nombrePolicesSurLaPeriode = nombrePolicesSurLaPeriode[0].split(':')[1].trim();

            primesEncaisseesSurLaPeriode = data.filter((element) => {
                return element.match(/Total des primes encaissées sur la période.+/)
            });
            primesEncaisseesSurLaPeriode = primesEncaisseesSurLaPeriode[0].split(':')[1].trim();
            primesEncaisseesSurLaPeriode = primesEncaisseesSurLaPeriode.split('€')[0].trim();

            stCommissionsCalculeesSurLaPeriode = data.filter((element) => {
                return element.match(/.+commissions calculées sur la période.+/)
            });
            stCommissionsCalculeesSurLaPeriode = stCommissionsCalculeesSurLaPeriode[0].split(':')[1].trim();
            stCommissionsCalculeesSurLaPeriode = stCommissionsCalculeesSurLaPeriode.split('€')[0].trim();

            stCommissionsReprisesSurLaPeriode = data.filter((element) => {
                return element.match(/.+commissions reprises sur la période.+/)
            });
            stCommissionsReprisesSurLaPeriode = stCommissionsReprisesSurLaPeriode[0].split(':')[1].trim();
            stCommissionsReprisesSurLaPeriode = stCommissionsReprisesSurLaPeriode.split('€')[0].trim();

            stCommissionsDeduitesSurLaPeriode = data.filter((element) => {
                return element.match(/.+commissions déduites sur la période.+/)
            });
            stCommissionsDeduitesSurLaPeriode = stCommissionsDeduitesSurLaPeriode[0].split(':')[1].trim();
            stCommissionsDeduitesSurLaPeriode = stCommissionsDeduitesSurLaPeriode.split('€')[0].trim();

            stOperationsDiversesSurLaPeriode = data.filter((element) => {
                return element.match(/.+opérations diverses sur la période.+/)
            });
            stOperationsDiversesSurLaPeriode = stOperationsDiversesSurLaPeriode[0].split(':')[1].trim();
            stOperationsDiversesSurLaPeriode = stOperationsDiversesSurLaPeriode.split('€')[0].trim();

            totalCommissionsDues = data.filter((element) => {
                return element.match(/.+commissions dues.+/)
            });
            totalCommissionsDues = totalCommissionsDues[0].split(':')[1].trim();
            totalCommissionsDues = totalCommissionsDues[0].split('€')[0].trim();
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
            const indexMontant = data.lastIndexOf('Montant');
            const indexLastUtil = data.lastIndexOf('#WiEs');
            const details = data.filter((d, index) => {
                return index > indexMontant && index < indexLastUtil;
            });
            let newDetails = [];
            const maxI = details.length / 4;
            for (let i = 0; i < maxI; i++) {
                if (details.length > 0) {
                    const d = details.slice(0, reIndexOf(details, /Sous-total/) + 2);
                    details.splice(0, reIndexOf(details, /Sous-total/) + 2);
                    newDetails.push(d);
                } else {
                    break;
                }
            }

            newDetails.forEach((element, index) => {
                let i = 0;
                const police = element[0];
                element.splice(0, 1);

                let fractionnement = '';
                if (reIndexOf(element, /mensuel/i) > 0 ||
                    reIndexOf(element, /men.*/i) > 0 ||
                    reIndexOf(element, /ncn.*/i) > 0 ||
                    reIndexOf(element, /nen.*/i) > 0) {
                    fractionnement = 'Mensuel';
                    if (reIndexOf(element, /mensuel/i) > 0) {
                        i = reIndexOf(element, /mensuel/i);
                    } else if (reIndexOf(element, /men.*/i) > 0) {
                        i = reIndexOf(element, /men.*/i);
                    } else if (reIndexOf(element, /ncn.*/i) > 0) {
                        i = reIndexOf(element, /ncn.*/i);
                    } else if (reIndexOf(element, /nen.*/i) > 0) {
                        i = reIndexOf(element, /nen.*/i);
                    }
                    element.splice(i, 1);
                }
                if (reIndexOf(element, /annuel*/i) > 0 ||
                    reIndexOf(element, /annu.*/i) > 0 ||
                    reIndexOf(element, /annucl/i) > 0) {
                    fractionnement = 'Annuel';
                    if (reIndexOf(element, /annuel*/i) > 0) {
                        i = reIndexOf(element, /annuel*/i);
                    } else if (reIndexOf(element, /annu.*/i) > 0) {
                        i = reIndexOf(element, /annu.*/i);
                    } else if (reIndexOf(element, /annucl/i) > 0) {
                        i = reIndexOf(element, /annucl/i);
                    }
                    element.splice(i, 1);
                }

                let etat = '';
                if (reIndexOf(element, /sold.*/) > 0 || reIndexOf(element, /soid.*/) > 0) {
                    etat = 'soldée';
                }
                if (reIndexOf(element, /sold.*/) > 0) {
                    element.splice(reIndexOf(element, /sold.*/), 1);
                } else if(reIndexOf(element, /soid.*/) > 0) {
                    element.splice(reIndexOf(element, /soid.*/), 1);
                }

                let mode = '';
                if (reIndexOf(element, /escompté/i) > 0 ||
                    reIndexOf(element, /escamp.*/i) > 0 ||
                    reIndexOf(element, /escom.*/i) > 0 ||
                    reIndexOf(element, /esc.*/i) > 0) {
                    mode = 'escompté';
                    if (reIndexOf(element, /escompté/i) > 0) {
                        i = reIndexOf(element, /escompté/i);
                    } else if (reIndexOf(element, /escamp.*/i) > 0) {
                        i = reIndexOf(element, /escamp.*/i);
                    } else if (reIndexOf(element, /escom.*/i) > 0) {
                        i = reIndexOf(element, /escom.*/i);
                    } else if (reIndexOf(element, /esc.*/i) > 0) {
                        i = reIndexOf(element, /esc.*/i);
                    }
                    element.splice(i, 1);
                }
                if (reIndexOf(element, /linéaire/i) > 0 || reIndexOf(element, /lin.*/i) > 0) {
                    mode = 'linéaire';
                    if (reIndexOf(element, /linéaire/i) > 0) {
                        i = reIndexOf(element, /linéaire/i);
                    } else if (reIndexOf(element, /lin.*/i) > 0) {
                        i = reIndexOf(element, /lin.*/i);
                    }
                    element.splice(i, 1);
                }


                let periode = '';
                const du = element[reIndexOf(element, /du \d{1,2}[/]\d{1,2}[/]\d{1,4}/)] ||
                element[reIndexOf(element, /du \d{1,2}[/]\d+/)] ||
                element[reIndexOf(element, /\d{1,2}[/]\d{1,2}[/]\d{1,4}/)] ||
                element[reIndexOf(element, /\d{1,2}[/]\d+/)];
                if (reIndexOf(element, /du \d{1,2}[/]\d{1,2}[/]\d{1,4}/) > 0) {
                    element.splice(reIndexOf(element, /du \d{1,2}[/]\d{1,2}[/]\d{1,4}/), 1);
                } else if (reIndexOf(element, /du \d{1,2}[/]\d+/) > 0) {
                    element.splice(reIndexOf(element, /du \d{1,2}[/]\d+/), 1);
                } else if (reIndexOf(element, /\d{1,2}[/]\d{1,2}[/]\d{1,4}/) > 0) {
                    element.splice(reIndexOf(element, /\d{1,2}[/]\d{1,2}[/]\d{1,4}/), 1);
                } else if (reIndexOf(element, /\d{1,2}[/]\d+/) > 0) {
                    element.splice(reIndexOf(element, /\d{1,2}[/]\d+/), 1);
                }

                const au = element[reIndexOf(element, /au \d{1,2}[/]\d{1,2}[/]\d{1,4}/)] ||
                    element[reIndexOf(element, /au \d{1,2}[/]\d+/)] ||
                    element[reIndexOf(element, /\d{1,2}[/]\d{1,2}[/]\d{1,4}/)] ||
                    element[reIndexOf(element, /\d{1,2}[/]\d+/)];
                periode = `${du} ${au}`;

                if (reIndexOf(element, /au \d{1,2}[/]\d{1,2}[/]\d{1,4}/) > 0) {
                    element.splice(reIndexOf(element, /au \d{1,2}[/]\d{1,2}[/]\d{1,4}/), 1);
                } else if (reIndexOf(element, /au \d{1,2}[/]\d+/) > 0) {
                    element.splice(reIndexOf(element, /au \d{1,2}[/]\d+/), 1);
                } else if (reIndexOf(element, /\d{1,2}[/]\d{1,2}[/]\d{1,4}/) > 0) {
                    element.splice(reIndexOf(element, /\d{1,2}[/]\d{1,2}[/]\d{1,4}/), 1);
                } else if (reIndexOf(element, /\d{1,2}[/]\d+/) > 0) {
                    element.splice(reIndexOf(element, /\d{1,2}[/]\d+/), 1);
                }

                let status = '';
                if (reIndexOf(element, /calculée/i) > 0) {
                    status = 'calculée';
                    element.splice(reIndexOf(element, /calculée/i), 1);
                } else if (reIndexOf(element, /reprise/i) > 0) {
                    status = 'reprise';
                    element.splice(reIndexOf(element, /reprise/i), 1);
                } else if (reIndexOf(element, /paye/i) > 0) {
                    status = 'à payer';
                    element.splice(reIndexOf(element, /paye/i), 1);
                }

                const stPolice = element[reIndexOf(element, /Sous-total/i)].split(' ');
                const sousTotalPolice = stPolice[stPolice.length - 1];
                const sousTotalMontant = parseFloat(element[reIndexOf(element, /Sous-total/i) + 1].split(' ')[0]);
                element.splice(reIndexOf(element, /Sous-total/i), 1);
                element.splice(element.indexOf(sousTotalMontant), 1);

                const mots = element.filter((e, i) => {
                    return e.match(/^[a-z]+/i);
                });
                for (let e of mots) {
                    element.splice(element.indexOf(e), 1);
                }
                let assure;
                let produit;
                if (mots.length === 5) {
                    assure = `${mots[0]} ${mots[2]}`;
                    produit = `${mots[1]} ${mots[3]} ${mots[4]}`;
                } else if (mots.length === 6) {
                    assure = `${mots[0]} ${mots[1]} ${mots[3]}`;
                    produit = `${mots[2]} ${mots[4]} ${mots[5]}`;
                } else if (mots.length < 5) {
                    assure = `${mots[0]}`;
                    produit = `${mots[1]} ${mots[2]} ${mots[3]}`;
                }

                const numbers = element.slice();
                let montantPrime;
                let taux;
                let montantCommission;
                if (numbers.lenght === 1) {
                    montantPrime = 0;
                    taux = 0;
                    montantCommission = parseFloat(numbers[0].split(' ')[0]);
                } else if (numbers.length === 2) {
                    montantPrime = parseFloat(numbers[0].split(' ')[0].replace(',', '.'));
                    montantCommission = parseFloat(numbers[1].split(' ')[0].replace(',', '.'));
                    taux = Math.ceil((montantCommission / montantPrime) * 100);
                } else if (numbers.length === 3) {
                    montantPrime = parseFloat(numbers[0].split(' ')[0].replace(',', '.'));
                    taux = parseFloat(numbers[1].split(' ')[0].replace(',', '.'));
                    montantCommission = ((montantPrime * taux) / 100).toFixed(2);
                }

                const contrat = {
                    police: sousTotalPolice,
                    assure,
                    produit
                };
                const prime = {
                    fractionnement,
                    periode,
                    etat,
                    montant: montantPrime
                };
                let commissions = {
                    mode,
                    taux,
                    status,
                    montant: montantCommission
                };
                detailDesPolices.push({
                    contrat,
                    prime,
                    commissions,
                    sousTotalPolice,
                    sousTotalMontant
                });
            })
            infos.detailDesPolices = detailDesPolices;
        }
    }
    return infos;

};

