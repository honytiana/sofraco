const path = require('path');
const { execSync } = require('child_process');
const config = require('../../../config.json');

const python = (config.pythonEnv) ? config.pythonEnv : config.python;
const pythonEasyOCR = path.join(__dirname, `easyOCR2.py`);

const easyOCR = (imageFullPath, destFullPath) => {
    console.log(`${new Date()} INFO Traitement de ${imageFullPath}`);
    console.log(`${new Date()} INFO Utilisation de l'environement python ${python}`);
    const finalScript = `${python} ${pythonEasyOCR} ${imageFullPath} ${destFullPath}`;
    execSync(finalScript, { maxBuffer: 2048 * 2048 });
    console.log(`${new Date()} INFO ${destFullPath}.txt Généré`);
}

module.exports = easyOCR;