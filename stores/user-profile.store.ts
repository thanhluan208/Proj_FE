import { Profile } from "@/types/authentication.type";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

interface userState {
  profile: Profile | null;
  setProfileData: (value: Profile | null) => void;
}

const useUserStore = createWithEqualityFn<userState>()(
  (set) => ({
    profile: null,
    setProfileData: (value: Profile | null) => {
      if (!value) return;

      set({
        profile: value,
      });
    },
    token: null,
  }),
  shallow
);

export default useUserStore;
