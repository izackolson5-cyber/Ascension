import { NavLink as RouterNavLink } from "react-router-dom";
import { motion } from "motion/react";
import { Home, BarChart3, TrendingUp, Settings } from "lucide-react";
import { cn } from "@/src/lib/utils";

const NAV_ITEMS = [
  { path: "/", label: "Scan", icon: Home },
  { path: "/results", label: "Results", icon: BarChart3 },
  { path: "/progress", label: "Progress", icon: TrendingUp },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/80 pb-safe backdrop-blur-xl"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-3">
        {NAV_ITEMS.map((item) => (
          <RouterNavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "relative flex flex-col items-center space-y-1 px-4 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-3 h-1 w-8 rounded-full gradient-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium uppercase tracking-wider">
                  {item.label}
                </span>
              </>
            )}
          </RouterNavLink>
        ))}
      </div>
    </nav>
  );
}
