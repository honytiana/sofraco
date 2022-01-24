exports.errorReadExcelAVIVA = (error) => {
    const indexesHeader = {
        ireseau: 'RESEAU',
        iregion: 'REGION',
        iinspecteur: 'INSPECTEUR',
        icodeInter: 'CODE INTER',
        inomApporteur: 'NOM DE L\'APPORTEUR',
        inumeroContrat: 'N° DE CONTRAT',
        inumeroCouverture: 'N° DE COUVERTURE',
        inomAssure: 'NOM DE L\'ASSURE',
        inomContrat: 'NOM CONTRAT',
        inomGarantie: 'NOM GARANTIE',
        ifamilleContrat: 'FAMILLE CONTRAT',
        itypeMVT: 'TYPE MVT',
        idateEffetMVT: 'DATE EFFET MVT',
        imoisEffetMVT: 'MOIS EFFET MVT',
        iprodBrute: 'PROD BRUTE',
        iprodObjectifAE: 'PROD POUR OBJECTIF AE',
        iprodCalculAE: 'PROD POUR CALCUL AE',
    };

    const errorAviva = `AVIVA SURCO : La colonne ${indexesHeader[error]} n'est pas présente`;
    return errorAviva;
};