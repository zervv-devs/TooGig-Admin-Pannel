import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import tooGig1 from "../Images/TooGig1.png"



const SERVICE_ID = "service_bi2xmdb";
const TEMPLATE_ID = "template_qs1a34q";
const PUBLIC_KEY = "j8VnXuRx-HiUjs4h1";


const subcategoryOptions = {
  "Programming & Tech": ["Web Development", "App Development", "Software Development"],
  "Marketing & Sales": ["Email Marketing", "Social Media", "SEO"],
  "Photography & Editing": ["Photo Editing", "Retouching", "Color Grading"],
  "Graphics & Design": ["Logo Design", "Branding", "Illustration"],
  "Virtual Assistant": ["Admin Tasks", "Data Entry", "Scheduling"],
  "Content Writing": ["Blogs", "Product Descriptions", "Proofreading"],
  "UI/UX Design": ["Wireframes", "Prototypes", "User Research"],
  "Customer Support": ["Live Chat", "Email Support", "CRM Management"]
};

const Dashboard = () => {
  const [gigs, setGigs] = useState([]);
  const [selectedGig, setSelectedGig] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");



  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) navigate("/login");
    refreshGigs();
  }, [navigate]);

  const refreshGigs = async () => {
    const querySnapshot = await getDocs(collection(db, "promotedGigs"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setGigs(data);
  };

const handleReject = async () => {
  const reason = prompt("Enter rejection reason (optional):");
  const docRef = doc(db, "promotedGigs", selectedGig.id);

  await updateDoc(docRef, {
    status: "rejected",
    rejectionReason: reason || "",
  });

  // Send email to the seller
  if (selectedGig?.sellerEmail) {
    const templateParams = {
      to_email: selectedGig.sellerEmail,
      gig_title: selectedGig.gigTitle || "Fiverr Gig",
      reason: reason || "Not specified",
    };

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then(() => {
        alert("❌ Gig Rejected & Email Sent");
      })
      .catch((error) => {
        console.error("Email sending failed:", error);
        alert("Gig rejected but email failed to send.");
      });
  } else {
    alert("❌ Gig Rejected. Seller email missing.");
  }

  setSelectedGig(null);
  refreshGigs();
};


  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this gig?");
    if (!confirmDelete) return;
    const docRef = doc(db, "promotedGigs", selectedGig.id);
    await deleteDoc(docRef);
    alert("🗑️ Gig Deleted");
    setSelectedGig(null);
    refreshGigs();
  };

 const handleApprove = async () => {
  const docRef = doc(db, "promotedGigs", selectedGig.id);
  await updateDoc(docRef, {
    status: "approved",
    gigTitle: selectedGig.gigTitle,
    gigImage: selectedGig.gigImage,
    tags: selectedGig.tags,
    category: selectedGig.category,
    subcategory: selectedGig.subcategory,
    affiliateLink: selectedGig.affiliateLink || "", // ✅ Save affiliate link
    visible: true,
  });
  alert("✅ Gig Approved!");
  setSelectedGig(null);
  refreshGigs();
};


 const filteredGigs = gigs.filter((gig) => {
  const status = gig.status || "pending";
  const matchesStatus = filterStatus === "all" || status === filterStatus;

  const sellerName = (gig.sellerName || "").toLowerCase();
  const gigTitle = (gig.gigTitle || "").toLowerCase();

  const matchesSearch =
    sellerName.includes(searchTerm) || gigTitle.includes(searchTerm);

  return matchesStatus && matchesSearch;
});

const handleSaveChanges = async () => {
  try {
    const docRef = doc(db, "promotedGigs", selectedGig.id);
    await updateDoc(docRef, {
      gigTitle: selectedGig.gigTitle,
      gigImage: selectedGig.gigImage,
      tags: selectedGig.tags,
      category: selectedGig.category,
      subcategory: selectedGig.subcategory,
      affiliateLink: selectedGig.affiliateLink || "",
    });
    alert("✅ Changes Saved");
    refreshGigs();
  } catch (error) {
    console.error("Error saving gig changes:", error);
    alert("⚠️ Failed to save changes");
  }
};
const handleLogout = () => {
  localStorage.removeItem("isAdmin");
  navigate("/"); // or "/login"
};
// Pagination
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 9; // 3-per-row × 3 rows

const indexOfLast = currentPage * itemsPerPage;
const indexOfFirst = indexOfLast - itemsPerPage;
const currentGigs = filteredGigs.slice(indexOfFirst, indexOfLast);

const totalPages = Math.ceil(filteredGigs.length / itemsPerPage);

const nextPage = () => {
  if (currentPage < totalPages) setCurrentPage((p) => p + 1);
};

const prevPage = () => {
  if (currentPage > 1) setCurrentPage((p) => p - 1);
};


  return (
    <div className="flex min-h-screen bg-gray-100">
        
          
 <div className="w-64 bg-white shadow-md flex flex-col fixed left-0 top-0 h-screen border-none rounded-none">


  {/* Logo Section - Full width, top, green background */}
  <div
    className="bg-[#1DBF73] w-full p-4 flex justify-center items-center cursor-pointer"
    onClick={() => navigate("/dashboard")}
  >
    <img
      src={tooGig1}
      alt="TooGig Logo"
      className="h-10 object-contain"
    />
  </div>

  <div className="p-4"></div>

  {/* Menu Buttons */}
  <div className="flex-1 px-4 ">
    {["all", "approved", "pending", "rejected"].map((status) => (
      <button
        key={status}
        onClick={() => setFilterStatus(status)}
        className={`block w-full text-left px-4 py-2 rounded mb-2 transition ${
          filterStatus === status
            ? "bg-[#1DBF73] text-white"
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

  {/* Logout Button (Green) */}
  <button
    onClick={() => {
      localStorage.removeItem("isAdmin");
      navigate("/");
    }}
    className="bg-[#1DBF73] text-white px-4 py-3 font-semibold hover:bg-[#1DBF73] transition w-full"
  >
    🔒 Logout
  </button>
</div>



      {/* Main content */}
      <div className="flex-1 p-6 ml-64">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 border-b pb-2">
          🛠️ Admin Panel - <span className="text-[#1DBF73] capitalize">{filterStatus} Gigs</span>
        </h2>
           <div className="mb-6">
  <input
    type="text"
    placeholder="🔍 Search by seller name or title..."
    className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
  />
</div>
 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentGigs.map((gig) => (
 <div
              key={gig.id}
              className="bg-white p-5 rounded-lg shadow hover:shadow-md transition cursor-pointer border border-gray-200"
              onClick={() => setSelectedGig(gig)}
            >
              
             <p className="text-sm text-gray-500 mb-1">👤 {gig.sellerName || gig.sellerEmail}</p>
             <p className="text-sm text-gray-500 mb-1"> {gig.sellerEmail}</p>

{gig.status === "approved" ? (
  <p className="text-lg font-semibold text-gray-800 truncate">{gig.gigTitle}</p>
) : (
  <p className={`text-base font-semibold ${
    gig.status === "rejected" ? "text-red-600" : "text-yellow-600"
  }`}>
    {gig.status === "rejected" ? "❌ Rejected by Admin" : "⏳ Awaiting Approval"}
  </p>
)}

              <p className="text-sm mt-1 text-gray-600">⏳ {gig.duration} days | 💸 {gig.discount}%</p>
              <p className={`text-sm mt-2 font-medium ${gig.status === "approved" ? "text-green-600" : gig.status === "rejected" ? "text-red-600" : "text-yellow-500"}`}>
                {gig.status || "pending"}
              </p>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedGig && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl relative max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-3 right-4 text-xl font-bold text-gray-600 hover:text-red-500"
                onClick={() => setSelectedGig(null)}
              >
                ×
              </button>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">📝 Review & Complete Gig Info</h3>
      <div className="mb-4">
  <label className="block text-sm font-medium text-gray-600 mb-1">Original Gig Link</label>
  <a
    href={selectedGig.gigLink}
    target="_blank"
    rel="noopener noreferrer"
    className="block w-full bg-gray-100 text-blue-600 underline px-4 py-2 rounded break-all"
  >
    {selectedGig.gigLink}
  </a>
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">Affiliate Link (optional)</label>
  <input
    type="text"
    className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
    value={selectedGig.affiliateLink || ""}
    onChange={(e) =>
      setSelectedGig({ ...selectedGig, affiliateLink: e.target.value })
    }
    placeholder="Enter affiliate or redirected gig link"
  />
</div>


              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Discount (%)</label>
                  <input
                    type="text"
                    value={selectedGig.discount || ""}
                    readOnly
                    className="w-full bg-gray-100 border px-4 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Duration (days)</label>
                  <input
                    type="text"
                    value={selectedGig.duration || ""}
                    readOnly
                    className="w-full bg-gray-100 border px-4 py-2 rounded"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Gig Title</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={selectedGig.gigTitle || ""}
                  onChange={(e) => setSelectedGig({ ...selectedGig, gigTitle: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Gig Image URL</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={selectedGig.gigImage || ""}
                  onChange={(e) => setSelectedGig({ ...selectedGig, gigImage: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={selectedGig.tags || ""}
                  onChange={(e) => setSelectedGig({ ...selectedGig, tags: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={selectedGig.category || ""}
                  onChange={(e) => {
                    const newCat = e.target.value;
                    setSelectedGig({
                      ...selectedGig,
                      category: newCat,
                      subcategory: ""
                    });
                  }}
                >
                  <option value="">Select a category</option>
                  {Object.keys(subcategoryOptions).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                <select
                  className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={selectedGig.subcategory || ""}
                  onChange={(e) => setSelectedGig({ ...selectedGig, subcategory: e.target.value })}
                  disabled={!selectedGig.category}
                >
                  <option value="">Select a subcategory</option>
                  {(subcategoryOptions[selectedGig.category] || []).map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={handleApprove}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  ✅ Approve
                </button>
                <button
                  onClick={handleReject}
                  className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                >
                  ❌ Reject
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  🗑️ Delete
                </button>
                <button
  onClick={handleSaveChanges}
  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
  💾 Save Changes
</button>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end items-center gap-4 mt-6 mb-20">
  <button
    onClick={prevPage}
    disabled={currentPage === 1}
    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
  >
    Previous
  </button>

  <span className="font-semibold text-gray-800">
    Page {currentPage} of {totalPages}
  </span>

  <button
    onClick={nextPage}
    disabled={currentPage === totalPages}
    className="px-4 py-2 bg-green-800 text-white rounded disabled:opacity-50"
  >
    Next
  </button>
</div>

      </div>
    
    </div>
  );
};

export default Dashboard;
