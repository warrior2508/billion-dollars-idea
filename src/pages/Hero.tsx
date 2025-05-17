// import { useNavigate } from "react-router";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Features } from "@/components/Feature";

const cards = [
  {
    header: "Reduce AI cost by 40%",
    img: "./images/img1.png",
  },
  {
    header: "Real time insights",
    img: "./images/img2.png",
  },
  {
    header: "Smart Resource Optimizations",
    img: "./images/img3.png",
  },
];

function Hero() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col overflow-hidden relative">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-gradient-to-l from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl translate-x-1/2" />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-green-500/10 to-blue-500/10 rounded-full blur-3xl" />

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_white_70%)] pointer-events-none" />

      <div className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-sm border-b z-20 flex justify-between items-center px-10 py-5">
        <h1 className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
          {" "}
          Sass{" "}
        </h1>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/auth')}
            className="py-2 px-5 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full font-semibold text-white cursor-pointer hover:opacity-90 transition-all"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/auth?mode=signup')}
            className="py-2 px-5 bg-white border-2 border-indigo-600 rounded-full font-semibold text-indigo-600 cursor-pointer hover:bg-indigo-50 transition-all"
          >
            Sign up
          </button>
        </div>
      </div>

      <ContainerScroll
        titleComponent={
          <>
            <div className="relative z-10 flex flex-col justify-center items-center">
              <div className="text-center bg-indigo-700 w-fit py-3 px-8 rounded-full text-white font-semibold cursor-pointer hover:opacity-90 transition-all">
                {" "}
                Save your cost with us →
              </div>
              <h1 className="text-[6rem] font-bold text-black dark:text-white leading-none">
                Control Your{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                  AI Cost
                </span>
                <br />
                <span className="text-4xl font-medium text-gray-700 mt-2 block leading-tight">
                  Monitor, Optimize, and Scale your AI models automatically.
                </span>
              </h1>
            </div>
          </>
        }
      >
        <div className="relative z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-2xl" />
          <img
            src={`/images/dashboard.png`}
            alt="hero"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-left-top shadow-xl"
            draggable={false}
          />
        </div>
      </ContainerScroll>
      <div className="relative max-w-[1320px] mx-auto mb-10">
        <h1 className="text-4xl font-bold text-center pb-10 font-serif">
          {" "}
          Why Choose Us?
        </h1>
        <div className="flex gap-10">
          {cards.map((card, idx) => (
            <Card
              header={card.header}
              id={idx.toString()}
              img={card.img}
              key={idx}
            />
          ))}
        </div>
        <h3 className="text-3xl font-semibold tracking-tight font-serif mt-8 text-center">
          Join 500+ companies saving millions on AI infrastructure
        </h3>
      </div>
      <div className="bg-indigo-200">
        <div className="relative max-w-[1320px] mx-auto mb-10 ">
          <Features />
        </div>
      </div>
    </div>
  );
}

export default Hero;
