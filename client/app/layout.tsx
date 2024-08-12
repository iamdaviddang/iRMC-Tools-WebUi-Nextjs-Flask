import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { FaHistory } from "react-icons/fa";
import { VscTools } from "react-icons/vsc";
import Image from "next/image";
import { GoCommandPalette } from "react-icons/go";
import { PiSignOut } from "react-icons/pi";
import { Toaster } from "@/components/ui/sonner";
import ReportAlert from "@/components/report-alert";
import { HiOutlineCommandLine } from "react-icons/hi2";
import { CiSettings } from "react-icons/ci";
import { FaInfo } from "react-icons/fa";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Tools",
  description: "Tools created by David Dang",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
              <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                  <Link
                    href="/"
                    className="flex items-center gap-2 font-semibold"
                    prefetch={false}
                  >
                    <Image
                      src="/tools.png"
                      alt="tools logo"
                      height={35}
                      width={35}
                    />
                    <span className="text-2xl">Tools</span>
                  </Link>
                </div>

                <div className="flex-1">
                  <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    <Link
                      href="/"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                      prefetch={false}
                    >
                      <VscTools className="h-4 w-4" />
                      <span className="text-xl">iRMC Tools</span>
                    </Link>
                    <Link
                      href="/commands"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                      prefetch={false}
                    >
                      <GoCommandPalette className="h-4 w-4" />
                      <span className="text-xl">Commands</span>
                    </Link>
                    <Link
                      href="/ips"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                      prefetch={false}
                    >
                      <HiOutlineCommandLine className="h-4 w-4" />
                      <span className="text-xl">IP's</span>
                    </Link>
                    <Link
                      href="/fw"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                      prefetch={false}
                    >
                      <FaInfo className="h-4 w-4" />
                      <span className="text-xl">BIOS/IRMC FW</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                      prefetch={false}
                    >
                      <CiSettings className="h-4 w-4" />
                      <span className="text-xl">Settings</span>
                    </Link>
                  </nav>
                </div>
                <div className="mt-auto p-4">
                  <Link
                    href="http://172.25.32.4/monitor/"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary text-red-600"
                    prefetch={false}
                  >
                    <PiSignOut className="h-4 w-4" />
                    <span className="text-xl font-semibold">
                      Go back to monitor
                    </span>
                  </Link>
                  <div className="flex justify-center items-center p-0">
                    <ReportAlert />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0 md:hidden"
                    >
                      <MenuIcon className="h-5 w-5" />
                      <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="flex flex-col">
                    <nav className="grid gap-2 text-lg font-medium">
                      <Link
                        href="#"
                        className="flex items-center gap-2 text-lg font-semibold"
                        prefetch={false}
                      >
                        <Package2Icon className="h-6 w-6" />
                        <span className="sr-only">Acme Inc</span>
                      </Link>
                      <Link
                        href="/"
                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                        prefetch={false}
                      >
                        <VscTools className="h-5 w-5" />
                        Tools
                      </Link>

                      <Link
                        href="/history"
                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                        prefetch={false}
                      >
                        <FaHistory className="h-5 w-5" />
                        History
                      </Link>
                      <Link
                        href="/commands"
                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                        prefetch={false}
                      >
                        <GoCommandPalette className="h-5 w-5" />
                        Commands
                      </Link>
                    </nav>
                    <div className="mt-auto">
                      {/* <Card>
                      <CardHeader>
                        <CardTitle>Created by David Dang</CardTitle>
                        <CardDescription></CardDescription>
                      </CardHeader>
                      <CardContent></CardContent>
                    </Card> */}
                    </div>
                  </SheetContent>
                </Sheet>
                <div className="w-full h-full flex items-center justify-between gap-3">
                  <div id="start" className="h-max w-max"></div>
                  <div id="end" className="flex w-max h-max items-center gap-3">
                    <Link
                      href="https://172.25.32.5/mediawiki/Main_Page"
                      className="mx-[-0.65rem] flex items-center rounded-xl px-3 py-2 text-muted-foreground hover:underline hover:decoration-primary text-[20px] font-semibold"
                      prefetch={false}
                      target="_blank"
                    >
                      <span className="text-primary ">W</span>
                      iki
                    </Link>
                    {/* <ReportAlert /> */}
                    <ThemeToggle />
                  </div>
                </div>
              </header>
              <main className="">{children}</main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

function BellIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function CircleUserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
  );
}

function HomeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function LineChartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function Package2Icon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  );
}

function PackageIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function ShoppingCartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
