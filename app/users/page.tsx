import CreateUserForm from "@/components/CreateUserForm";
import dbConnect from "@/lib/db";
import User from "@/lib/models/user.model";

export default async function Page() {
  await dbConnect();
  const users = await User.find({}).lean();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Users admin</h1>

      <CreateUserForm />
      <hr className="my-8" />

      <h2 className="text-xl mb-4">Users registered:</h2>
      {users.map((u) => (
        <p key={u._id.toString()}>
          {u.name} - {u.email}
        </p>
      ))}
    </div>
  );
}
