import { cookies } from "next/headers";
import { LoginForm } from "@/app/_components/login";
import { redirect } from "next/navigation";

export default async function Page() {
    // Redirect if user logged in.
    const cookieStore = await cookies();
    if (cookieStore.has('access_token')) redirect('/');
    
    return (
        <div className="flex flex-col w-full h-full items-center justify-center gap-8 text-xl">
            <h1 className="text-5xl">Login</h1>
            <LoginForm />
        </div>
    );
}