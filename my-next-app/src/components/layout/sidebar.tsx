'use client';
import React from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { CompanynavItems, IntervieweenavItems, InterviewernavItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import Link from 'next/link';
import Image from 'next/image';
import Logo from "/src/app/assets/TechHire.png";

type SidebarProps = {
  className?: string;
  type?: number;
};

export default function Sidebar({ className, type }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();

  const handleToggle = () => {
    toggle();
  };

  const navItems =
    type === 1
      ? CompanynavItems
      : type === 2
      ? IntervieweenavItems
      : type === 3
      ? InterviewernavItems
      : [];

  return (
    <aside
      className={cn(
        `relative hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block`,
        !isMinimized ? 'w-72' : 'w-[72px]',
        className
      )}
    >
      <div className="hidden p-5 pt-10 lg:block">
      <Link href="/" passHref>
          <Image src={Logo} alt="TechHire Logo" width={150} height={50} />
        </Link>
      </div>
      <ChevronLeft
        className={cn(
          'absolute -right-3 top-10 z-50 cursor-pointer rounded-full border bg-background text-3xl text-foreground',
          isMinimized && 'rotate-180'
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <DashboardNav items={navItems} />
          </div>
        </div>
      </div>
    </aside>
  );
}