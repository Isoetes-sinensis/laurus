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

type AnswerState = {
    userAnswer: string;
    correctAnswer: string;
    correct: boolean;
}

type RoundState = {
    round: number;
    photoLink: string;
    taxonId: number;
    family: AnswerState;
    genus: AnswerState;
    specEpithet: AnswerState;
    score: number;
}

export type GameState = {
    mode: string;
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

export type User = {
    id: number,
    name: string
}

export type Game = {
    id: number;
    userId: number;
    mode: string;
    roundCount: number;
    completedAt: string;
    score: number;
}

export type Round = {
    id: number;
    gameId: number;
    round: number;
    photoLink: string;
    taxonId: number;
    score: number;
}

export type Answer = {
    id: number;
    roundId: number;
    rank: string;
    userAnswer?: string;
    correctAnswer: string;
    correct: boolean;
}