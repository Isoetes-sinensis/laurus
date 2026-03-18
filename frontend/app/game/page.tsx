import Link from "next/link";
import { HollowButton } from "@/app/_components/buttons";

export default function Page() {
    return (
        <div className="flex flex-col lg:w-1/2 px-8 items-center justify-center gap-10">
            <h1 className="text-5xl">Game Mode</h1>
            <div className="flex flex-col w-full max-w-75 gap-2">
                <Link href="/game/play"><HollowButton className="w-full">Default Mode</HollowButton></Link>
            </div>
        </div>
    );
}