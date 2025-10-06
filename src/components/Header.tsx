'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Bell, ChevronDown } from 'lucide-react';

export default function Header() {
  const { currentUser, userData, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-black flex items-center">
            <div className="w-8 h-8 bg-black rounded-full mr-2 flex items-center justify-center">
              <span className="text-white text-sm font-bold">B</span>
            </div>
            lossom
          </Link>
          
          {/* Center Navigation - Glassmorphism */}
          <nav className="hidden md:flex">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-6 py-2 shadow-lg">
              <div className="flex items-center space-x-8">
                <Link href="/pricing" className="text-gray-700 hover:text-black text-sm font-medium transition-colors">
                  Pricing
                </Link>
                {currentUser && (
                  <>
                    <Link href="/products" className="text-gray-700 hover:text-black text-sm font-medium transition-colors">
                      Products
                    </Link>
                    <Link href="/integrations" className="text-gray-700 hover:text-black text-sm font-medium transition-colors">
                      Integrations
                    </Link>
                    <Link href="/messages" className="text-gray-700 hover:text-black text-sm font-medium transition-colors">
                      Messages
                    </Link>
                  </>
                )}
                <Link href="/resources" className="text-gray-700 hover:text-black text-sm font-medium transition-colors">
                  Resources
                </Link>
                <Link href="/faq" className="text-gray-700 hover:text-black text-sm font-medium transition-colors">
                  FAQ
                </Link>
                {!currentUser && (
                  <Link href="/contact" className="text-gray-700 hover:text-black text-sm font-medium transition-colors">
                    Contact Us
                  </Link>
                )}
              </div>
            </div>
          </nav>

          {/* Right side - User controls */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <>
                {/* Inbox Icon */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30"
                  asChild
                >
                  <Link href="/messages">
                    <Mail className="h-4 w-4 text-gray-700" />
                  </Link>
                </Button>

                {/* User Avatar with Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-10 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 flex items-center space-x-2"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={userData?.profile?.avatar} />
                        <AvatarFallback className="text-xs">
                          {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-3 w-3 text-gray-700" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-md">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex space-x-3">
                <Button
                  variant="ghost"
                  className="rounded-full text-gray-700 hover:text-black px-4 font-medium"
                  asChild
                >
                  <Link href="/login">Log In</Link>
                </Button>
                <Button
                  className="rounded-full bg-pink-600 hover:bg-pink-700 text-white px-6"
                  asChild
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}