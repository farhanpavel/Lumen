"use client";
import { Button } from "@/components/ui/button";
import {
  AlignEndHorizontal,
  AlignHorizontalJustifyCenter,
  AudioWaveform,
  Blinds,
  BrickWall,
  CircleAlert,
  CircleArrowOutUpRight,
  CircleCheck,
  Router,
} from "lucide-react";
import React from "react";
import { FaGooglePlay, FaSpotify, FaAirbnb } from "react-icons/fa";
import { GrGoogleWallet } from "react-icons/gr";
import { CgAdidas } from "react-icons/cg";
import { SiPuma } from "react-icons/si";
import { useRouter } from "next/navigation";
export default function Hero() {
  const router = useRouter();
  return (
    <div className="font-mona">
      <div>
        <div className="flex flex-col items-center justify-center mt-[4%] ">
          <div>
            <h1 className="text-6xl font-semibold leading-[4.2rem] text-[#322372]">
              Illuminate <span className="text-tertiary">Your Path</span> to a
              Dream Career <br /> & Bridge the Gap to{" "}
              <span className="text-tertiary">Industry Readiness</span>
            </h1>
          </div>
          <div>
            <p className="text-[#5a5a5a] text-lg font-medium w-[65%] mx-auto text-center mt-7">
              Lumen helps fresh graduates and job seekers overcome the
              experience gap. Upload your resume, get AI-powered mock
              interviews, personalized preparation plans, and career path
              generation to confidently step into your chosen field.
            </p>
          </div>
          <div className="grid grid-cols-6 gap-10 mt-10">
            {/* Feature 1 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 flex items-center justify-center text-tertiary shadow-xl bg-white p-6 rounded-lg">
                <CircleCheck strokeWidth={2} className="w-full h-full" />
              </div>
              <h1 className="text-xs leading-4 text-center mt-2 text-[#322372] font-semibold">
                Smart Resume <br /> Upload & Onboarding
              </h1>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 flex items-center justify-center text-tertiary shadow-xl bg-white p-6 rounded-lg">
                <AlignHorizontalJustifyCenter
                  strokeWidth={2}
                  className="w-full h-full"
                />
              </div>
              <h1 className="text-xs leading-4 text-center mt-2 text-[#322372] font-semibold">
                Automated <br /> ATS Screening
              </h1>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 flex items-center justify-center text-tertiary shadow-xl bg-white p-6 rounded-lg">
                <AudioWaveform strokeWidth={2} className="w-full h-full" />
              </div>
              <h1 className="text-xs leading-4 text-center mt-2 text-[#322372] font-semibold">
                AI-Powered <br /> Mock Interviews
              </h1>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 flex items-center justify-center text-tertiary shadow-xl bg-white p-6 rounded-lg">
                <Blinds strokeWidth={2} className="w-full h-full" />
              </div>
              <h1 className="text-xs leading-4 text-center mt-2 text-[#322372] font-semibold">
                Insightful <br /> Resume Rating
              </h1>
            </div>

            {/* Feature 5 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 flex items-center justify-center text-tertiary shadow-xl bg-white p-6 rounded-lg">
                <BrickWall strokeWidth={2} className="w-full h-full" />
              </div>
              <h1 className="text-xs leading-4 text-center mt-2 text-[#322372] font-semibold">
                Personalized Job & <br /> Skill Preparation
              </h1>
            </div>

            {/* Feature 6 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 flex items-center justify-center text-tertiary shadow-xl bg-white p-6 rounded-lg">
                <CircleArrowOutUpRight
                  strokeWidth={2}
                  className="w-full h-full"
                />
              </div>
              <h1 className="text-xs leading-4 text-center mt-2 text-[#322372] font-semibold">
                Strategic Career <br /> Path Generation
              </h1>
            </div>
          </div>
          <div className="space-x-5 mt-[4%]">
            <Button
              onClick={() => {
                router.push("/signin");
              }}
              className="rounded-lg px-10 bg-tertiary text-white hover:bg-purple-700"
            >
              Signin
            </Button>
            <Button
              onClick={() => {
                router.push("/signin");
              }}
              className="rounded-lg px-10 border-tertiary bg-white border-[1.5px] text-tertiary hover:bg-white hover:text-tertiary"
            >
              Get Started
            </Button>
          </div>
        </div>
        <div className="mt-[7%]">
          <h1 className="text-[#322372] text-2xl font-semibold text-center">
            Preparing You For{" "}
            <span className="text-tertiary">Companies Like:</span>
          </h1>
          <div className="flex  py-10 justify-center space-x-[5%] items-center">
            <div className="flex items-center space-x-2 opacity-50">
              <FaGooglePlay className="text-3xl " />
              <h1 className="font-semibold text-sm">Google Pay</h1>
            </div>
            <div className="flex items-center space-x-2 opacity-50">
              <FaSpotify className="text-3xl" />
              <h1 className="font-semibold text-sm">Spotify</h1>
            </div>
            <div className="flex items-center space-x-2 opacity-50">
              <FaAirbnb className="text-3xl" />
              <h1 className="font-semibold text-sm">Airbnb</h1>
            </div>
            <div className="flex items-center space-x-2 opacity-50">
              <GrGoogleWallet className="text-3xl" />
              <h1 className="font-semibold text-sm">Google Wallet</h1>
            </div>
            <div className="flex items-center space-x-2 opacity-50">
              <CgAdidas className="text-3xl" />
              <h1 className="font-semibold text-sm">Addidas</h1>
            </div>
            <div className="flex items-center space-x-2 opacity-50">
              <SiPuma className="text-3xl" />
              <h1 className="font-semibold text-sm">Puma</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
