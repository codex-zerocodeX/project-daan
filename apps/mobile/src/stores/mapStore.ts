import { create } from "zustand";

type MapState = {
  followUser: boolean;
  setFollowUser: (followUser: boolean) => void;
};

// Example zustand store: UI-only state lives here, never server data.
export const useMapStore = create<MapState>((set) => ({
  followUser: false,
  setFollowUser: (followUser) => set({ followUser }),
}));
