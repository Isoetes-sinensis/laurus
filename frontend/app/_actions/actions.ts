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

    let state = JSON.parse(JSON.stringify(prevState));

    // Go to the next round if user chooses to continue.
    if (state.submitted) {
        // Game completed when reaching the maximum round.
        if (state.currentRound >= state.maxRound) {
            state.completed = true;
            state.completedAt = new Date().toISOString();
        } else {
            state.submitted = false;
            state.currentRound += 1;

            // Fetch new data before the next round.
            const {photoLink, data} = await fetchINaturalistObsAndPhoto('large');
            state.rounds.push({ 
                round: state.currentRound,
                photoLink: photoLink,
                taxonId: data.taxon.id,
                family: { userAnswer: '', correctAnswer: '', correct: false },
                genus: { userAnswer: '', correctAnswer: '', correct: false },
                specEpithet: { userAnswer: '', correctAnswer: '', correct: false },
                score: 0
            });
        }
    }

    // Check the answers after submission.
    else {
        state.submitted = true;

        // Get actual taxon names.
        const taxonData = await fetchINaturalistTaxa(state.rounds[state.currentRound - 1].taxonId);
        const specEpithet = taxonData.name.split(' ')[1];
        const genus = taxonData.ancestors.find(ancestor => ancestor.rank === 'genus')?.name as string;
        const family = taxonData.ancestors.find(ancestor => ancestor.rank === 'family')?.name as string;

        // Get user's answers.
        const familyAnswer = (formData.get('family') ?? '') as string;
        const genusAnswer = (formData.get('genus') ?? '') as string;
        const specEpithetAnswer = (formData.get('species') ?? '') as string;

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

        state.totalScore += score;
        state.rounds[state.currentRound - 1].score = score;
        state.rounds[state.currentRound - 1].family = { userAnswer: familyAnswer, correctAnswer: family, correct: familyCorrect };
        state.rounds[state.currentRound - 1].genus = { userAnswer: genusAnswer, correctAnswer: genus, correct: genusCorrect };
        state.rounds[state.currentRound - 1].specEpithet = { userAnswer:specEpithetAnswer, correctAnswer: specEpithet, correct: speciesCorrect };
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