'use server';

import { fetchINaturalistObsAndPhoto, fetchINaturalistTaxa } from "@/app/_actions/data";
import { GameState } from "@/app/_actions/types";

export async function submitAnswers(prevState: GameState, formData: FormData) {
    // (Validate form data.)

    let state = { ...prevState };

    if (state.submitted) {
        state.submitted = false;
        state.round += 1;

        // Fetch new data.
        const {photoLink, data} = await fetchINaturalistObsAndPhoto('large');
        state.photoLink = photoLink;
        state.taxonId = data.taxon.id;
    }
    else {
        state.submitted = true;

        // Get actual taxon names.
        const taxonData = await fetchINaturalistTaxa(prevState.taxonId);
        const specEpithet = taxonData.name.split(' ')[1];
        const genus = taxonData.ancestors.find(ancestor => ancestor.rank === 'genus')?.name as string;
        const family = taxonData.ancestors.find(ancestor => ancestor.rank === 'family')?.name as string;

        // Get user's answers.
        const familyAnswer = formData.get('family');
        const genusAnswer = formData.get('genus');
        const specEpithetAnswer = formData.get('species');

        // Calculate user's score.
        let score = 0;
        let familyCorrect = false;
        let genusCorrect = false;
        let speciesCorrect = false;

        if (family === familyAnswer) {
            score += 1;
            familyCorrect = true;
            if (genus === genusAnswer) {
                score += 1;
                genusCorrect = true;
                if (specEpithet === specEpithetAnswer) {
                    score += 1;
                    speciesCorrect = true;
                }
            }
        }

        state.score += score;
        state.family = { correct: familyCorrect, correctAnswer: family };
        state.genus = { correct: genusCorrect, correctAnswer: genus };
        state.specEpithet = { correct: speciesCorrect, correctAnswer: specEpithet };
    }

    return state;
}