import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Inbox,
  FolderKanban,
  FileText,
  Users,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const DashboardLayout = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const navItems = [
    { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { label: "Inbox", path: "/dashboard/inbox", icon: Inbox },
    { label: "Projects", path: "/dashboard/projects", icon: FolderKanban },
    { label: "Blog & Updates", path: "/dashboard/blog", icon: FileText },
    { label: "Clients", path: "/dashboard/clients", icon: Users },
    { label: "Media Library", path: "/dashboard/media", icon: ImageIcon },
    { label: "Content Studio", path: "/dashboard/content", icon: FileText },
    { label: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col md:flex-row text-slate-200">
      {/* Mobile Top Header */}
      <div className="sticky top-0 z-40 md:hidden flex items-center justify-between px-4 py-3 bg-slate-950/95 shadow-lg border-b border-brand-border backdrop-blur-sm">
        <h1 className="font-bold text-sm text-white tracking-wider">
          KD STUDIOS ADMIN
        </h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-brand-border/50"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`
        fixed md:static inset-y-0 left-0 z-50 w-72 max-w-[86vw] bg-slate-950/95 shadow-2xl border-r border-brand-border flex flex-col justify-between transition-transform duration-200 ease-in-out backdrop-blur-sm
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div>
          <div className="flex items-center justify-between p-5 md:p-6 border-b border-brand-border">
            <h1 className="font-bold text-lg text-white tracking-wider">
              KD STUDIOS
            </h1>
            <span className="text-xs bg-brand-accent/10 text-brand-accent px-2 py-0.5 rounded font-mono">
              v1.0
            </span>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
                    ${
                      isActive
                        ? "bg-brand-accent/10 text-brand-accent border border-brand-accent/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-brand-border/40"
                    }
                  `}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-brand-border">
          <div className="mb-3 px-3">
            <p className="text-xs text-slate-500 font-medium">Logged in as</p>
            <p className="text-xs text-slate-300 font-semibold truncate">
              {currentUser?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 pb-24 sm:p-6 md:p-8 md:pb-8">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-brand-border bg-slate-950/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-2xl backdrop-blur md:hidden">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `flex min-w-0 flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-[10px] font-semibold transition ${
                  isActive
                    ? "text-brand-accent bg-brand-accent/10"
                    : "text-slate-500 hover:text-slate-200"
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="w-full truncate text-center">{item.label}</span>
            </NavLink>
          );
        })}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="flex min-w-0 flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-[10px] font-semibold text-slate-500 transition hover:text-slate-200"
        >
          <Menu className="h-5 w-5 shrink-0" />
          <span className="w-full truncate text-center">More</span>
        </button>
      </nav>
    </div>
  );
};

export default DashboardLayout;
