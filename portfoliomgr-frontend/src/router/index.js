import { createRouter, createWebHashHistory } from "vue-router";
import SignUpVue from "../components/SignUp.vue";
import LoginVue from "../components/Login.vue";
import HomeVue from "../components/Home.vue";
import DashboardVue from "../components/Dashboard.vue";
import creatorSignUpVue from "../components/creatorSignUp.vue";
import AboutVue from "../components/About.vue";
import PlaylistVue from "../components/Playlists.vue";
import newPlaylistVue from "../components/newPlaylist.vue";
import playlistSongsVue from "../components/playlistSongs.vue";
import addSongVue from "../components/addSong.vue";
import SongVue from "../components/Song.vue";
import CreatorProfileVue from "../components/creatorProfile.vue";
import editAlbumVue from "../components/editAlbums.vue";
import editSongVue from "../components/editSongs.vue";
import FlagSongVue from "../components/flagSong.vue";
import AlbumSongsVue from "../components/albumSongs.vue";
import adminMusicVue from "../components/adminMusic.vue";
import FlaggedSongsVue from "../components/Flagged.vue";
import SearchVue from "../components/Search.vue";
import UserProfileVue from "../components/userProfile.vue";
import addShareVue from "../components/addShares.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeVue,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUpVue,
  },
  {
    path: "/login",
    name: "login",
    component: LoginVue,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardVue,
  },
  {
    path: "/creatorSignUp",
    name: "creatorSignUp",
    component: creatorSignUpVue,
  },
  {
    path: "/about",
    name: "about",
    component: AboutVue,
  },
  {
    path: "/playlists",
    name: "playlists",
    component: PlaylistVue,
  },
  {
    path: "/newPlaylist",
    name: "newPlaylist",
    component: newPlaylistVue,
  },
  {
    path: "/playlists/songs",
    name: "playlistSongs",
    component: playlistSongsVue,
  },
  {
    path: "/addSong",
    name: "addSong",
    component: addSongVue,
  },
  {
    path: "/song/:song_name",
    name: "playSong",
    component: SongVue,
  },
  {
    path: "/creatorProfile",
    name: "creatorProfile",
    component: CreatorProfileVue,
  },
  {
    path: "/edit/albums/:album_name",
    name: "editAlbum",
    component: editAlbumVue,
  },
  {
    path: "/edit/songs/:song_name",
    name: "editSong",
    component: editSongVue,
  },
  {
    path: "/flag/:Song_ID",
    name: "flagSong",
    component: FlagSongVue,
  },
  {
    path: "/album/:album_name",
    name: "albumSongs",
    component: AlbumSongsVue,
  },
  {
    path: "/admin/music",
    name: "adminMusic",
    component: adminMusicVue,
  },
  {
    path: "/flagged",
    name: "FlaggedSongs",
    component: FlaggedSongsVue,
  },
  {
    path: "/search",
    name: "search",
    component: SearchVue,
  },
  {
    path: "/userProfile",
    name: "userProfile",
    component: UserProfileVue,
  },
  {
    path: "/addShares",
    name: "addShare",
    component: addShareVue,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
