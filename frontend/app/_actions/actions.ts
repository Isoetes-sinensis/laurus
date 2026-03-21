'use server';

import { fetchINaturalistObsAndPhoto, fetchINaturalistTaxa } from "@/app/_actions/data";
import { GameState, LoginFormState } from "@/app/_actions/types";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

// Submit and check user answers.
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

// Login.
export async function login(prevState: LoginFormState, formData: FormData) {
    // Validate username and password.
    const LoginSchema = z.object({
        username: z.string()
            .min(1, 'Username cannot be empty.')
            .trim(),
        password: z.string()
            .min(1, 'Password cannot be empty.')
    });
    const validatedData = LoginSchema.safeParse({
        username: formData.get('username'),
        password: formData.get('password')
    });
    if (!validatedData.success) {
        const errors = z.flattenError(validatedData.error).fieldErrors;
        return { errors: errors };
    }

    // Login from the backend.
    const searchParams = new URLSearchParams();
    searchParams.append('username', validatedData.data.username);
    searchParams.append('password', validatedData.data.password);
    try {
        const res = await fetch('http://localhost:8000/auth/login', {
            method: 'POST',
            body: searchParams,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        if (!res.ok) {
            console.log(res.status, res.statusText);
            return { message: ['Incorrect username or password.'] };
        }
        else {
            const data = await res.json();
            const cookieStore = await cookies();
            cookieStore.set({
                name: 'access_token',
                value: data.access_token,
                httpOnly: true
            }); // Store the access token in cookies.
            redirect('/');
        }
    } catch (error) {
        if (isRedirectError(error)) throw error; // Skip errors thrown by redirect('/').
        console.log(error); // Add functions to deal with errors.
        throw error;
    }
}