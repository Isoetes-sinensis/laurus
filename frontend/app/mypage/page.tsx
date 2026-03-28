import Link from "next/link";
import { HollowButton } from "@/app/_components/buttons";
import { fetchCurrentUser } from "@/app/_actions/data";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
    // Redirect if user has not logged in.
    const cookieStore = await cookies();
    if (!cookieStore.has('access_token')) redirect('/');
    
    const user = await fetchCurrentUser();

    return (
        <div className="flex flex-col lg:w-1/2 px-8 items-center justify-center gap-10">
            <h1 className="text-5xl">Welcome, {user.name}!</h1>
            <div className="flex flex-col w-full max-w-75 gap-2">
                <Link href="#"><HollowButton className="w-full">History</HollowButton></Link>
            </div>
        </div>
    );
}