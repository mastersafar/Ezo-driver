'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import icon from '@/app/favicon.ico';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Header({ children }) {
  const path = usePathname();
  const router = useRouter();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const sidebarRef = useRef(null);

  const navigationLinks = [
    { href: '/dashboard', label: 'الرئيسية' },
    { href: '/ordersMenu', label: 'قائمة الرحلات' },
    { href: '/activeOrders', label: 'متابعة الرحلات' },
    { href: '/account', label: 'كشف حساب' },
  ];

  const isActive = (href) => (path === href || path.startsWith(href) ? 'bg-sky-600 hover:bg-sky-600/80 font-bold' : '');

  const toggleSidebar = () => setSidebarVisible((prev) => !prev);
  const closeSidebar = () => setSidebarVisible(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isSidebarVisible
      ) {
        closeSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarVisible]);

  const handleNavigation = (e, href) => {
    e.preventDefault();
    closeSidebar();
    router.push(href);
    router.refresh();
  };



    const handleLogout = () => {
    Cookies.remove('token', { path: '/' });
  
    router.replace('/login');
    router.refresh(); // Ensure middleware is reevaluated
    };

  return (
    <div className="flex h-screen">
      {/* Header */}
      <div className="w-full fixed top-0 z-20 bg-sky-700 shadow-lg flex items-center justify-between px-4 py-2.5">
        <Image src={icon} alt="icon" priority width={40} height={40} style={{ objectFit: 'contain' }} />

        {/* Toggle Button for Small Screens */}
        <button
          onClick={toggleSidebar}
          className="text-white hover:text-gray-300 lg:hidden"
          aria-label="Toggle Sidebar"
        >
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`transition-transform duration-300 bg-sky-800 text-white h-[calc(100vh-3.5rem)] w-64 p-4 z-30 lg:relative lg:translate-x-0 
        ${isSidebarVisible ? 'fixed top-[3.5rem] right-0 translate-x-0' : 'fixed top-[3.5rem] right-0 translate-x-full'}`}
      >
        <button
          onClick={closeSidebar}
          className="text-white hover:text-gray-300 absolute top-2 left-2 lg:hidden"
          aria-label="Close Sidebar"
        >
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <nav className="flex flex-col gap-2 mt-4">
          {navigationLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`bg-sky-700 hover:bg-sky-700/80 py-1.5 px-3 rounded-md ${isActive(link.href)}`}
              onClick={(e) => handleNavigation(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* 🔴 Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-2 w-full bg-red-600 hover:bg-red-700 py-2 rounded-md text-white font-semibold transition"
        >
          تسجيل الخروج
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-[3.5rem] bg-gray-100 overflow-hidden my-1">
        <div className="h-full overflow-auto scrollbar-custom p-3">
          {children}
        </div>
      </div>
    </div>
  );
}
