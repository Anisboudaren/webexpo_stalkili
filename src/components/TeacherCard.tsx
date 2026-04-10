"use client";

import React from "react";
import Link from "next/link";
import { Star, MapPin, BookOpen } from "lucide-react";

export type Teacher = {
  id: string;
  name: string;
  subject: string;
  university: string;
  rating: number;
  reviews: number;
  image: string;
  bio: string;
  tags: string[];
};

export default function TeacherCard({ teacher }: { teacher: Teacher }) {
  return (
    <Link
      href={`/profile/${teacher.id}`}
      className="group relative block bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-white/25 hover:bg-white/8 hover:shadow-[0_0_30px_rgba(245,87,2,0.08)] cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={teacher.image}
          alt={teacher.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Rating badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs">
          <Star size={12} className="text-orange-400 fill-orange-400" />
          <span className="text-white font-medium">{teacher.rating}</span>
          <span className="text-gray-400">({teacher.reviews})</span>
        </div>

        {/* Name overlay on image */}
        <div className="absolute bottom-3 left-4">
          <h3 className="text-lg font-semibold text-white">{teacher.name}</h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3">
        {/* Subject & University */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-sm text-orange-400 font-medium">
            <BookOpen size={14} />
            {teacher.subject}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin size={14} />
            {teacher.university}
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
          {teacher.bio}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-1">
          {teacher.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-gray-300 bg-white/5 border border-white/10 rounded-full px-2.5 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
