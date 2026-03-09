import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex justify-center">
          <div className="flex flex-col lg:w-3/5 h-screen items-center justify-center gap-2 bg-white text-black">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
