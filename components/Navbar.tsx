import { auth, signIn, signOut } from "@/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="flex justify-between p-4 border-b">
      <span>Sharexam</span>
      {session ? (
        <div className="flex gap-4 items-center">
          <p>Hello, {session.user?.name}</p>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="btn btn-warning">Quit</button>
          </form>
        </div>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button className="text-blue-500">Start Google session</button>
        </form>
      )}
    </nav>
  );
}
