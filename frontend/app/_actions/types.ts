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

type Answer = {
    userAnswer: string;
    correctAnswer: string;
    correct: boolean;
}

type RoundState = {
    round: number;
    photoLink: string;
    taxonId: number;
    family: Answer;
    genus: Answer;
    specEpithet: Answer;
    score: number;
}

export type GameState = {
    mode: 'default';
    maxRound: number;
    totalScore: number;
    currentRound: number;
    submitted: boolean;
    completed: boolean;
    completedAt?: string;
    rounds: RoundState[];
}

export type LoginFormState = {
    errors?: {
        username?: string[];
        password?: string[];
    }
    message?: string[];
}