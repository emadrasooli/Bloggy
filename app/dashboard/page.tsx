import { useUser } from '../../lib/auth';
import PostForm from '../../components/PostForm';

const Dashboard = () => {
  const user = useUser();

  if (!user) {
    return <div>Please log in to access your dashboard.</div>;
  }

  return (
    <div>
      <h1>Your Dashboard</h1>
      <PostForm user={user} />
    </div>
  );
};

export default Dashboard;




{/* <div className="text-white max-w-3xl mx-auto p-6 flex flex-col space-y-6">
<h1 className="text-3xl font-medium">Dashboard</h1>
<Button onClick={() => router.push("/")} variant={"link"} className="text-gray-300 w-fit"><ArrowLeft />Home</Button>
<div className="bg-white text-black p-4 flex flex-row items-center space-x-4 relative rounded-xl">
  <div>
    <IoPerson size={40}/>
  </div>
  <div>
    <p className="text-lg font-semibold flex items-center gap-2">{session?.user?.name} <span className="text-xs text-white bg-green-700 px-2 rounded-full">{session?.user?.role}</span></p>
    <p className="text-gray-600 text-medium">{session?.user?.email}</p>
  </div>
  <div className="absolute right-4">
    <Button onClick={handleLogout} variant={"destructive"}>Logout</Button>
  </div>
</div>

</div> */}