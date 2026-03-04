import Link from "next/link";
import { Button } from "@/app/_components/buttons";

export default function Home() {
return (
  <>
    <h1 className="text-black text-5xl">Laurus: A Plant Guessing Game</h1>
    <Link href="/game"><Button>Play</Button></Link>
    <Link href="#"><Button>Login</Button></Link>
    <Link href="#"><Button>About</Button></Link>
  </>
);
}