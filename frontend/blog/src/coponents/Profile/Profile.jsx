"use client";

import { useEffect, useState } from "react";
import css from "./styles.module.css";
import axios from "axios";
import api from "@/utils/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/auth/profile/");
      setProfile(response.data);
    } catch (error) {
      setError("An error occurred while fetching profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className={css.profile}>
        <div className="container">
          <div className={css.profile__wrapper}>
            <div>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={css.profile}>
        <div className="container">
          <div className={css.profile__wrapper}>
            <div>{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={css.profile}>
      <div className="container">
        <div className={css.profile__wrapper}>
          <div>
            <h1>User Profile</h1>
            <p>Full Name: {profile.fullname}</p>
            <p>Email: {profile.email}</p>
            <p>ID: {profile.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
