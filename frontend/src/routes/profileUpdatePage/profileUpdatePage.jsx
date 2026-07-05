import "./profileUpdatePage.scss";
import { AuthContext } from '../../context/AuthContext'
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from '../../lib/apiRequest'
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function ProfileUpdatePage() {
  const { updateUser, CurrentUser } = useContext(AuthContext)
  const [error, setError] = useState('')
  const [avatar, setAvatar] = useState([])
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const { username, email, password } = Object.fromEntries(formData)

    try {
      const res = await apiRequest.put(`users/${CurrentUser.id}`, {
        username,
        email,
        password: password || undefined,
        avatar: avatar[0] || CurrentUser.avatar
      })
      updateUser(res.data)
      navigate(`/profile/${CurrentUser.id}`)
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || "Failed to update profile. Please try again.")
    }
  }

  return (
    <div className="profileUpdatePage">
      <div className="cardWrapper">
        <div className="formContainer">
          <form onSubmit={handleSubmit}>
            <div className="headerContainer">
              <div className="iconCircle">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="titleIcon">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="headerText">
                <h1>Update Profile</h1>
                <p>Manage your account details and profile information</p>
              </div>
            </div>

            <div className="item">
              <label htmlFor="username">Username</label>
              <div className="inputField">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fieldIcon">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  id="username"
                  name="username"
                  type="text"
                  defaultValue={CurrentUser.username}
                  required
                />
              </div>
            </div>

            <div className="item">
              <label htmlFor="email">Email</label>
              <div className="inputField">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fieldIcon">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={CurrentUser.email}
                  required
                />
              </div>
            </div>

            <div className="item">
              <label htmlFor="password">Password</label>
              <div className="inputField">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fieldIcon">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter new password (leave blank to keep current)"
                />
                <button
                  type="button"
                  className="passwordToggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="eyeIcon"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="eyeIcon"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
              <span className="fieldTip">Password must be at least 6 characters long.</span>
            </div>

            <button type="submit" className="submitBtn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btnIcon">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Update Profile
            </button>
            
            {error && <span className="errorMsg">{error}</span>}
          </form>
        </div>
        
        <div className="sideContainer">
          <div className="sideCard">
            <UploadWidget 
              uwConfig={{
                cloudName: "dfformrpw",
                uploadPreset: "realEstate",
                multiple: false,
                maxImageSize: 2000000,
                folder: "avatars",
              }}
              setState={setAvatar}
            >
              <div className="avatarTrigger">
                <div className="avatarWrapper">
                  <img src={avatar[0] || CurrentUser.avatar || '/noavatar.png'} alt="Profile Avatar" className="avatar" />
                  <div className="cameraIcon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="camIcon">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="avatarHeader">
                <h2>Profile Picture</h2>
                <p>Upload a profile picture to personalize your account</p>
              </div>

              <div className="uploadBox">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="cloudUploadIcon">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="uploadTitle">Click to upload or drag and drop</span>
                <span className="uploadSub">PNG, JPG or WEBP (Max. 2MB)</span>
              </div>
            </UploadWidget>

            <span className="recommendedText">Recommended: Square image</span>
          </div>
        </div>
      </div>

      <div className="footerSecure">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="secureIcon">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span>Your information is secure and encrypted</span>
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
