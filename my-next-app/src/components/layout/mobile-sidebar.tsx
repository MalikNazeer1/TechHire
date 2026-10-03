'use client';
import { DashboardNav } from '@/components/dashboard-nav';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CompanynavItems, IntervieweenavItems, InterviewernavItems } from '@/constants/data';
import { MenuIcon } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '/src/app/assets/TechHire.png';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: number;
}

export function MobileSidebar({ className, type }: SidebarProps) {
  const [open, setOpen] = useState(false);

  const navItems =
    type === 1
      ? CompanynavItems
      : type === 2
      ? IntervieweenavItems
      : type === 3
      ? InterviewernavItems
      : [];

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="p-2">
            <MenuIcon className="h-6 w-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="!px-0">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
            <Link href="/" passHref>
                <Image src={Logo} alt="TechHire Logo" width={150} height={50} />
              </Link>
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Overview
              </h2>
              <div className="space-y-1">
                <DashboardNav
                  items={navItems}
                  isMobileNav={true}
                  setOpen={setOpen}
                />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}