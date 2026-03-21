'use client';

import { PrimaryButton } from "@/app/_components/buttons";
import { login } from "@/app/_actions/actions";
import { Input } from "@/app/_components/inputs";
import { useActionState } from "react";
import { LoginFormState } from "@/app/_actions/types";

export function LoginForm() {
    const initialState: LoginFormState = {};
    const [state, formAction, isPending] = useActionState(login, initialState);

    return (
            <form action={formAction} className="flex flex-col w-4/5 lg:w-1/2 gap-4">
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col items-center sm:grid sm:grid-cols-4">
                        <label htmlFor="username">Username</label>
                        <Input id="username" name="username" className={`col-span-3 w-full ${state.errors?.username ? 'border-red-400' : ''}`} />
                        {state.errors?.username?.map((message, index) => <span key={index} className="col-span-3 col-start-2 text-xs text-red-400">{message}</span>)}
                    </div>
                    <div className="flex flex-col items-center sm:grid sm:grid-cols-4">
                        <label htmlFor="password">Password</label>
                        <Input id="password" name="password" type="password" className={`col-span-3 w-full ${state.errors?.password ? 'border-red-400' : ''}`} />
                        {state.errors?.password?.map((message, index) => <span key={index} className="col-span-3 col-start-2 text-xs text-red-400">{message}</span>)}
                    </div>
                    <div className="flex flex-col items-center sm:grid sm:grid-cols-4">
                        {state.message?.map((message, index) => <span key={index} className="col-span-3 col-start-2 text-xs text-red-400">{message}</span>)}
                    </div>
                </div>
                <PrimaryButton>login</PrimaryButton>
            </form>
    );
}