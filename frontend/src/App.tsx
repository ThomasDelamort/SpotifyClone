import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages/home/HomePage.tsx";
import AuthCallbackPage from "@/pages/auth-callback/AuthCallbackPage.tsx";
import MainLayout from "@/layout/MainLayout.tsx";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import AlbumPage from "@/pages/album/AlbumPage.tsx";
import SearchPage from "@/pages/search/SearchPage.tsx";
import SinglesPage from "@/pages/singles/SinglesPage.tsx";
import ArtistPage from "@/pages/artist/ArtistPage.tsx";
import AdminPage from "@/pages/admin/AdminPage.tsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/sso-callback"
          element={
            <AuthenticateWithRedirectCallback
              signUpForceRedirectUrl={"/auth-callback"}
            />
          }
        />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
        <Route path="/admin" element={<AdminPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/singles" element={<SinglesPage />} />
          <Route path="/albums/:albumId" element={<AlbumPage />} />
          <Route path="/artists/:artistId" element={<ArtistPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
