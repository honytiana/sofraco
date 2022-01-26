exports.errorEmptyCell = (company, address) => {
    const error = `${company} : la cellule ${address} est vide`;
    return error;
};

exports.errorReadExcelAVIVASURCO = (index) => {
    const indexesHeader = {
        reseau: 'RESEAU',
        region: 'REGION',
        inspecteur: 'INSPECTEUR',
        codeInter: 'CODE INTER',
        nomApporteur: 'NOM DE L\'APPORTEUR',
        numeroContrat: 'N° DE CONTRAT',
        numeroCouverture: 'N° DE COUVERTURE',
        nomAssure: 'NOM DE L\'ASSURE',
        nomContrat: 'NOM CONTRAT',
        nomGarantie: 'NOM GARANTIE',
        familleContrat: 'FAMILLE CONTRAT',
        typeMVT: 'TYPE MVT',
        dateEffetMVT: 'DATE EFFET MVT',
        moisEffetMVT: 'MOIS EFFET MVT',
        prodBrute: 'PROD BRUTE',
        prodObjectifAE: 'PROD POUR OBJECTIF AE',
        prodCalculAE: 'PROD POUR CALCUL AE',
    };

    const errorAviva = `AVIVA SURCO : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorAviva;
};

exports.errorReadExcelCARDIFFH = (index) => {
    const indexesHeader = {
        courtier: 'Courtier',
        commission: 'Commission',
        client: 'Client',
        contrat: 'Contrat',
        supportFinancier: 'Support Financier',
        montantsCommission: 'Montants de commission'
    };

    const errorCardif = `CARDIF : La colonne ${indexesHeader[index]} n'est pas présente. (Première ligne)`;
    return errorCardif;
};

exports.errorReadExcelCARDIFSH = (index) => {
    const indexesHeader = {
        code: 'Code',
        libelle: 'Libellé',
        reference: 'Référence',
        type: 'Type',
        sousType: 'Sous-type',
        datePriseEnCompte: 'Date de prise en compte',
        dateEffet: 'Date effet',
        numeroClient: 'N° Client',
        nom: 'Nom',
        prenom: 'Prénom',
        numeroContrat: 'N° contrat',
        produit: 'Produit',
        codeISIN: 'Code ISIN',
        libelleSupportFinancier: 'Libellé',
        classification: 'Classification',
        assiette: 'Assiette',
        taux: 'Taux(%)',
        montant: 'Montant'
    };

    const errorCardif = `CARDIF : La colonne ${indexesHeader[index]} n'est pas présente (Seconde ligne)`;
    return errorCardif;
};

exports.errorReadExcelSWISSLIFESURCO = (index) => {
    const indexesHeader = {
        apporteurVente: 'Apporteur de la vente',
        dateComptabVente: 'Date comptab. de la vente',
        numeroPolice: 'N° de police',
        codeProduit: 'Code produit',
        nomClient: 'Nom du Client',
        cotisationPonderee: 'Cotisation pondérée',
        montantPP: 'Montant PP',
        dontParUCsurPP: 'Dont part UC sur PP',
        montantPU: 'Montant PU',
        dontParUCsurPU: 'Dont part UC sur PU',
        tauxChargement: 'Taux de chargement',
        avanceSurco: 'Avance surco 20%',
        incompressible: 'incompressible',
        avanceComprisRepriseIncompressible: 'avance y compris reprise incompressbile'
    };
    		


    const errorAviva = `SWISSLIFE SURCO : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorAviva;
};
