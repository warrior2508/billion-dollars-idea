import { NavLink, useNavigate } from "react-router";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const nav = [
  {
    title: "Dashboard",
    link: "/dashboard",
  },
  {
    title: "Models",
    link: "/models",
  },
  {
    title: "Cost",
    link: "/cost",
  },
  {
    title: "Analytics",
    link: "analytics",
  },
  {
    title: "Settings",
    link: "settings",
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="bg-white h-14">
      <div className="flex items-center justify-between max-w-[1320px] px-10 mx-auto h-full">
        <div
          className="font-bold text-xl tracking-tighter cursor-pointer"
          onClick={() => navigate("/")}
        >
          {" "}
          AI SASS
        </div>
        <div className="hidden md:flex md:gap-5 lg:gap-8 text-md tracking-tight font-medium">
          {nav.map((item, index) => (
            <NavLink
              key={index}
              to={item.link}
              className={({ isActive }) =>
                `${
                  isActive
                    ? "text-indigo-700 border-b-[3px] border-indigo-700"
                    : "text-black"
                }`
              }
            >
              {item.title}
            </NavLink>
          ))}
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <div className="border-2 rounded-sm p-2 cursor-pointer">
                <Menu className="font-bold text-3xl" />
              </div>
            </SheetTrigger>
            <SheetContent className="bg-white/90 z-[100] w-fit">
              <SheetHeader>
                <SheetTitle></SheetTitle>
                <SheetDescription className="flex flex-col text-lg gap-5 py-10 px-10">
                  {nav.map((item, index) => (
                    <NavLink
                      key={index}
                      to={item.link}
                      className={({ isActive }) =>
                        `${
                          isActive
                            ? "text-indigo-700 border-b-[3px]"
                            : "text-black"
                        }`
                      }
                    >
                      {item.title}
                    </NavLink>
                  ))}
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
