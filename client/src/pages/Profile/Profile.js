import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [likedRecipes, setLikedRecipes] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("Token is missing");
        }

        const response = await axios.get("http://localhost:8080/user/info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsername(response.data.username);
        setNewUsername(response.data.username);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user information.");
      }
    };

    fetchUsername();
  }, []);

  const handleSaveChanges = async () => {
    setMessage("");
    setError("");

    if (newUsername === username) {
      setMessage("No changes made to the username.");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token is missing");
      }

      const response = await axios.post(
        "http://localhost:8080/user/update-username",
        { username: newUsername },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsername(newUsername);
      setMessage(response.data.message || "Username updated successfully!");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "An error occurred while updating the username."
      );
    }
  };

  const handlePasswordChange = async () => {
    setMessage("");
    setError("");

    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token is missing");
      }

      const response = await axios.post(
        "http://localhost:8080/user/update-password",
        { password, repeat_password: repeatPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message || "Password updated successfully!");
      setPassword("");
      setRepeatPassword("");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "An error occurred while updating the password."
      );
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="header-content">
          <h1>Hello, {username}!</h1>
          <p>Your cook profile</p>
        </div>
      </div>
      <div className="profile-content">
        <nav className="profile-nav">
          <ul>
            <li>
              <a href="/profile">Profile</a>
            </li>
            <li>
              <a href="/liked">Favorites</a>
            </li>
            <li>
              <a href="/add-recipe">Add new recipe</a>
            </li>
          </ul>
        </nav>
        <div className="profile-info-card">
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">Favorites</span>
              <br />
              <span className="stat-value">{likedRecipes}</span>
            </div>
          </div>
          <div className="profile-form">
            <h2>Change credentials</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <label>
              Username:
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </label>
            <button onClick={handleSaveChanges}>Update Username</button>

            <h2>Change Password</h2>
            <label>
              New Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label>
              Repeat Password:
              <input
                type="password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </label>
            <button onClick={handlePasswordChange}>Update Password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
