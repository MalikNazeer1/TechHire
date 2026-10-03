"use client";

import { useEffect, useState } from "react";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "/src/app/assets/TechHire.png";
import { useSession } from "next-auth/react";
import { UserNav } from "@/components/layout/user-nav";
import { useLoading } from '@/context/loading-context';
import { usePathname, useRouter } from 'next/navigation';

/** Avoid turning on the global loader when already on that route — router.push no-ops and pages won't remount to call setLoading(false). */
function isSameAppRoute(pathname: string, target: string): boolean {
  const norm = (p: string) => {
    if (!p || p === "/") return "/";
    const t = p.replace(/\/$/, "");
    return t || "/";
  };
  const a = norm(pathname);
  const b = norm(target);
  if (a === b) return true;
  const isHome = (p: string) => p === "/" || p === "/Homepage";
  return isHome(a) && isHome(b);
}

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const { data: session, status } = useSession();
  const { setLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleNavigation = (path: string) => {
    if (isSameAppRoute(pathname, path)) return;
    setLoading(true);
    router.push(path);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => handleNavigation('/')}
            className="flex items-center h-16"
          >
            <Image 
              src={Logo} 
              alt="TechHire Logo" 
              width={120} 
              height={40}
              className="hover:opacity-80 transition-opacity object-contain" 
              priority
            />
          </button>

          <NavigationMenu>
            <NavigationMenuList className="hidden md:flex gap-6">
              <NavigationMenuItem>
                <button
                  onClick={() => handleNavigation('/AboutUs')}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  About Us
                </button>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <button
                  onClick={() => handleNavigation('/Contact')}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  Contact
                </button>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <button
                  onClick={() => handleNavigation('/PrivacyPolicy')}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  Privacy Policy
                </button>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <button
                  onClick={() => handleNavigation('/TermsOfService')}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  Terms of Service
                </button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          {!session ? (
            <Link href="/SignIn">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Sign In
              </button>
            </Link>
          ) : (
            <UserNav />
          )}
        </div>
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";