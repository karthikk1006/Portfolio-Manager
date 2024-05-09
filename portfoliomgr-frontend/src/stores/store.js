import { defineStore } from "pinia";

export const useStore = defineStore("store", {
  state: () => ({
    user: {
      user_id: "",
      user_name: "",
      user_email: "",
      access_token: "",
      role: "",
    },
    music: {
      songs: "",
      albums: "",
      playlists: "",
    },
  }),

  actions: {
    setUser(user) {
      this.user = user;
    },
    setMusic(music) {
      this.music = music;
    },
    setPlaylist(playlists) {
      this.music.playlists = playlists;
    },
  },
});
