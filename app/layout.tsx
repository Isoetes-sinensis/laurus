import "@/app/globals.css";
import "@/app/colors.css";
import { Voltaire } from "next/font/google";

const voltaire = Voltaire({
  weight: '400',
  subsets: ['latin']
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex justify-center">
          <div className={"flex flex-col lg:w-3/5 h-screen items-center justify-center gap-2 bg-white text-black " + voltaire.className}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
