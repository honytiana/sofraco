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

exports.errorReadExcelLOURMEL = (index) => {
    const indexesHeader = {
        a: 'A',
        b: 'B',
        courtier: 'C CODE COURTIER',
        b: 'D',
        c: 'E',
        d: 'F',
        genre: 'G GENRE',
        nom: 'H NOM',
        prenom: 'I PRENOM',
        nomDeNaissance: 'J NOM DE NAISSANCE',
        k: 'K',
        l: 'L',
        codePostal: 'M CODE POSTALE',
        ville: 'N VILLE',
        o: 'O',
        p: 'P',
        q: 'Q',
        r: 'R',
        s: 'S',
        dateEffet: 'T DATE EFFET',
        montantCotisation: 'U MONTANT DE LA COTISATION',
        v: 'V',
        dateDebut: 'W DATE DEBUT',
        dateFin: 'X DATE FIN',
        tauxCommission: 'Y TAUX DE COMMISSION',
        montantCommission: 'Z MONTANT DE LA COMMISSION',
    };

    const errorHodeva = `LOURMEL : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorHodeva;
};

exports.errorReadExcelMIEAXIOM = (index) => {
    const indexesHeader = {
        dateComptable: 'DATE_COMPTABLE',
        numAdherent: 'NUM_ADHERENT',
        codeCourtier: 'CODE_COURTIER',
        raisonSocialeApporteur: 'RAISON_SOCIALE_APPORTEUR',
        nom: 'NOM',
        prenom: 'PRENOM',
        tel: 'TEL',
        mail: 'MAIL',
        codePostal: 'CODE_POSTAL',
        ville: 'VILLE',
        dateEffetContrat: 'DATE_EFFET_CONTRAT',
        dateFinContrat: 'DATE_FIN_CONTRAT',
        codeProduit: 'CODE_PRODUIT',
        libelleProduit: 'LIBELLE_PRODUIT',
        mtCommission: 'MT_COMMISSION',
        totalEncaisse: 'TOTAL_ENCAISSE',
        assieteSanteHTEncaisse: 'ASSIETTE_SANTE_HT_ENCAISSE',
        taxesEncaisses: 'TAXES_ENCAISSÉS',
        obsActionMutac: 'OBS ACTIOM MUTAC',
        spheria: 'SPHERIA',
        cotisationARepartir: 'Cotisation à répartir',
        courtier: 'COURTIER',
        fondateur: 'FONDATEUR',
        pavillon: 'PAVILLON',
        sofraco: 'SOFRACO',
        sofracoExpertises: 'SOFRACO EXPERTISES',
        resteAVerser: 'Reste à verser',
    };

    const errorHodeva = `MIEAXIOM : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorHodeva;
};

exports.errorReadExcelMIEV1 = (index) => {
    const indexesHeader = {
        dateComptable: 'DATE_COMPTABLE',
        codeCourtier: 'CODE_COURTIER',
        raisonSocialeApporteur: 'RAISON_SOCIALE_APPORTEUR',
        numAdherent: 'NUM_ADHERENT',
        nom: 'NOM',
        prenom: 'PRENOM',
        tel: 'TEL',
        mail: 'MAIL',
        codePostal: 'CODE_POSTAL',
        ville: 'VILLE',
        dateEffetContrat: 'DATE_EFFET_CONTRAT',
        dateFinContrat: 'DATE_FIN_CONTRAT',
        codeProduit: 'CODE_PRODUIT',
        libelleProduit: 'LIBELLE_PRODUIT',
        mtCommission: 'MT_COMMISSION',
        totalEncaisse: 'TOTAL_ENCAISSE',
        assieteSanteHTEncaisse: 'ASSIETTE_SANTE_HT_ENCAISSE',
        trfObs: 'TRF_OBS',
        trfMat: 'TRF_MAT',
        taxesEncaisses: 'TAXES_ENCAISSÉS',
        courtier: 'COURTIER',
        fondateur: 'FONDATEUR',
        pavillon: 'PAVILLON',
        sofraco: 'SOFRACO',
        sofracoExpertises: 'SOFRACO EXPERTISES',
        budget: 'BUDGET',
    };

    const errorHodeva = `MIEV1 : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorHodeva;
};

exports.errorReadExcelMIELCREASIO = (index) => {
    const indexesHeader = {
        codeApporteurCommissionne: "Code Apporteur commissionné",
        codeApporteurAffaire: "Code Apporteur d'Affaire",
        nomApporteurAffaire: "Nom Apporteur d'Affaire",
        numAdherent: "N° Adhérent",
        nom: "Nom",
        prenom: "Prénom",
        codePostal: "Code postal",
        ville: "Ville",
        codeProduit: "Code Poduit",
        nomProduit: "Nom Produit",
        codeContrat: "Code Contrat",
        nomContrat: "Nom Contrat",
        dateDebutEcheance: "Date début échéance",
        dateFinEcheance: "Date fin échéance",
        montantTTCEcheance: "Montant TTC échéance",
        montantHTEcheance: "Montant HT échéance",
        codeGarantieTechnique: "Code de la Garantie Technique",
        nomGarantieTechnique: "Nom de la Garantie Technique",
        baseCommisionnement: "Base de commisionnement",
        tauxCommission: "Taux de commission",
        montantCommissions: "Montant commissions",
        bordereauPaiementCommissionsInitiales: "Bordereau du paiement des commissions initiales"
    };

    const errorMielCreasio = `MIEL CREASIO : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorMielCreasio;
};

exports.errorReadExcelMIELV1 = (index) => {
    const indexesHeader = {
        codeApporteurCommissionne: "Code Apporteur commissionné",
        codeApporteurAffaire: "Code Apporteur d'Affaire",
        nomApporteurAffaire: "Nom Apporteur d'Affaire",
        numAdherent: "N° Adhérent",
        nom: "Nom",
        prenom: "Prénom",
        codePostal: "Code postal",
        ville: "Ville",
        codeProduit: "Code Poduit",
        nomProduit: "Nom Produit",
        codeContrat: "Code Contrat",
        nomContrat: "Nom Contrat",
        dateDebutEcheance: "Date début échéance",
        dateFinEcheance: "Date fin échéance",
        montantTTCEcheance: "Montant TTC échéance",
        montantHTEcheance: "Montant HT échéance",
        codeGarantieTechnique: "Code de la Garantie Technique",
        nomGarantieTechnique: "Nom de la Garantie Technique",
        baseCommisionnement: "Base de commisionnement",
        tauxCommission: "Taux de commission",
        montantCommissions: "Montant commissions",
        bordereauPaiementCommissionsInitiales: "Bordereau du paiement des commissions initiales",
        courtier: "COURTIER",
        fondateur: "FONDATEUR"
    };

    const errorMielV1 = `MIEL V1 : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorMielV1;
};

exports.errorReadExcelMIELV2 = (index) => {
    const indexesHeader = {
        codeApporteurCommissionne: "Code Apporteur commissionné",
        codeApporteurAffaire: "Code Apporteur d'Affaire",
        nomApporteurAffaire: "Nom Apporteur d'Affaire",
        numAdherent: "N° Adhérent",
        nom: "Nom",
        prenom: "Prénom",
        codePostal: "Code postal",
        ville: "Ville",
        codeProduit: "Code Poduit",
        nomProduit: "Nom Produit",
        codeContrat: "Code Contrat",
        nomContrat: "Nom Contrat",
        dateDebutEcheance: "Date début échéance",
        dateFinEcheance: "Date fin échéance",
        montantTTCEcheance: "Montant TTC échéance",
        montantHTEcheance: "Montant HT échéance",
        codeGarantieTechnique: "Code de la Garantie Technique",
        nomGarantieTechnique: "Nom de la Garantie Technique",
        baseCommisionnement: "Base de commisionnement",
        tauxCommission: "Taux de commission",
        montantCommissions: "Montant commissions",
        bordereauPaiementCommissionsInitiales: "Bordereau du paiement des commissions initiales",
        courtier: "COURTIER",
        fondateur: "FONDATEUR",
        sogeas: 'SOGEAS',
        procedure: 'PROCEDURE'
    };

    const errorMielV2 = `MIEL V2 : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorMielV2;
};

exports.errorReadExcelMIELV3_1 = (index) => {
    const indexesHeader = {
        codeApporteurCommissionne: "Code Apporteur commissionné",
        codeApporteurAffaire: "Code Apporteur d'Affaire",
        nomApporteurAffaire: "Nom Apporteur d'Affaire",
        numAdherent: "N° Adhérent",
        dateDebutContrat: 'date début de contrat',
        nom: "Nom",
        prenom: "Prénom",
        codePostal: "Code postal",
        ville: "Ville",
        codeProduit: "Code Poduit",
        nomProduit: "Nom Produit",
        codeContrat: "Code Contrat",
        nomContrat: "Nom Contrat",
        dateDebutEcheance: "Date début échéance",
        dateFinEcheance: "Date fin échéance",
        montantTTCEcheance: "Montant TTC échéance",
        montantHTEcheance: "Montant HT échéance",
        codeGarantieTechnique: "Code de la Garantie Technique",
        nomGarantieTechnique: "Nom de la Garantie Technique",
        baseCommisionnement: "Base de commisionnement",
        tauxCommission: "Taux de commission",
        montantCommissions: "Montant commissions",
        bordereauPaiementCommissionsInitiales: "Bordereau du paiement des commissions initiales",
        courtier: 'COURTIER',
        fondateur: 'FONDATEUR',
        sogeas: 'SOGEAS',
        sofraco: 'SOFRACO',
        procedure: 'PROCEDURE',
    };

    const errorMielV3 = `MIEL V3 : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorMielV3;
};

exports.errorReadExcelMIELV3_2 = (index) => {
    const indexesHeader = {
        codeApporteurCommissionne: "Code Apporteur commissionné",
        codeApporteurAffaire: "Code Apporteur d'Affaire",
        nomApporteurAffaire: "Nom Apporteur d'Affaire",
        numAdherent: "N° Adhérent",
        dateDebutContrat: 'date début de contrat',
        nom: "Nom",
        prenom: "Prénom",
        codePostal: "Code postal",
        ville: "Ville",
        codeProduit: "Code Poduit",
        nomProduit: "Nom Produit",
        codeContrat: "Code Contrat",
        nomContrat: "Nom Contrat",
        dateDebutEcheance: "Date début échéance",
        dateFinEcheance: "Date fin échéance",
        montantTTCEcheance: "Montant TTC échéance",
        montantHTEcheance: "Montant HT échéance",
        codeGarantieTechnique: "Code de la Garantie Technique",
        nomGarantieTechnique: "Nom de la Garantie Technique",
        baseCommisionnement: "Base de commisionnement",
        tauxCommission: "Taux de commission",
        montantCommissions: "Montant commissions",
        bordereauPaiementCommissionsInitiales: "Bordereau du paiement des commissions initiales",
        courtier: 'COURTIER',
        fondateur: 'FONDATEUR',
        pavillon: 'PAVILLON',
        sofraco: 'SOFRACO',
        sofracoExpertises: 'SOFRACO EXPERTISES',
        budget: 'BUDGET'
    };

    const errorMielV3 = `MIEL V3 : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorMielV3;
};

exports.errorReadExcelMIELV4 = (index) => {
    const indexesHeader = {
        codeApporteurCommissionne: "Code Apporteur commissionné",
        codeApporteurAffaire: "Code Apporteur d'Affaire",
        nomApporteurAffaire: "Nom Apporteur d'Affaire",
        numAdherent: "N° Adhérent",
        nom: "Nom",
        prenom: "Prénom",
        codePostal: "Code postal",
        ville: "Ville",
        codeProduit: "Code Poduit",
        nomProduit: "Nom Produit",
        codeContrat: "Code Contrat",
        nomContrat: "Nom Contrat",
        dateDebutEcheance: "Date début échéance",
        dateFinEcheance: "Date fin échéance",
        montantTTCEcheance: "Montant TTC échéance",
        montantHTEcheance: "Montant HT échéance",
        codeGarantieTechnique: "Code de la Garantie Technique",
        nomGarantieTechnique: "Nom de la Garantie Technique",
        baseCommisionnement: "Base de commisionnement",
        tauxCommission: "Taux de commission",
        montantCommissions: "Montant commissions",
        bordereauPaiementCommissionsInitiales: "Bordereau du paiement des commissions initiales",
        courtier: "COURTIER",
        fondateur: "FONDATEUR",
        pavillon: 'PAVILLON',
        sofracoExpertises: 'SOFRACO EXPERTISES',
        budget: 'BUDGET'
    };

    const errorMielV4 = `MIEL V4 : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorMielV4;
};

exports.errorReadExcelMILTIS = (index) => {
    const indexesHeader = {
        codeAdherent: 'Code adhérent',
        nomAdherent: 'Nom adhérent',
        typeAdherent: 'Type adhérent',
        garantie: 'Garantie',
        periodeDebut: 'Période début',
        periodeFin: 'Période fin',
        periodicite: 'Périodicité',
        typeCommission: 'Type commission',
        primeHT: 'Prime HT',
        taux: 'Taux',
        commission: 'Commission',
        dateDeCalcul: 'Date de calcul',
        codePostal: 'Code postal',
        ville: 'Ville',
        raisonSociale: 'Raison sociale',
        codeMiltis: 'Code Miltis',
        courtier: 'COURTIER',
        fondateur: 'FONDATEUR',
        pavillon: 'PAVILLON',
        sofraco: 'SOFRACO',
        sofracoExpertises: 'SOFRACO EXPERTISES',
        budget: 'BUDGET'
    };

    const errorSwisslifeSurco = `MILTIS : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorSwisslifeSurco;
};

exports.errorReadExcelMMAACQUISITION = (index) => {
    const indexesHeader = {
        numCourtier: 'N° Courtier',
        souscripteur: 'Souscripteur',
        dateEffet: 'Date d\'effet',
        dateEcheance: 'Date d\'échéance',
        produit: 'Produit',
        numContrat: 'N° de contrat',
        montant: 'Montant',
        fr: 'Fr.',
        encaissement: 'Encaissement',
        escomptee: 'Escomptée',
        annuelle: 'Annuelle',
        commissionsSurArbitrage: 'Commissions sur arbitrage',
        total: 'TOTAL'
    };

    const errorMMAACQUISITION = `MMA ACQUISITION : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorMMAACQUISITION;
};

exports.errorReadExcelMMAENCOURS = (index) => {
    const indexesHeader = {
        codeApporteur: 'Code Apporteur',
        numContrat: 'N° de contrat',
        nomSouscripteur: 'Nom souscripteur',
        produit: 'Produit',
        libelleSupport: 'Libellé du support',
        assieteDeRenumeration: 'Assiette de Rémunération en €',
        taux: 'Taux',
        commissionSurEncours: 'Commission sur en-cours en €'
    };

    const errorMMAENCOURS = `MMA ENCOURS : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorMMAENCOURS;
};

exports.errorReadExcelMMAINCITATION = (index) => {
    const indexesHeader = {
        codeApporteur: 'Code Apporteur',
        nomSouscripteur: 'Nom du souscripteur',
        numContrat: 'N° de contrat',
        dateMouvement: 'Date du mouvement',
        libelleMouvement: 'Libellé du mouvement',
        montant: 'Montant en €',
        tauxIncitation: 'Taux d\'incitation',
        montantIncitation: 'Montant de l\'incitation en €'
    };

    const errorMMAINCITATION = `MMA INCITATION : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorMMAINCITATION;
};

exports.errorReadExcelPAVILLONACTIO = (index) => {
    const indexesHeader = {
        dateGeneration: 'Date génération',
        codeCompagnie: 'Code compagnie',
        codeCourtier: 'Code courtier',
        raisonSocialeApporteur: 'Raison Sociale Apporteur',
        dateArrete: 'Date arrêté',
        identifiant: 'Identifiant',
        codePostal: 'Code Postal',
        commune: 'Commune',
        dateEffetContrat: 'Date d\'effet contrat',
        debutPeriode: 'Début période',
        finPeriode: 'Fin période',
        raisonSociale: 'Nom prénom / Raison sociale',
        codeProduit: 'Code produit',
        nomProduit: 'Nom produit',
        emissionTTC: 'Emission TTC',
        reglementTTC: 'Règlement TTC',
        reglementHT: 'Règlement HT',
        taux: 'Taux',
        montantPaiement: 'Montant paiement',
        courtier: 'COURTIER',
        fondateur: 'FONDATEUR'
    };

    const errorPAVILLONACTIO = `PAVILLON ACTIO : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorPAVILLONACTIO;
};

exports.errorReadExcelPAVILLONV1 = (index) => {
    const indexesHeader = {
        dateGeneration: 'Date génération',
        codeCompagnie: 'Code compagnie',
        codeCourtier: 'Code courtier',
        raisonSocialeApporteur: 'Raison Sociale Apporteur',
        dateArrete: 'Date arrêté',
        identifiant: 'Identifiant',
        codePostal: 'Code Postal',
        commune: 'Commune',
        dateEffetContrat: 'Date d\'effet contrat',
        debutPeriode: 'Début période',
        finPeriode: 'Fin période',
        raisonSociale: 'Nom prénom / Raison sociale',
        codeProduit: 'Code produit',
        nomProduit: 'Nom produit',
        emissionTTC: 'Emission TTC',
        reglementTTC: 'Règlement TTC',
        reglementHT: 'Règlement HT',
        taux: 'Taux',
        montantPaiement: 'Montant paiement',
        courtier: 'COURTIER',
        fondateur: 'FONDATEUR'
    };

    const errorPAVILLONV1 = `PAVILLON V1 : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorPAVILLONV1;
};

exports.errorReadExcelPAVILLONV2 = (index) => {
    const indexesHeader = {
        dateGeneration: 'Date génération',
        codeCompagnie: 'Code compagnie',
        codeCourtier: 'Code courtier',
        raisonSocialeApporteur: 'Raison Sociale Apporteur',
        dateArrete: 'Date arrêté',
        identifiant: 'Identifiant',
        codePostal: 'Code Postal',
        commune: 'Commune',
        dateEffetContrat: 'Date d\'effet contrat',
        debutPeriode: 'Début période',
        finPeriode: 'Fin période',
        raisonSociale: 'Nom prénom / Raison sociale',
        codeProduit: 'Code produit',
        nomProduit: 'Nom produit',
        emissionTTC: 'Emission TTC',
        reglementTTC: 'Règlement TTC',
        reglementHT: 'Règlement HT',
        taux: 'Taux',
        montantPaiement: 'Montant paiement',
        courtier: 'COURTIER',
        fondateur: 'FONDATEUR',
        sogeas: 'SOGEAS',
        procedure: 'PROCEDURE'
    };

    const errorPAVILLONV2 = `PAVILLON V2 : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorPAVILLONV2;
};

exports.errorReadExcelPAVILLONV3 = (index) => {
    const indexesHeader = {
        dateGeneration: 'Date génération',
        codeCompagnie: 'Code compagnie',
        codeCourtier: 'Code courtier',
        raisonSocialeApporteur: 'Raison Sociale Apporteur',
        dateArrete: 'Date arrêté',
        identifiant: 'Identifiant',
        codePostal: 'Code Postal',
        commune: 'Commune',
        dateEffetContrat: 'Date d\'effet contrat',
        debutPeriode: 'Début période',
        finPeriode: 'Fin période',
        raisonSociale: 'Nom prénom / Raison sociale',
        codeProduit: 'Code produit',
        nomProduit: 'Nom produit',
        emissionTTC: 'Emission TTC',
        reglementTTC: 'Règlement TTC',
        reglementHT: 'Règlement HT',
        taux: 'Taux',
        montantPaiement: 'Montant paiement',
        courtier: 'COURTIER',
        fondateur: 'FONDATEUR'
    };

    const errorPAVILLONV3 = `PAVILLON V3 : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorPAVILLONV3;
};

exports.errorReadExcelPAVILLONV4 = (index) => {
    const indexesHeader = {
        dateGeneration: 'Date génération',
        codeCompagnie: 'Code compagnie',
        codeCourtier: 'Code courtier',
        raisonSocialeApporteur: 'Raison Sociale Apporteur',
        dateArrete: 'Date arrêté',
        identifiant: 'Identifiant',
        codePostal: 'Code Postal',
        commune: 'Commune',
        dateEffetContrat: 'Date d\'effet contrat',
        debutPeriode: 'Début période',
        finPeriode: 'Fin période',
        raisonSociale: 'Nom prénom / Raison sociale',
        codeProduit: 'Code produit',
        nomProduit: 'Nom produit',
        emissionTTC: 'Emission TTC',
        reglementTTC: 'Règlement TTC',
        reglementHT: 'Règlement HT',
        taux: 'Taux',
        montantPaiement: 'Montant paiement',
        courtier: 'COURTIER',
        fondateur: 'FONDATEUR',
        sogeas: 'SOGEAS',
        procedure: 'PROCEDURE',
        pavillon: 'PAVILLON',
        sofraco: 'SOFRACO',
        sofracoExpertise: 'SOFRACO EXPERTISES',
        budget: 'BUDGET'
    };

    const errorPAVILLONV4 = `PAVILLON V4 : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorPAVILLONV4;
};

exports.errorReadExcelPAVILLONV5 = (index) => {
    const indexesHeader = {
        dateGeneration: 'Date génération',
        codeCompagnie: 'Code compagnie',
        codeCourtier: 'Code courtier',
        raisonSocialeApporteur: 'Raison Sociale Apporteur',
        dateArrete: 'Date arrêté',
        identifiant: 'Identifiant',
        codePostal: 'Code Postal',
        commune: 'Commune',
        dateEffetContrat: 'Date d\'effet contrat',
        debutPeriode: 'Début période',
        finPeriode: 'Fin période',
        raisonSociale: 'Nom prénom / Raison sociale',
        codeProduit: 'Code produit',
        nomProduit: 'Nom produit',
        emissionTTC: 'Emission TTC',
        reglementTTC: 'Règlement TTC',
        reglementHT: 'Règlement HT',
        taux: 'Taux',
        montantPaiement: 'Montant paiement',
        courtier: 'COURTIER',
        fondateur: 'FONDATEUR',
        sogeas: 'SOGEAS',
        procedure: 'PROCEDURE',
        pavillon: 'PAVILLON',
        sofraco: 'SOFRACO',
        sofracoExpertise: 'SOFRACO EXPERTISES',
    };

    const errorPAVILLONV5 = `PAVILLON V5 : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorPAVILLONV5;
};

exports.errorReadExcelPAVILLONV6 = (index) => {
    const indexesHeader = {
        dateGeneration: 'Date génération',
        codeCompagnie: 'Code compagnie',
        codeCourtier: 'Code courtier',
        raisonSocialeApporteur: 'Raison Sociale Apporteur',
        dateArrete: 'Date arrêté',
        identifiant: 'Identifiant',
        codePostal: 'Code Postal',
        commune: 'Commune',
        dateEffetContrat: 'Date d\'effet contrat',
        debutPeriode: 'Début période',
        finPeriode: 'Fin période',
        raisonSociale: 'Nom prénom / Raison sociale',
        codeProduit: 'Code produit',
        nomProduit: 'Nom produit',
        emissionTTC: 'Emission TTC',
        reglementTTC: 'Règlement TTC',
        reglementHT: 'Règlement HT',
        taux: 'Taux',
        montantPaiement: 'Montant paiement',
        courtier: 'COURTIER',
        fondateur: 'FONDATEUR',
        sofracoExpertise: 'SOFRACO EXPERTISES',
    };

    const errorPAVILLONV6 = `PAVILLON V6 : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorPAVILLONV6;
};

exports.errorReadExcelPAVILLONV7 = (index) => {
    const indexesHeader = {
        dateGeneration: 'Date génération',
        codeCompagnie: 'Code compagnie',
        codeCourtier: 'Code courtier',
        raisonSocialeApporteur: 'Raison Sociale Apporteur',
        dateArrete: 'Date arrêté',
        identifiant: 'Identifiant',
        codePostal: 'Code Postal',
        commune: 'Commune',
        dateEffetContrat: 'Date d\'effet contrat',
        debutPeriode: 'Début période',
        finPeriode: 'Fin période',
        raisonSociale: 'Nom prénom / Raison sociale',
        codeProduit: 'Code produit',
        nomProduit: 'Nom produit',
        emissionTTC: 'Emission TTC',
        reglementTTC: 'Règlement TTC',
        reglementHT: 'Règlement HT',
        taux: 'Taux',
        montantPaiement: 'Montant paiement',
        courtier: 'COURTIER',
        fondateur: 'FONDATEUR',
        pavillon: 'PAVILLON',
        sofraco: 'SOFRACO',
        sofracoExpertise: 'SOFRACO EXPERTISES',
        budget: 'BUDGET'
    };

    const errorPAVILLONV7 = `PAVILLON V7 : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorPAVILLONV7;
};

exports.errorReadExcelPAVILLONV8 = (index) => {
    const indexesHeader = {
        dateGeneration: 'Date génération',
        codeCompagnie: 'Code compagnie',
        codeCourtier: 'Code courtier',
        raisonSocialeApporteur: 'Raison Sociale Apporteur',
        dateArrete: 'Date arrêté',
        identifiant: 'Identifiant',
        codePostal: 'Code Postal',
        commune: 'Commune',
        dateEffetContrat: 'Date d\'effet contrat',
        debutPeriode: 'Début période',
        finPeriode: 'Fin période',
        raisonSociale: 'Nom prénom / Raison sociale',
        codeProduit: 'Code produit',
        nomProduit: 'Nom produit',
        emissionTTC: 'Emission TTC',
        reglementTTC: 'Règlement TTC',
        reglementHT: 'Règlement HT',
        taux: 'Taux',
        montantPaiement: 'Montant paiement',
        courtier: 'COURTIER',
        fondateur: 'FONDATEUR',
        pavillon: 'PAVILLON',
        sofraco: 'SOFRACO',
        sofracoExpertise: 'SOFRACO EXPERTISES'
    };

    const errorPAVILLONV8 = `PAVILLON V8 : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorPAVILLONV8;
};

exports.errorReadExcelSMATIS = (index) => {
    const indexesHeader = {
        debutPeriodeCotisation: 'Début de période de cotisation',
        finDePeriodeCotisation: 'Fin de période de cotisation',
        nomGarantie: 'Nom de la garantie',
        souscripteurContratGroupe: 'Souscripteur du contrat groupe',
        numPayeur: 'N° payeur',
        nomPayeur: 'Nom payeur',
        codeCourtier: 'Code courtier',
        nomCourtier: 'Nom du courtier',
        numContratGroupe: 'N° de contrat groupe',
        dateDebutContratAdhesion: 'Date début contrat ou d\'adhésion',
        statusContratAdhesion: 'Statut contrat ou adhésion',
        dateFinContratAdhesion: 'Date fin contrat  ou adhésion',
        etapeImpaye: 'Etape impayé [/] Motif de résilation',
        periodiciteCotisation: 'Périodicité cotisation',
        cotisationPayeePeriodeTTC: 'Cotisation payée Période TTC',
        cotisationPayeePeriodeHT: 'Cotisation payée Période HT',
        taux: 'Taux',
        typeCommission: 'Type de commission',
        montantCommission: 'Montant commission',
        courtier: 'COURTIER',
        fondateur: 'FONDATEUR',
        sogeas: 'SOGEAS',
        procedure: 'PROCEDURE'
    };

    const errorSmatis = `SMATIS : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorSmatis;
};

exports.errorReadExcelSPVIEFH = (index) => {
    const indexesHeader = {
        distribution: 'DISTRIBUTION',
        produit: 'PRODUIT',
        adherent: 'ADHERENT',
        statutDate: 'STATUT ET DATES',
        cotisation: 'COTISATION',
        commissionnementReprise: 'COMMISSIONEMENT ET REPRISE',
    };

    const errorSPIVE = `SPIVE : La colonne ${indexesHeader[index]} n'est pas présente (première ligne)`;
    return errorSPIVE;
};

exports.errorReadExcelSPVIESH = (index) => {
    const indexesHeader = {
        code: 'CODE',
        codeVendeur: 'CODE VENDEUR',
        nomCourtierVendeur: 'NOM COURTIER VENDEUR',
        groupe: 'GROUPE',
        entite: 'ENTITE',
        vendeur: 'VENDEUR',
        compagnie: 'COMPAGNIE',
        branche: 'BRANCHE',
        type: 'TYPE',
        gamme: 'GAMME',
        produit: 'PRODUIT',
        formule: 'FORMULE',
        numContrat: 'N° DE CONTRAT',
        nomClient: 'NOM CLIENT',
        prenomClient: 'PRÉNOM CLIENT',
        statutContrat: 'STATUT DU CONTRAT',
        dateSignature: 'DATE DE SIGNATURE',
        dateValidation: 'DATE DE VALIDATION',
        dateEffet: 'DATE D\'EFFET',
        dateResilliation: 'DATE DE RÉSILIATION',
        debutPeriode: 'DÉBUT DE PÉRIODE',
        finPeriode: 'FIN DE PÉRIODE',
        cotisationTTCFrais: 'COTISATION TTC + FRAIS',
        dontFraisSpvie: 'DONT FRAIS SPVIE',
        dontAutreFrais: 'DONT AUTRES FRAIS',
        dontTaxes: 'DONT TAXES',
        dontPrimesHTHorsFrais: 'DONT PRIME HT (HORS FRAIS)',
        tauxTaxes: 'TAUX DE TAXES',
        primeHTAnnuel: 'PRIME HT ANNUELLE',
        periodiciteCommission: 'PÉRIODICITÉ COMMISSIONS',
        assietteDeCommissionnement: 'ASSIETTE DE COMMISSIONNEMENT',
        structureCommissionnementInitiale: 'STRUCTURE COMMISSIONNEMENT INITIALE',
        commissionAppliquee: 'COMMISSION APPLIQUÉE',
        fractionAppliquee: 'FRACTION APPLIQUÉE',
        commission: 'COMMISSION',
        reprise: 'REPRISE',
        solde: 'SOLDE',
        bordereauReference: 'BORDEREAU DE RÉFÉRENCE',
        libelle: 'LIBELLÉ',
    };

    const errorSPIVE = `SPIVE : La colonne ${indexesHeader[index]} n'est pas présente (seconde ligne)`;
    return errorSPIVE;
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

    const errorSwisslifeSurco = `SWISS LIFE SURCO : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorSwisslifeSurco;
};

exports.errorReadExcelUAFLIFE = (index) => {
    const indexesHeader = {
        codeIntermediaireDestinataireReglements: 'Code intermediaire destinataire règlements',
        nomIntermediaireDestinataireReglements: 'Nom intermediaire destinataire règlements',
        codeIntermediaireResponsableContrat: 'Code intermédiaire esponsable contrat',
        nomIntermediaireResponsableContrat: 'Nom intermédiaire responsable contrat',
        codeProduit: 'Code produit',
        libelleProduit: 'Libellé produit',
        numeroContrat: 'Numéro contrat',
        nomSouscripteur: 'Nom souscripteur',
        prenomSouscripteur: 'Prénom souscripteur',
        libelleProfil: 'Libellé profil',
        codeISIN: 'Code ISIN',
        libelleSupport: 'Libellé support',
        natureCommissions: 'Nature commissions',
        typeCommissions: 'Type commissions',
        libelleOperation: 'Libellé opération',
        numeroOperation: 'Numéro opération',
        dateCreationOperation: 'Date création opération',
        dateValidationOperation: 'Date validation opération',
        dateValeurOperation: 'Date valeur opération',
        montantOperationTousSupports: 'Montant de l\'opération (tous supports) (euros)',
        montantOperationSurSupport: 'Montant de l\'opération (sur le support)',
        montantAssietteCommission: 'Montant de l\'assiette de commission',
        tauxCommissionsIntermediaireTeteReseau: 'Taux commissions intermédiaire tête réseau',
        montantCommissionIntermediaireTeteReseau: 'Montant commission intermédiaire tête réseau (euros)',
        tauxCommissionsIntermediaireResponsableContrat: 'Taux commissions intermédiaire responsable contrat',
        montantCommissionsIntermediaireResponsableContrat: 'Montant commissions intermédiaire responsable contrat (euros)',
        nbPartsAssietteCommission: 'Nb de parts de l\'assiette de commission',
        VLUtilisePourCalculFrais: 'VL utilisé pour calcul frais',
        dateValeurVL: 'Date valeur VL',
        codeBordereau: 'Code bordereau',
        dateGenerationBordereau: 'Date génération bordereau',
    };

    const errorUafLife = `UAF LIFE : La colonne ${indexesHeader[index]} n'est pas présente`;
    return errorUafLife;
};
