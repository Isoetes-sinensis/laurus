import Link from "next/link";
import { Button } from "@/app/_components/buttons";

export default function Page() {
    return (
        <>
            <h1 className="text-black text-5xl">Game Mode</h1>
            <Link href="/game/play"><Button>Default Mode</Button></Link>
        </>
    );
}