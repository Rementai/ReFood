import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/Loader/Loader";
import "./Profile.css";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [likedRecipes, setLikedRecipes] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const handleUpdate = async () => {
    setMessage("");
    setError("");

    const updates = [];

    if (newUsername !== username) {
      updates.push({
        type: "username",
        endpoint: "http://localhost:8080/user/update-username",
        data: { username: newUsername },
      });
    }

    if (password || repeatPassword) {
      if (password !== repeatPassword) {
        setError("Passwords do not match.");
        return;
      }

      updates.push({
        type: "password",
        endpoint: "http://localhost:8080/user/update-password",
        data: { password, repeat_password: repeatPassword },
      });
    }

    if (updates.length === 0) {
      setMessage("No changes made.");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token is missing");
      }

      for (const update of updates) {
        const response = await axios.post(update.endpoint, update.data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (update.type === "username") {
          setUsername(newUsername);
          setMessage(response.data.message || "Username updated successfully!");
        } else if (update.type === "password") {
          setPassword("");
          setRepeatPassword("");
          setMessage(response.data.message || "Password updated successfully!");
        }
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "An error occurred while updating your information."
      );
    }
  };

  if (loading) {
    return <Loader />;
  }

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

            <h3>Change Password</h3>
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

            <button onClick={handleUpdate}>Update</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;