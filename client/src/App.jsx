import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./pages/signUp.jsx";
import SignIn from "./pages/signIn.jsx";
import Home from "./pages/home.jsx";
import About from "./pages/about.jsx";
import Countries from "./pages/coutries.jsx";

import Header from "./components/Header.jsx";
import Profile from "./pages/profile.jsx";
import PrivateRoute from "./routes/privateRoute.jsx";
import SingleCountry from "./components/SingleCountry.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/single-item/:name" element={<SingleCountry />} />
          <Route path="/countries" element={<Countries />} />
          <Route path="/about" element={<About />} />

          {/* Private routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}
