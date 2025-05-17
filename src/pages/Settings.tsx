import {
  ArrowDownToLine,
  KeyRound,
  UserPlus,
  Lock,
  LockOpen,
} from "lucide-react";

const UserAccounts = [
  {
    name: "John Doe",
    role: "Software Engineer",
    plan: "Pro Plan",
    profilePic: "/images/profile.png",
  },
  {
    name: "Jane Smith",
    role: "Graphic Designer",
    plan: "Basic Plan",
    profilePic: "/images/profile.png",
  },
  {
    name: "David Lee",
    role: "Project Manager",
    plan: "Enterprise Plan",
    profilePic: "/images/profile.png",
  },
];

const Settings = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-[1320px] mx-auto flex flex-col gap-10 py-8 px-6">
        {/* User Accounts Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {" "}
                User Accounts{" "}
              </h1>
              <div className="text-gray-600">
                {" "}
                Manage user profiles and roles
              </div>
            </div>
            <button className="bg-[#6366F1] text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
              <span className="">
                {" "}
                <UserPlus />
              </span>
              Invite User
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {UserAccounts.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-2">
                  <div className="font-bold text-lg"> {user.name} </div>
                  <div className="text-gray-600">
                    <div> {user.role}</div>
                    <div> {user.plan}</div>
                  </div>
                </div>
                <div className="h-16 w-16 rounded-full overflow-hidden">
                  <img
                    src={user.profilePic}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Alerts</h2>
          <p className="text-gray-600 mb-6">
            Manage your alert preferences and notifications settings to stay
            informed.
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded accent-[#6366F1]"
                  defaultChecked
                />
                <span>Email Notifications</span>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded accent-[#6366F1]"
                />
                <span>SMS Alerts</span>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded accent-[#6366F1]"
                  defaultChecked
                />
                <span>Push Notifications</span>
              </label>
            </div>
            <button className="bg-[#6366F1] text-white px-6 py-2 rounded-lg mt-4 cursor-pointer">
              Save Changes
            </button>
          </div>
        </div>

        {/* API Keys Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">API Keys</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <button className="bg-[#6366F1] text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
                <span className="">
                  <KeyRound />
                </span>
                Generate Key
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
                <span>
                  <Lock />
                </span>
                Deactivate Key
              </button>
              <button className="bg-[#6366F1] text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
                <span>
                  {" "}
                  <LockOpen />
                </span>
                Activate Key
              </button>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded accent-[#6366F1]"
                />
                <span>Regenerate Active Keys</span>
              </label>
            </div>
          </div>
        </div>

        {/* Billing Info Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Billing Info</h2>
          <div className="flex items-center gap-3 mt-4">
            <span className="text-gray-600">
              Download your billing invoices:
            </span>
            <button className="bg-[#6366F1] text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
              <span className="material-icons">
                <ArrowDownToLine />
              </span>
              Download Invoices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
