import { Outlet } from "react-router";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet /> {/* Renders the matched child route */}
    </>
  );
};

export default Layout;
