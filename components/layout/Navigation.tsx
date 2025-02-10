'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Session } from '@supabase/auth-js';

interface User {
  id: string;
  email: string | undefined;
  user_metadata: {
    full_name: string;
  };
  full_name: string;
  app_metadata: {
    role?: string;
  };
  role?: string;
}

// Define the custom User type
interface CustomUser {
  full_name: string;
  id: string;
  email: string;
  role?: string;
}

// Function to convert Supabase User to custom User
const convertSupabaseUser = (supabaseUser: import('@supabase/auth-js').User | null): CustomUser | null => {
  if (!supabaseUser) return null;
  return {
    full_name: supabaseUser.user_metadata.full_name,
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    role: supabaseUser.app_metadata?.role,
  };
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing environment variables for Supabase configuration');
}

function Navigation() {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabaseClient = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      if (!supabaseClient) return;
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session) {
        setUser(session?.user ? convertSupabaseUser(session.user) || null : null);
      } else {
        console.log('No active session found. User is not authenticated.');
      }
    };

    fetchSession();

    const subscription = supabaseClient?.auth.onAuthStateChange((event: import('@supabase/auth-js').AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ? convertSupabaseUser(session.user) || null : null);
    });

    return () => {
      subscription?.data?.subscription?.unsubscribe();
    };
  }, [supabaseClient]);

  const handleLogout = async () => {
    if (!supabaseClient) return;
    await supabaseClient.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const isActive = (path: string) => pathname === path;

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold">
              Real Estate
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList className="flex space-x-4">
                <NavigationMenuItem>
                  <Link href="/properties/list/buy" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Buy
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/properties/list/rent" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Rent
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/sell" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Sell
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/pricing" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Pricing
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                {user && (
                  <NavigationMenuItem>
                    <Link href="/alerts" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Alerts
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )}
                {user?.role === 'admin' && (
                  <NavigationMenuItem>
                    <Link href="/admin" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Admin
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">{user.full_name}</span>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" passHref>
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" passHref>
                  <Button variant="default" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/properties/list/buy"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
              >
                Buy
              </Link>
              <Link
                href="/properties/list/rent"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
              >
                Rent
              </Link>
              <Link
                href="/sell"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
              >
                Sell
              </Link>
              <Link
                href="/pricing"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
              >
                Pricing
              </Link>
              {user && (
                <Link
                  href="/alerts"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                >
                  Alerts
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                >
                  Admin
                </Link>
              )}
              {user ? (
                <>
                  <div className="px-3 py-2 text-sm">{user.full_name}</div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navigation;
