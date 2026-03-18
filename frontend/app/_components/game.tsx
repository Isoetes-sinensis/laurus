'use client';

import { useActionState, useEffect, useState } from "react";
import { GameState, TaxonNames } from "@/app/_actions/types";
import { submitAnswers } from "@/app/_actions/actions";
import Image from "next/image";
import { RightWrongInput } from "@/app/_components/inputs";
import { PrimaryButton } from "@/app/_components/buttons";
import { LoadingBackground } from "@/app/_components/background";

function GameImage({ state, isPending }: {
    state: GameState;
    isPending: boolean;
}) {
    const [imageLoading, setimageLoading] = useState(true);
    const fetching = state.submitted && isPending; // if fetching a new image, used to hide the old image before fetching a new one.
    const loading = fetching || imageLoading; // if a new image has not been completely loaded, either being fetched or being rendered, used to show the loading mask.
    useEffect(() => setimageLoading(true), [state.photoLink]);

    return (
        <div className="relative w-4/5 lg:w-1/2 h-1/2 lg:h-3/5 bg-blue-100 rounded-lg overflow-hidden">
            {loading ? <LoadingBackground /> : null}
            {fetching ? null : <Image src={state.photoLink} alt="plant image" className="object-contain" fill onLoad={() => setimageLoading(false)} />}
        </div>
    );
}

function GameForm({ state, formAction }: {
    state: GameState;
    formAction: (payload: FormData) => void;
}) {
    // User inputs.
    const [form, setForm] = useState<TaxonNames>({
        family: '',
        genus: '',
        specEpithet: ''
    });

    // Clear Genus and Species when Family is left blank.
    const handleFamilyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setForm({
            family: value,
            genus: value ? form.genus : '',
            specEpithet: value ? form.specEpithet : ''
        });
    };

    // Clear Species when Genus is left blank.
    const handleGenusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setForm({
            ...form,
            genus: value,
            specEpithet: value ? form.specEpithet : ''
        });
    };

    const handleSpeciesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            specEpithet: e.target.value
        });
    };

    // Clear user's input before the next round.
    useEffect(() => setForm({
        family: '',
        genus: '',
        specEpithet: ''
    }), [state.round]);

    return (
        <form action={formAction} className="flex flex-col w-4/5 lg:w-1/2 gap-4">
            <div className="flex flex-col gap-1">
                <div className="flex flex-col items-center sm:grid sm:grid-cols-5">
                    <label htmlFor="family">Family</label>
                    <RightWrongInput id="family" name="family" className="col-span-4 w-full" submitted={state.submitted} correct={state.family.correct} correctAnswer={state.family.correctAnswer} value={form.family} disabled={state.submitted} onChange={handleFamilyChange} />
                </div>
                <div className="flex flex-col items-center sm:grid sm:grid-cols-5">
                    <label htmlFor="genus">Genus</label>
                    <RightWrongInput id="genus" name="genus" className="col-span-4 w-full" submitted={state.submitted} correct={state.genus.correct} correctAnswer={state.genus.correctAnswer} value={form.genus} disabled={state.submitted || !form.family} onChange={handleGenusChange} />
                </div>
                <div className="flex flex-col items-center sm:grid sm:grid-cols-5 gap-1">
                    <label htmlFor="species">Species</label>
                    <RightWrongInput className="col-span-2 w-full" submitted={state.submitted} correct={state.genus.correct} correctAnswer={state.genus.correctAnswer} disabled value={form.genus} />
                    <RightWrongInput id="species" name="species" className="col-span-2 w-full" submitted={state.submitted} correct={state.specEpithet.correct} correctAnswer={state.specEpithet.correctAnswer} value={form.specEpithet} disabled={state.submitted || !form.genus} onChange={handleSpeciesChange} />
                </div>
            </div>
            <PrimaryButton>{state.submitted ? 'continue' : 'submit'}</PrimaryButton>
        </form>
    );
}

export default function Game({ photoLink, taxonId }: { 
    photoLink: string; // link of the plant image to display
    taxonId: number; // taxon ID of the plant
}) {

    // Set game state.
    const initialState: GameState = {
        round: 1,
        photoLink: photoLink,
        taxonId: taxonId,
        submitted: false,
        family: { correct: false, correctAnswer: '' },
        genus: { correct: false, correctAnswer: '' },
        specEpithet: { correct: false, correctAnswer: '' },
        score: 0
    };
    const [state, formAction, isPending] = useActionState(submitAnswers, initialState);

    return (
        <div className="flex flex-col w-full h-full items-center justify-center gap-4 text-xl">
            Score: {state.score}
            <GameImage state={state} isPending={isPending} />
            <GameForm state={state} formAction={formAction} />
        </div>
    );
}