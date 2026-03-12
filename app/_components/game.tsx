'use client';

import { useActionState, useState } from "react";
import { TaxonNames } from "@/app/_actions/types";
import { submitAnswers } from "@/app/_actions/actions";
import Image from "next/image";
import { Input } from "@/app/_components/inputs";
import { PrimaryButton } from "@/app/_components/buttons";

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
        <div className="flex flex-col w-full h-full items-center justify-center gap-4 text-xl">
            Score: {state.score}
            <div className="relative w-4/5 lg:w-1/2 h-1/2 lg:h-3/5 bg-blue-100 rounded-lg">
                <Image src={state.photoLink} alt="plant image" className="object-contain" fill />
            </div>
            <form action={formAction} className="flex flex-col w-4/5 lg:w-1/2 gap-4">
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col items-center sm:grid sm:grid-cols-5">
                        <label htmlFor="family">Family</label>
                        <Input id="family" name="family" className="col-span-4 w-full" value={form.family} onChange={handleFamilyChange} />
                    </div>
                    <div className="flex flex-col items-center sm:grid sm:grid-cols-5">
                        <label htmlFor="genus">Genus</label>
                        <Input id="genus" name="genus" className="col-span-4 w-full" value={form.genus} disabled={!form.family} onChange={handleGenusChange} />
                    </div>
                    <div className="flex flex-col items-center sm:grid sm:grid-cols-5 gap-1">
                        <label htmlFor="species">Species</label>
                        <Input className="col-span-2 w-full" disabled value={form.genus} />
                        <Input id="species" name="species" className="col-span-2 w-full" value={form.specEpithet} disabled={!form.genus} onChange={handleSpeciesChange} />
                    </div>
                </div>
                <PrimaryButton>submit</PrimaryButton>
            </form>
        </div>
    );
}