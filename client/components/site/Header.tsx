import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ShoppingBag, Search, X } from "lucide-react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "@/store/cart";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/collections", label: "Collections" },
  { to: "/about", label: "About" },
  { to: "/profile", label: "Profile" },
];

export default function Header() {
  const { items } = useCart();
  const count = items.reduce((acc, item) => acc + item.qty, 0);
  const [open, setOpen] = useState(false);
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    // Close search on route change away from home if desired
    // keep open state; no-op
  }, [location.pathname]);

  const q = params.get("q") || "";
  const onChange = (v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set("q", v);
    else next.delete("q");
    setParams(next, { replace: true });
    if (location.pathname !== "/") navigate(`/?${next.toString()}#featured`);
  };

  const clearSearch = () => {
    const next = new URLSearchParams(params);
    next.delete("q");
    setParams(next, { replace: true });
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F09934d5abe324b818cbf63255928be0d%2F5d5991ddb68946ae9c74552973c4c751?format=webp&width=160"
            alt="Sneakers logo"
            className="h-8 w-8 rounded object-cover"
          />
          <span className="heading-display text-xl font-semibold tracking-tight">Sneakers</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"}`
              }
              end
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {!open ? (
            <button onClick={() => setOpen(true)} aria-label="Search" className="p-2 rounded-full hover:bg-muted text-foreground/80">
              <Search className="h-5 w-5" />
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-md border bg-white px-2 py-1.5 shadow-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                ref={inputRef}
                defaultValue={q}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search shoes..."
                className="h-7 w-48 sm:w-64 focus:outline-none"
              />
              <button aria-label="Close" onClick={clearSearch} className="rounded p-1 text-muted-foreground hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <Link to="/cart" aria-label="Cart" className="relative p-2 rounded-full hover:bg-muted text-foreground/80">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">{count}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
