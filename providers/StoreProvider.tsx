'use client'

import useUserStore from "@/stores/user-profile.store";
import { Profile } from "@/types/authentication.type";
import React, { useEffect } from "react";

interface StoreProviderProps {
  children?: React.ReactNode;
  profile?: Profile;
}

const StoreProvider = ({ children, profile }: StoreProviderProps) => {
  const setProfile = useUserStore((state) => state.setProfileData);

  useEffect(() => {
    if (profile) {
      setProfile(profile);
    }
  }, [profile, setProfile]);

  return children;
};

export default StoreProvider;
