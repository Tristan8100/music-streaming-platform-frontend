"use client"

import type React from "react"
import { useState } from "react"
import { ChevronDown, Music, Heart, Flame, ChevronLeft, X } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface MenuItem {
  label: string
  icon: React.ReactNode
  href: string
  submenu?: { label: string; href: string }[]
}

const menuItems: MenuItem[] = [
  {
    label: "Feed",
    icon: <Music className="w-5 h-5" />,
    href: "/user/feed",
  },
  {
    label: "Liked Songs",
    icon: <Heart className="w-5 h-5" />,
    href: "/liked-songs",
  },
  {
    label: "Popular",
    icon: <Flame className="w-5 h-5" />,
    href: "/popular",
    submenu: [
      { label: "Songs", href: "/user/popular/songs" },
      { label: "Artists", href: "/user/popular/artists" },
      { label: "Albums", href: "/user/popular/albums" },
    ],
  },
  {
    label: "Artist Mode",
    icon: <Music className="w-5 h-5" />,
    href: "/artist-mode",
    submenu: [
      { label: "Manage Albums", href: "/user/my-albums" },
      { label: "Profile", href: "/user/settings" },
      { label: "Analytics", href: "/user/my-analytics" },
    ]
  }
]

function SidebarContent({ isCollapsed }: { isCollapsed: boolean }) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpand = (label: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(label)) {
      newExpanded.delete(label)
    } else {
      newExpanded.add(label)
    }
    setExpandedItems(newExpanded)
  }

  return (
    <>
      {/* Logo Section */}
    

      {/* Navigation Menu */}
      <nav className={cn("flex-1", isCollapsed ? "p-2" : "p-4 space-y-2")}>
        {menuItems.map((item) => (
          <div key={item.label}>
            {item.submenu ? (
              <div>
                <button
                  onClick={() => toggleExpand(item.label)}
                  className={cn(
                    "w-full flex items-center justify-between rounded-lg transition-all duration-200",
                    isCollapsed ? "px-2 py-3 justify-center" : "px-4 py-3",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    "text-sidebar-foreground",
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className={cn("flex items-center gap-3", isCollapsed && "w-full justify-center")}>
                    {item.icon}
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
                  </div>
                  {!isCollapsed && (
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        expandedItems.has(item.label) && "rotate-180",
                      )}
                    />
                  )}
                </button>

                {expandedItems.has(item.label) && (
                  <div
                    className={cn(
                      "mt-1 space-y-1 border-l border-sidebar-border/50",
                      isCollapsed ? "hidden" : "ml-4 pl-3",
                    )}
                  >
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.href}
                        href={subitem.href}
                        className={cn(
                          "block px-4 py-2 rounded-lg text-sm transition-all duration-200",
                          "text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground",
                        )}
                      >
                        {subitem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg transition-all duration-200",
                  isCollapsed ? "px-2 py-3 justify-center" : "px-4 py-3 gap-3",
                  "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
                title={isCollapsed ? item.label : undefined}
              >
                {item.icon}
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      {!isCollapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="px-4 py-3 rounded-lg bg-music-primary/10 border border-music-primary/30">
            <p className="text-xs font-semibold text-music-primary mb-1">PREMIUM</p>
            <p className="text-xs text-sidebar-foreground/70">Unlock all features</p>
          </div>
        </div>
      )}
    </>
  )
}

interface AppSidebarProps {
  className?: string,
  isDesktopCollapsed: boolean
  setIsDesktopCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  setIsOffcanvasOpen: React.Dispatch<React.SetStateAction<boolean>>
  isOffcanvasOpen: boolean
}

export function AppSidebar({ className, isDesktopCollapsed, isOffcanvasOpen, setIsDesktopCollapsed, setIsOffcanvasOpen }: AppSidebarProps) {
  // const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false)
  // const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar - Collapsible */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-full bg-sidebar rounded-2xl m-4 shadow border-r border-sidebar-border absolute overflow-y-auto left-0 top-0 transition-all duration-300 z-40",
          isDesktopCollapsed ? "w-20" : "w-64",
          className
        )}
      >
        <div className="flex items-center justify-center p-2 border">
          <button
            onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
            title={isDesktopCollapsed ? "Expand" : "Collapse"}
          >
              <div className={cn("flex justify-center items-center gap-2 w-full", isDesktopCollapsed && "flex-col")}>
                <div className="w-8 h-8 bg-gradient-to-br from-music-primary to-music-accent rounded-lg flex items-center justify-center">
                  <Music className="w-5 h-5 text-primary" />
                </div>
                {!isDesktopCollapsed && <span className="text-xl font-bold text-sidebar-foreground">SoundHub</span>}
                <ChevronLeft className={cn("w-5 h-5 transition-transform duration-300", isDesktopCollapsed && "rotate-180")} />
              </div>
          </button>
        </div>

        <SidebarContent isCollapsed={isDesktopCollapsed} />
      </aside>

      {/* Mobile Offcanvas Sheet */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOffcanvasOpen(true)}
          className="fixed bottom-6 right-6 p-3 bg-primary rounded-full text-white z-40 transition-colors"
          title="Open menu"
        >
          <Music className="w-6 h-6" />
        </button>

        {/* Offcanvas Overlay */}
        {isOffcanvasOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={() => setIsOffcanvasOpen(false)} />
        )}

        {/* Offcanvas Panel */}
        <div
          className={cn(
            "fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50 transition-transform duration-300 md:hidden",
            isOffcanvasOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-music-primary to-music-accent rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-sidebar-foreground">SoundHub</span>
            </div>
            <button
              onClick={() => setIsOffcanvasOpen(false)}
              className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <SidebarContent isCollapsed={false} />
        </div>
      </div>
    </>
  )
}
