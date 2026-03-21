import Link from "next/link";
import { HollowButton } from "@/app/_components/buttons";
import Image from "next/image";
import { cookies } from "next/headers";

export default async function Home() {
    const cookieStore = await cookies();
    const loggedIn = cookieStore.has('access_token');

    return (
        <div className="flex flex-col lg:w-1/2 px-8 items-center justify-center gap-10">
            <Image src="/laurus-logo-with-name-v1.svg" alt="Laurus" width={300} height={300} />
            <div className="flex flex-col w-full max-w-75 gap-2">
                <Link href="/game"><HollowButton className="w-full">Play</HollowButton></Link>
                {loggedIn ? null : <Link href="/login"><HollowButton className="w-full">Login</HollowButton></Link>}
                <Link href="#"><HollowButton className="w-full">About</HollowButton></Link>
            </div>
        </div>
    );
}