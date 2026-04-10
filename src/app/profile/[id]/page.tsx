'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Star,
  MapPin,
  BookOpen,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Users,
  FileText,
  Clock,
  FlaskConical,
} from 'lucide-react';
import type { TeacherDetail } from '@/lib/teachers';

/* ─── stat pill ─── */
function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 min-w-[120px]">
      <div className="text-orange-400">{icon}</div>
      <span className="text-xl font-semibold text-white">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

/* ─── section wrapper ─── */
function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-orange-400">{icon}</span>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

/* ─── loading skeleton ─── */
function ProfileSkeleton() {
  return (
    <div className="animate-pulse max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* hero */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="h-32 w-32 rounded-2xl bg-white/10 shrink-0" />
        <div className="flex-1 space-y-3 w-full">
          <div className="h-7 w-56 bg-white/10 rounded" />
          <div className="h-4 w-40 bg-white/5 rounded" />
          <div className="h-4 w-48 bg-white/5 rounded" />
          <div className="flex gap-2 pt-2">
            <div className="h-7 w-16 bg-white/5 rounded-full" />
            <div className="h-7 w-20 bg-white/5 rounded-full" />
            <div className="h-7 w-14 bg-white/5 rounded-full" />
          </div>
        </div>
      </div>
      {/* stats */}
      <div className="flex gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 flex-1 bg-white/5 rounded-xl" />
        ))}
      </div>
      {/* blocks */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-40 bg-white/5 rounded-2xl" />
      ))}
    </div>
  );
}

/* ─── main page ─── */
export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [teacher, setTeacher] = useState<TeacherDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTeacher = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/teacher?id=${encodeURIComponent(id)}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error('Teacher not found');
          throw new Error('Failed to fetch profile');
        }
        const data = await res.json();
        setTeacher(data.teacher);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'radial-gradient(125% 125% at 50% 0%, rgba(0,0,0,1) 40%, rgba(30,10,0,0.95) 70%, rgba(120,40,0,0.3) 90%, rgba(245,87,2,0.15) 100%)',
      }}
    >
      {/* Top bar */}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-black/60 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="shrink-0 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-sm text-gray-400 truncate">
            {loading ? 'Loading profile…' : teacher ? teacher.name : 'Profile'}
          </span>
        </div>
      </div>

      {/* Loading */}
      {loading && <ProfileSkeleton />}

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <div className="text-red-400 text-lg font-medium mb-2">
            {error === 'Teacher not found' ? 'Profile not found' : 'Something went wrong'}
          </div>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-5 py-2.5 rounded-full bg-white/10 text-white text-sm hover:bg-white/15 transition-colors"
          >
            Go back
          </button>
        </div>
      )}

      {/* Profile content */}
      {!loading && !error && teacher && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* ── Hero ── */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative h-32 w-32 rounded-2xl overflow-hidden border border-white/10 shrink-0">
              <img src={teacher.image} alt={teacher.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{teacher.name}</h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
                <span className="flex items-center gap-1.5 text-sm text-orange-400 font-medium">
                  <BookOpen size={14} />
                  {teacher.subject}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                  <MapPin size={14} />
                  {teacher.university}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-400">
                  <Star size={14} className="text-orange-400 fill-orange-400" />
                  {teacher.rating}
                  <span className="text-gray-600">({teacher.reviews} reviews)</span>
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {teacher.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-gray-300 bg-white/5 border border-white/10 rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat icon={<Clock size={18} />} label="Years Experience" value={teacher.yearsExperience} />
            <Stat icon={<FileText size={18} />} label="Publications" value={teacher.publications} />
            <Stat icon={<Users size={18} />} label="PhD Students" value={teacher.students} />
            <Stat icon={<Star size={18} />} label="Rating" value={teacher.rating} />
          </div>

          {/* ── About ── */}
          <Section title="About" icon={<BookOpen size={18} />}>
            <p className="text-sm text-gray-300 leading-relaxed">{teacher.about}</p>
          </Section>

          {/* ── Contact ── */}
          <Section title="Contact Information" icon={<Mail size={18} />}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-gray-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Email</p>
                  <p className="text-sm text-gray-300">{teacher.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-gray-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                  <p className="text-sm text-gray-300">{teacher.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building size={16} className="text-gray-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Office</p>
                  <p className="text-sm text-gray-300">{teacher.office}</p>
                </div>
              </div>
            </div>
          </Section>

          {/* ── Education ── */}
          <Section title="Education" icon={<GraduationCap size={18} />}>
            <div className="space-y-4">
              {teacher.education.map((edu, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-orange-400 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">{edu.degree}</p>
                    <p className="text-sm text-gray-400">
                      {edu.institution} &middot; {edu.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Courses ── */}
          <Section title="Courses Taught" icon={<BookOpen size={18} />}>
            <div className="flex flex-wrap gap-2">
              {teacher.courses.map((course) => (
                <span
                  key={course}
                  className="text-sm text-gray-300 bg-white/5 border border-white/10 rounded-xl px-4 py-2"
                >
                  {course}
                </span>
              ))}
            </div>
          </Section>

          {/* ── Research Interests ── */}
          <Section title="Research Interests" icon={<FlaskConical size={18} />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teacher.researchInterests.map((interest) => (
                <div
                  key={interest}
                  className="flex items-center gap-3 text-sm text-gray-300 bg-white/3 border border-white/5 rounded-xl px-4 py-3"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0" />
                  {interest}
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
