'use client';

import { useActionState, useState } from "react";
import { TaxonNames } from "@/app/_actions/types";
import { submitAnswers } from "@/app/_actions/actions";

export default function Game({ photoLink, taxonId }: { 
    photoLink: string; // link of the plant image to display
    taxonId: number; // taxon ID of the plant
}) {
    // User inputs.
    const [form, setForm] = useState<TaxonNames>({
        family: "",
        genus: "",
        specEpithet: ""
    });

    // Clear Genus and Species when Family is left blank.
    const handleFamilyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setForm({
            family: value,
            genus: value ? form.genus : "",
            specEpithet: value ? form.specEpithet : ""
        });
    };

    // Clear Species when Genus is left blank.
    const handleGenusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setForm({
            ...form,
            genus: value,
            specEpithet: value ? form.specEpithet : "",
        });
    };

    const handleSpeciesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            specEpithet: e.target.value,
        });
    };

    const initialState = {
        photoLink: photoLink,
        taxonId: taxonId,
        score: 0
    };
    const [state, formAction, isPending] = useActionState(submitAnswers, initialState);

    return (
        <>
            Score: {state.score}
            <img src={state.photoLink} alt="plant image" />
            <form action={formAction}>
                <div>
                    <label htmlFor="family">Family</label>
                    <input id="family" name="family" className="" value={form.family} onChange={handleFamilyChange} />
                </div>
                <div>
                    <label htmlFor="genus">Genus</label>
                    <input id="genus" name="genus" className="" value={form.genus} disabled={!form.family} onChange={handleGenusChange} />
                </div>
                <div>
                    <label htmlFor="species">Species</label>
                    <input className="" disabled value={form.genus} />
                    <input id="species" name="species" className="" value={form.specEpithet} disabled={!form.genus} onChange={handleSpeciesChange} />
                </div>
                <button>submit</button>
            </form>
        </>
    );
}