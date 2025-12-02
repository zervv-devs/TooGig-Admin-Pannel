import { useState } from "react";
import { Menu, X } from "lucide-react"; // icons (optional)
import tooGig1 from "../path/to/logo"; // update your logo path

const Sidebar = ({ filterStatus, setFilterStatus, navigate }) => {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#1DBF73] p-4 flex justify-between items-center">
        <img src={tooGig1} alt="logo" className="h-8" />
        <button onClick={() => setOpen(true)}>
          <Menu className="text-white w-7 h-7" />
        </button>
      </div>

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-4 flex flex-col transform
        transition-transform duration-300 z-50
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Close button for mobile */}
        <button
          className="md:hidden absolute top-4 right-4"
          onClick={() => setOpen(false)}
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        {/* Logo */}
        <div
          className="bg-[#1DBF73] p-3 rounded-lg flex justify-center items-center cursor-pointer mb-6"
          onClick={() => navigate("/dashboard")}
        >
          <img
            src={tooGig1}
            alt="TooGig Logo"
            className="w-30 h-8 sm:w-30 sm:h-10 object-contain"
          />
        </div>

        {/* Menu Buttons */}
        <div className="flex-1">
          {["all", "approved", "pending", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilterStatus(status);
                setOpen(false); // close on mobile
              }}
              className={`block w-full text-left px-4 py-2 rounded mb-2 transition ${
                filterStatus === status
                  ? "bg-green-700 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {status === "all"
                ? "📋 All Gigs"
                : status === "approved"
                ? "✅ Approved"
                : status === "pending"
                ? "⏳ Pending"
                : "❌ Rejected"}
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          🔒 Logout
        </button>
      </div>

      {/* Drawer Background Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
