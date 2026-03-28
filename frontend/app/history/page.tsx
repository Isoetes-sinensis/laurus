import { fetchGameHistory } from "@/app/_actions/data";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
    // Redirects if user has not logged in.
    const cookieStore = await cookies();
    if (!cookieStore.has('access_token')) redirect('/');
    
    const games = await fetchGameHistory();
    console.log(games);

    return (
        <div className="flex flex-col lg:w-1/2 px-8 items-center justify-center gap-10">
            <h1 className="text-5xl">Game History</h1>
            {/* Show history. */}
        </div>
    );
}