const path = require('path');
const ExcelJS = require('exceljs');
const fs = require('fs');
const Jimp = require('jimp');

const Tesseract = require('tesseract.js');
const Pdf2Img = require('pdf2img-promises');
const { createWorker } = require('tesseract.js');
const { exec, execSync } = require('child_process');

// Module = {
//     onRuntimeInitialized() {
//         // this is our application:
//         console.log(cv.getBuildInformation())
//     }
// }
// const cv = require('../../../opencv.js');

exports.readPdf = async (file, company) => {
    const filename = file.filename.split('.')[0];
    let converter = new Pdf2Img();

    converter.setOptions({
        type: 'jpg',
        size: 1024,
        density: 600,
        outputdir: path.join(__dirname, '..', '..', '..', 'documents', 'temp'),
    });

    const data = await converter.convert(file.path);
    const message = data.message;
    let infos = null;
    let filesPaths = [];
    for (let image of message) {
        let time = 0;
        const timeout = setInterval(() => {
            time++;
        }, 1000);
        // const jimpSrc = await Jimp.read(image.path);
        // const src = cv.matFromImageData(jimpSrc.bitmap);
        // const dst = new cv.Mat();
        // let M = cv.Mat.ones(5, 5, cv.CV_8U);
        // let anchor = new cv.Point(-1, -1);
        // cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
        // cv.dilate(src, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
        // const img = new Jimp({
        //     width: dst.cols,
        //     height: dst.rows,
        //     data: Buffer.from(dst.data)
        // });
        // const p = `${image.path.split('.')[0]}_gray.png`;
        // console.log(p)
        // img.write(p, (err, value) => {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         console.log(value);
        //     }
        // });
        // src.delete();
        // dst.delete();
        const finalFilePath = path.join(__dirname, '..', '..', '..', 'documents', 'texte', `${image.name.split('.')[0]}`);
        try {
            execSync(`tesseract ${image.path} ${finalFilePath}`);
            console.log(`Temps de traitement : ${time}`);
            clearInterval(timeout);
            filesPaths.push(`${finalFilePath}.txt`);

        } catch (err) {
            console.log(err);
            console.log(`Temps de traitement : ${time}`);
            clearInterval(timeout);
        }
    }
    switch (company.toUpperCase()) {
        // case 'APICIL':
        //     infos = await readPdfMETLIFE(file);
        //     break;
        // case 'APREP':
        //     infos = await readPdfMETLIFE(file);
        //     break;
        // case 'AVIVA':
        //     infos = await readPdfMETLIFE(file);
        //     break;
        // case 'AVIVA SURCO':
        //     infos = await readPdfMETLIFE(file);
        //     break;
        // case 'CARDIF':
        //     infos = await readPdfMETLIFE(file);
        //     break;
        // case 'CBP FRANCE':
        //     infos = await readPdfMETLIFE(file);
        //     break;
        // case 'CEGEMA':
        //     infos = await readPdfMETLIFE(file);
        //     break;
        // case 'ERES':
        //     infos = await readPdfMETLIFE(file);
        //     break;
        // case 'GENERALI':
        //     infos = await readPdfMETLIFE(file);
        //     break;
        // case 'HODEVA':
        //     infos = await readPdfMETLIFE(file);
        //     break;
        case 'METLIFE':
            infos = readPdfMETLIFE(filesPaths);
            break;
        // case 'SWISSLIFE':
        //     infos = await readPdfMETLIFE(file);
        //     break;
        // case 'SWISSLIFE SURCO':
        //     infos = await readPdfMETLIFE(file);
        //     break;
        default:
            console.log('Pas de compagnie correspondante');
    }
    return infos;

}

const readPdfMETLIFE = (filesPaths) => {
    let infos = {};
    let syntheseDesCommissions = {}
    let detailDesPolices = [];
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
            periodeEncaissement = data[data.indexOf('Période d\'encaissement du') + 1];
            codeApporteurBeneficiaireCommissions = data[data.indexOf('Code apporteur bénéficiaire des commissions :') + 1];
            codeApporteurEmetteur = data[data.indexOf('Code apporteur émetteur :') + 1];
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
        }
        if (numero === '3') {
            let co;
            co = data.filter((element) => {
                return element.match(/.+[$].+/)
            });
            let details = [];
            for (let c of co) {
                c = c.replace('$', 'S');
                c = c.replace(/[_-]/, ' ');
                details.push(c);
            }
            for (let detail of details) {
                let police;
                let assure;
                let produit;
                let fractionnement;
                let periode;
                let etat;
                let montant;
                let taux;
                let mode;
                let status;
                let montantc;

                const c = detail.split(' ');
                police = c.filter((element) => {
                    return element.match(/.+S\d.+/)
                });
                assure = c.filter((element) => {
                    return element.match(/M.*/)
                });
                assure.push(c[c.indexOf(assure[0]) + 1]);
                produit = c.filter((element) => {
                    return element.match(/.+S.+/)
                });
                fractionnement = c.filter((element) => {
                    return element.match(/^annuel.*$/i) || element.match(/^mensuel.*$/i);
                });
                periode = c.filter((element) => {
                    return element.match(/^.*\d{1,2}[/]\d{1,2}[/]\d{1,2}.*$/)
                });
                etat = c.filter((element) => {
                    return element.match(/^.*sold.*$/)
                });
                montant = c.filter((element) => {
                    return element.match(/^\d.*€/)
                });
                mode = c.filter((element) => {
                    return element.match(/^escompté.*$/i) || element.match(/^linéaire.*$/i);
                });
                taux = c.filter((element) => {
                    return element.match(/^\d+$/)
                });
                status = c.filter((element) => {
                    return element.match(/^calculée.*$/) || element.match(/^reprise.*$/) || element.match(/^à payer.*$/)
                });
                montantc = c.filter((element) => {
                    return element.match(/^\d.*€/)
                });

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
                    commissions
                })

            }

        }
    }
    infos = {
        syntheseDesCommissions,
        detailDesPolices
    }
    return infos;

};

