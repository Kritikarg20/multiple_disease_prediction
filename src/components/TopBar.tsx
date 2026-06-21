import React from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function TopBar() {
  const location = useLocation();

  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(Boolean);
    if (paths.length === 0) return <span className="text-[#6f7a73] font-medium text-xs">Dashboard</span>;
    return (
      <div className="flex items-center gap-1.5 text-xs text-[#6f7a73] font-medium">
        <Link to="/" className="hover:text-[#005039] transition-colors">Home</Link>
        {paths.map((p, i) => {
          const pathUrl = `/${paths.slice(0, i + 1).join("/")}`;
          const isLast = i === paths.length - 1;
          const formatted = p.charAt(0).toUpperCase() + p.slice(1).replace(/_/g, " ");
          return (
            <React.Fragment key={pathUrl}>
              <ChevronRight className="w-3 h-3 text-[#bec9c1]" />
              {isLast ? (
                <span className="text-[#1a1c1e] font-semibold">{formatted}</span>
              ) : (
                <Link to={pathUrl} className="hover:text-[#005039] transition-colors">{formatted}</Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const navLink = (to: string, label: string) => {
    const active = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
    return (
      <Link
        to={to}
        className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
          active
            ? "bg-[#9ef4cd]/40 text-[#005039]"
            : "text-[#3f4943] hover:text-[#1a1c1e] hover:bg-[#eeeef0]"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="fixed top-0 right-0 left-0 h-16 bg-[#ffffff] border-b border-[#bec9c1] flex justify-between items-center px-8 z-40 select-none shadow-sm">
      {/* Brand + Breadcrumbs */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#9ef4cd]/40 rounded-lg flex items-center justify-center border border-[#82d7b2]/40">
            <span className="material-symbols-outlined text-[#005039] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              ecg_heart
            </span>
          </div>
          <span className="font-bold text-base text-[#1a1c1e] tracking-tight">MediPredict AI</span>
        </Link>
        <div className="h-5 w-px bg-[#bec9c1]" />
        {getBreadcrumbs()}
      </div>

      {/* Nav */}
      <nav className="flex items-center gap-1">
        {navLink("/", "Dashboard")}
        {navLink("/predict", "New Prediction")}
        {navLink("/history", "History Log")}
      </nav>
    </header>
  );
}
