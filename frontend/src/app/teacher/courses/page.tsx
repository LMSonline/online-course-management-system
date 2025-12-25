"use client";
import { useState } from 'react';
import Link from "next/link";
import { Plus } from "lucide-react";
import CourseCard from "@/core/components/teacher/course-management/CourseCard";
import CourseSearchBar from "@/core/components/teacher/course-management/CourseSearchBar";
import CourseTabs from "@/core/components/teacher/course-management/CourseTabs";
import NoCourses from "@/core/components/teacher/course-management/NoCourses";

// ...existing code for types and mock data...

type CourseStatus = 'draft' | 'pending' | 'published' | 'rejected';

interface Course {
  id: number;
  title: string;
  thumbnail: string;
  status: CourseStatus;
  students: number;
  revenue: number;
  rating: number;
  reviews: number;
  chapters: number;
  lessons: number;
  duration: string;
  lastUpdated: string;
  price: number;
}

export default function MyCoursesPage() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'draft' | 'pending' | 'published'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const courses: Course[] = [
    // ...existing mock data...
    {
      id: 1,
      title: 'React & TypeScript for Modern Web Apps',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
      status: 'published',
      students: 5421,
      revenue: 54210,
      rating: 4.8,
      reviews: 234,
      chapters: 12,
      lessons: 87,
      duration: '24h 30m',
      lastUpdated: '2 days ago',
      price: 99.99
    },
    {
      id: 2,
      title: 'Node.js & Express – REST APIs from Zero to Hero',
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
      status: 'published',
      students: 2156,
      revenue: 21560,
      rating: 4.6,
      reviews: 89,
      chapters: 10,
      lessons: 65,
      duration: '18h 45m',
      lastUpdated: '5 days ago',
      price: 89.99
    },
    {
      id: 3,
      title: 'Git & GitHub Essentials for Developers',
      thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400',
      status: 'pending',
      students: 0,
      revenue: 0,
      rating: 0,
      reviews: 0,
      chapters: 8,
      lessons: 42,
      duration: '12h 20m',
      lastUpdated: '1 hour ago',
      price: 49.99
    },
    {
      id: 4,
      title: 'Advanced React Patterns & Performance',
      thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400',
      status: 'draft',
      students: 0,
      revenue: 0,
      rating: 0,
      reviews: 0,
      chapters: 3,
      lessons: 12,
      duration: '4h 15m',
      lastUpdated: 'Yesterday',
      price: 79.99
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesTab = selectedTab === 'all' || course.status === selectedTab;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    all: courses.length,
    draft: courses.filter(c => c.status === 'draft').length,
    pending: courses.filter(c => c.status === 'pending').length,
    published: courses.filter(c => c.status === 'published').length
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">My Courses</h2>
              <p className="text-gray-400">Manage and track all your courses</p>
            </div>
            <Link 
              href="/teacher/create-course"
              className="flex items-center gap-2 px-6 py-3 bg-[#00ff00] hover:bg-[#00dd00] text-black rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create New Course
            </Link>
          </div>
          <CourseSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        <CourseTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} stats={stats} />
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <NoCourses searchQuery={searchQuery} />
        )}
      </main>
    </div>
  );
}
