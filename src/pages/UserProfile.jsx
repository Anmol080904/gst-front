import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import './UserProfile.css';

const UserProfile = () => {
   const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://temp-gst.onrender.com/api/details/', {
      method: 'GET',
      credentials:'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setUser(data.gst_user);
        } else {
          console.error('Failed to fetch user:', data.message);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Layout><p>Loading...</p></Layout>;
  if (!user) return <Layout><p>Failed to load user profile.</p></Layout>;
}
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setUser((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleSave = () => {
  //   if (password && password !== confirmPassword) {
  //     alert("Passwords don't match.");
  //     return;
  //   }
  //   setIsEditing(false);
  //   alert('✅ Profile updated.');
  //   setPassword('');
  //   setConfirmPassword('');
  // };

  // const handleLogout = () => {
  //   localStorage.removeItem('user');
  //   localStorage.removeItem('token');
  //   window.location.href = '/login';
  // };

//   return (
//     <Layout title="User Profile">
//       <div className="user-profile">
//         <div className="profile-header">
//           <h2>👤 User Profile</h2>
//           <p>Manage your personal and company information</p>
//         </div>

//         <div className="profile-section">
//           <div className="form-group">
//             <label>Name</label>
//             <input
//               type="text"
//               name="name"
//               value={user.name}
//               onChange={handleChange}
//               disabled={!isEditing}
//             />
//           </div>

//           <div className="form-group">
//             <label>Email</label>
//             <input
//               type="email"
//               name="email"
//               value={user.email}
//               onChange={handleChange}
//               disabled={!isEditing}
//             />
//           </div>

//           <div className="form-group">
//             <label>Company</label>
//             <input
//               type="text"
//               name="company"
//               value={user.company}
//               onChange={handleChange}
//               disabled={!isEditing}
//             />
//           </div>

//           {isEditing && (
//             <>
//               <div className="form-group">
//                 <label>New Password</label>
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Confirm Password</label>
//                 <input
//                   type="password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                 />
//               </div>
//             </>
//           )}

//           <div className="profile-buttons">
//             {isEditing ? (
//               <button className="save-btn" onClick={handleSave}>
//                 💾 Save
//               </button>
//             ) : (
//               <button className="edit-btn" onClick={() => setIsEditing(true)}>
//                 ✏️ Edit Profile
//               </button>
//             )}
//             <button className="logout-btn" onClick={handleLogout}>
//               🚪 Logout
//             </button>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

export default UserProfile;
