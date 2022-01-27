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

exports.errorReadExcelCEGEMA = (index) => {
    const indexesHeader = {
        courtier: 'Courtier',
        nomAdherent: 'Nom *adhérent',
        numAdhesion: 'N° *adhésion',
        garantie: 'Garantie',
        effetAu: 'Effet *au',
        cotisHT: 'Cotis. *HT',
        taux: 'Taux',
        commission: 'Commission',
        modeMotif: 'Mode *[/] *Motif',
    };

    const errorCegema = `CEGEMA : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorCegema;
};

exports.errorReadExcelGENERALI = (index) => {
    const indexesHeader = {
        reference: 'Référence du relevé de commission',
        numeroReleve: 'Numéro de relevé',
        dateReleve: 'Date du relevé',
        codeRegroupementIntermediaire: 'Code regroupement intermédiaire',
        codeIntermediaire: 'Code intermédiaire',
        codePortefeuille: 'Code portefeuille',
        libellePortefeuille: 'Libellé portefeuille',
        codePortefeuilleExterne: 'Code portefeuille externe',
        libelleFamilleCommerciale: 'Libellé famille commerciale',
        codeProduit: 'Code produit',
        libelleProduit: 'Libellé du produit',
        natureOperation: 'Nature de l opération',
        libelleTypePrime: 'Libellé type de prime',
        numeroContratOunumeroConvention: 'Numéro de contrat ou numéro de convention',
        raisonSociale: 'Raison sociale',
        numeroContratAffilie: 'Numéro de contrat affilié',
        referenceExterne: 'Référence externe',
        numeroContractant: 'Numéro de contractant',
        nomContractant: 'Nom du contractant',
        prenomContractant: 'Prénom du contractant',
        numeroAssure: 'Numéro assuré',
        nomAssure: 'Nom de l assuré',
        prenomAssure: 'Prénom de l assuré',
        dateOperation: 'Date de l opération',
        dateDebutPeriode: 'Date de début de période',
        dateFinPeriode: 'Date de fin de période',
        libelleGarantie: 'Libellé garantie',
        natureSupport: 'Nature du support',
        codeISIN: 'Code ISIN',
        libelleSupport: 'Libellé du support',
        montantCotisationTTC: 'Montant de la cotisation TTC',
        montantCotisationHTOuNetInvestiEnEpargne: 'Montant cotisation HT ou net investi en épargne',
        assietteCasCommission: 'Assiette du cas de commission',
        tauxCommission: 'Taux de commission',
        typeMontant: 'Type de montant',
        natureCommission: 'Nature de commission',
        montantCommission: 'Montant de commission',
        deviseMontant: 'Devise du montant',
        qualificationCommission: 'Qualification de la commission',
        conformiteAdministrative: 'Conformité administrative',
        transfertPortefeuille: 'Transfert de portefeuille',
        codeOption: 'Code option',
        complementInformations: 'Complément d informations',
    };

    const errorGenerali = `GENERALI : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorGenerali;
};

exports.errorReadExcelHODEVA = (index) => {
    const indexesHeader = {
        adhesion: 'Adhé-sion',
        nom: 'NOM',
        prenom: 'PRENOM',
        dateEffet: 'Date d\'effet',
        montantPrimeHT: 'Montant Prime HT',
        tauxCommissionnement: 'Taux de commissionnement',
        montantCommissionnement: 'Montant du commissionnement',
    };

    const errorHodeva = `HODEVA : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorHodeva;
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

    const errorSwisslifeSurco = `SWISSLIFE SURCO : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorSwisslifeSurco;
};
