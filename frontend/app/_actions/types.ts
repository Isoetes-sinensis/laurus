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
    round: number;
    photoLink: string;
    taxonId: number;
    submitted: boolean;
    family: { correct: boolean; correctAnswer: string };
    genus: { correct: boolean; correctAnswer: string };
    specEpithet: { correct: boolean; correctAnswer: string };
    score: number;
}

export type LoginFormState = {
    errors?: {
        username?: string[];
        password?: string[];
    }
    message?: string[];
}