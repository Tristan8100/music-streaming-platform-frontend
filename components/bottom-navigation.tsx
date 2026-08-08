'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Music, Flame, Heart, Settings, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', href: '/user/dashboard' },
  { icon: Music, label: 'Feed', href: '/user/feed' },
  { icon: Flame, label: 'Popular', href: '/user/popular/albums' },
  { icon: Heart, label: 'Liked', href: '/liked-songs' },
  { icon: Settings, label: 'Settings', href: '/user/settings' },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/80 backdrop-blur-md md:hidden"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "w-full flex flex-col items-center gap-1 py-3 px-2 transition-colors relative",
                  isActive ? "text-green-500" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-green-500/10 rounded-lg"
                    transition={{ type: "spring", stiffness: 380, damping: 40 }}
                  />
                )}
                <Icon className="w-6 h-6 relative z-10" />
                <span className="text-xs relative z-10">{item.label}</span>
              </motion.button>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
