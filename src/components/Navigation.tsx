import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, TrendingUp, Home, Search, Plus, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Track FD", href: "/track", icon: Search },
    { name: "Open New FD", href: "/open-fd", icon: Plus },
    { name: "Calculator", href: "/calculator", icon: Calculator },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const NavLinks = ({ mobile = false, onItemClick }: { mobile?: boolean; onItemClick?: () => void }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              mobile 
                ? "w-full justify-start text-base py-3" 
                : "hover:bg-white/10 hover:text-white",
              active 
                ? mobile
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/15 text-white"
                : mobile
                  ? "text-muted-foreground hover:text-foreground hover:bg-accent"
                  : "text-white/80"
            )}
          >
            <Icon className={cn("w-4 h-4", mobile && "w-5 h-5")} />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-xl bg-primary/95 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 text-white hover:text-white/90 transition-colors">
            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">FD Banking Portal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavLinks />
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold">FD Banking Portal</span>
              </div>
              <div className="flex flex-col gap-2">
                <NavLinks mobile onItemClick={() => setIsOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;