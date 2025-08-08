import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, TrendingUp, Home, Search, Plus, Calculator, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/AuthWrapper";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

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

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
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
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-2xl bg-gradient-to-r from-primary/95 to-primary-dark/95 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 text-white hover:text-white/90 transition-all duration-300 group">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-xl blur-md group-hover:blur-lg transition-all"></div>
              <div className="relative p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm">
                <TrendingUp className="w-7 h-7" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold">Elite FD Portal</span>
              <span className="text-xs text-white/70 font-medium">Indian Banking</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <NavLinks />
            </div>
            
            {user ? (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/20">
                <span className="text-sm text-white/80">
                  {user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-white hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/20">
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
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
                
                {user ? (
                  <div className="pt-4 mt-4 border-t border-border">
                    <div className="text-sm text-muted-foreground mb-3 px-4">
                      Signed in as: {user.email}
                    </div>
                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="pt-4 mt-4 border-t border-border">
                    <Link to="/auth">
                      <Button
                        variant="default"
                        className="w-full justify-start"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="w-5 h-5 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;