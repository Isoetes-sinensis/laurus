import Link from "next/link";
import { Button } from "./_components/buttons";

export default function Home() {
  return (
    <div className="flex flex-col lg:w-3/5 h-screen items-center justify-center gap-2 bg-white">
      <h1 className="text-black text-5xl">Laurus: A Plant Guessing Game</h1>
      <Link href="/game"><Button>Play</Button></Link>
      <Link href="#"><Button>Login</Button></Link>
      <Link href="#"><Button>About</Button></Link>
    </div>
  );
}