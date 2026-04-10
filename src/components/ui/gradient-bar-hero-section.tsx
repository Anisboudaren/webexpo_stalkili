"use client";

import React, { useState } from "react";
import { Globe, Mail, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AvatarProps = { imageSrc: string; delay: number };

const Avatar: React.FC<AvatarProps> = ({ imageSrc, delay }) => (
  <div
    className="relative h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full overflow-hidden border-2 border-gray-700 shadow-lg animate-fadeIn"
    style={{ animationDelay: `${delay}ms` }}
  >
    <img
      src={imageSrc}
      alt="User avatar"
      className="h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
  </div>
);

const TrustElements: React.FC = () => {
  const avatars = [
    "https://images.pexels.com/photos/2726111/pexels-photo-2726111.jpeg?auto=compress&cs=tinysrgb&w=100",
    "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=100",
    "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100",
    "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100",
  ];
  return (
    <div className="inline-flex items-center space-x-3 bg-gray-900/60 backdrop-blur-sm rounded-full py-2 px-3 sm:py-2 sm:px-4 text-xs sm:text-sm">
      <div className="flex -space-x-2 sm:-space-x-3 ">
        {avatars.map((avatar, index) => (
          <Avatar key={index} imageSrc={avatar} delay={index * 200} />
        ))}
      </div>
      <p
        className="text-white whitespace-nowrap"
        style={{ animationDelay: "800ms" }}
      >
        <span className="text-white font-semibold">2.4K</span> researchers
        already matched
      </p>
    </div>
  );
};

const SupervisorSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/results?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="relative z-10 w-full">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search supervisors or research areas..."
          className="flex-1 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gray-900/60 border border-gray-700 focus:border-white outline-none text-white text-sm sm:text-base shadow-[0_0_15px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-300"
        />
        <button
          type="submit"
          className="px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 transform hover:scale-105 whitespace-nowrap text-sm sm:text-base bg-white hover:bg-gray-100 text-black"
        >
          Search
        </button>
      </form>
    </div>
  );
};

const GradientBars: React.FC = () => {
  const [numBars] = useState(15);

  const calculateHeight = (index: number, total: number) => {
    const position = index / (total - 1);
    const maxHeight = 100;
    const minHeight = 30;

    const center = 0.5;
    const distanceFromCenter = Math.abs(position - center);
    const heightPercentage = Math.pow(distanceFromCenter * 2, 1.2);

    return minHeight + (maxHeight - minHeight) * heightPercentage;
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div
        className="flex h-full"
        style={{
          width: "100%",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {Array.from({ length: numBars }).map((_, index) => {
          const height = calculateHeight(index, numBars);
          return (
            <div
              key={index}
              style={{
                flex: "1 0 calc(100% / 15)",
                maxWidth: "calc(100% / 15)",
                height: "100%",
                background:
                  "linear-gradient(to top, rgb(255, 60, 0), transparent)",
                transform: `scaleY(${height / 100})`,
                transformOrigin: "bottom",
                outline: "1px solid rgba(0, 0, 0, 0)",
                boxSizing: "border-box",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export const Component: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center px-6 sm:px-8 md:px-12 overflow-hidden rounded-bl-[4rem] rounded-br-[4rem]">
      <div className="absolute inset-0 bg-gray-950"></div>
      <GradientBars />
      <div className="relative z-10 text-center w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen pt-28 pb-8 sm:pt-32 sm:pb-16">
        <div className="mb-6 sm:mb-8">
          <TrustElements />
        </div>
        <h1 className="w-full text-white leading-tight tracking-tight mb-6 sm:mb-8 px-4">
          <span className="block font-medium text-[clamp(1.5rem,6vw,3.75rem)] whitespace-nowrap">
            Know who you're walking
          </span>
          <span className="block italic text-[clamp(1.5rem,6vw,3.75rem)] whitespace-nowrap">
            into a room with.
          </span>
        </h1>
        <div className="mb-6 sm:mb-10 px-4">
          <p className="text-[clamp(1rem,3vw,1.5rem)] text-gray-400 leading-relaxed">
            AI-powered research briefs for any high-stakes interaction.
          </p>
          <p className="text-[clamp(1rem,3vw,1.5rem)] text-gray-400 leading-relaxed">
            Find your perfect PhD supervisor — ranked, explained, actionable.
          </p>
        </div>
        <div className="w-full max-w-2xl mb-6 sm:mb-8 px-4">
          <SupervisorSearch />
        </div>
        <Link
          href="/chat"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-full px-5 py-2.5 transition-all duration-300 hover:bg-white/5"
        >
          <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
          Ask our AI assistant
        </Link>
        <div className="flex justify-center space-x-6">
          <a
            href="#"
            className="text-gray-500 hover:text-gray-300 transition-colors duration-300"
          >
            <Globe size={20} />
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-gray-300 transition-colors duration-300"
          >
            <Mail size={20} />
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-gray-300 transition-colors duration-300"
          >
            <X size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};
