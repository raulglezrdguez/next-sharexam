import { auth, signIn, signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="flex flex-row justify-between p-4 border-b bg-gray-700 text-gray-200">
      <div className="flex flex-row justify-center align-middle items-center gap-2">
        <Link href={"/"} className="mr-5 md:mr-10">
          <Image
            src="/logo.svg"
            alt="logo"
            className="min-w-12 object-cover"
            width={50}
            height={50}
          />
        </Link>
        <span className="text-3xl">Sharexam</span>
      </div>
      {session ? (
        <div className="flex gap-4 items-center">
          <p className="text-sm">{session.user?.name}</p>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="btn btn-error">Quit</button>
          </form>
        </div>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button className="text-blue-500">Continue with Google</button>
        </form>
      )}
    </nav>
  );
}
