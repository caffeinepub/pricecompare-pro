import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "@tanstack/react-router";
import { BarChart3, Search, ShieldCheck } from "lucide-react";

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export default function Navbar({
  searchQuery = "",
  onSearchChange,
}: NavbarProps) {
  const navigate = useNavigate();

  return (
    <header
      className="sticky top-0 z-50 border-b border-border shadow-xs"
      style={{ backgroundColor: "oklch(var(--navbar-bg))" }}
    >
      <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0"
          data-ocid="nav.link"
        >
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">
            PC
          </div>
          <span className="font-bold text-lg text-foreground hidden sm:block">
            PriceCompare
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1 ml-4">
          {["Deals", "Categories", "Popular", "About"].map((item) => (
            <Link
              key={item}
              to="/"
              className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
              data-ocid={`nav.${item.toLowerCase()}.link`}
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <div className="flex-1 max-w-xs ml-auto relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search electronics, fashion\u2026"
            className="pl-9 h-9 text-sm bg-white"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            data-ocid="nav.search_input"
          />
        </div>

        {/* Admin */}
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5"
          onClick={() => navigate({ to: "/admin" })}
          data-ocid="nav.admin.button"
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="hidden sm:inline">Admin Portal</span>
        </Button>

        <Link to="/" data-ocid="nav.results.link">
          <BarChart3 className="w-5 h-5 text-muted-foreground" />
        </Link>
      </div>
    </header>
  );
}
