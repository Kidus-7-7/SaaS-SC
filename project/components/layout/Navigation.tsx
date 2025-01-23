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

export function Navigation() {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabaseClient = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

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
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Real Estate
            </Link>
            <NavigationMenu className="ml-8">
              <NavigationMenuList>
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

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Button onClick={handleLogout} variant="outline">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
