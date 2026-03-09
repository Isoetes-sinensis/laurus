'use server';

import { fetchINaturalistObsAndPhoto, fetchINaturalistTaxa } from "@/app/_actions/data";
import { GameState } from "@/app/_actions/types";

export async function submitAnswers(prevState: GameState, formData: FormData) {
    // (Validate form data.)

    // Get actual taxon names.
    const taxonData = await fetchINaturalistTaxa(prevState.taxonId);
    const species = taxonData.name;
    const genus = taxonData.ancestors.find(ancestor => ancestor.rank === 'genus')?.name;
    const family= taxonData.ancestors.find(ancestor => ancestor.rank === 'family')?.name;

    // Get user's answers.
    const familyAnswer = formData.get('family');
    const genusAnswer = formData.get('genus');
    const speciesAnswer = genusAnswer + ' ' + formData.get('species');

    // Calculate user's score.
    let score = 0;
    if (familyAnswer === family) {
        score += 1;
        if (genusAnswer == genus) {
            score += 1;
            if (speciesAnswer == species) {
                score += 1;
            }
        }
    }

    // Fetch new data.
    const {photoLink, data} = await fetchINaturalistObsAndPhoto('medium');

    return {
        photoLink: photoLink,
        taxonId: data.taxon.id,
        score: prevState.score + score
    };
}