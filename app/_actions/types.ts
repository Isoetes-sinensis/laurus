export type INaturalistObsType = {
    id: number;
    uri: string;
    taxon: {
        id: number;
        name: string;
    };
    photos: [
        {
            url: string;
        }
    ];
};

export type INaturalistTaxaType = {
    id: number;
    name: string;
    ancestors: [
        {
            id: number;
            rank: string;
            name: string;
        }
    ];
}

export type TaxonNames = {
    family: string;
    genus: string;
    specEpithet: string; 
}

export type GameState = {
    photoLink: string;
    taxonId: number;
    score: number;
}