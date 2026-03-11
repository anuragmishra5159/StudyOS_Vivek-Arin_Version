import React, { useMemo } from "react";
import {
  Calendar,
  Calculator,
  StickyNote,
  PenTool,
  ListTodo,
  LogOut,
  NotebookPen,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useDashboardStore } from "../store/dashboardStore";

const Sidebar = ({ onMobileClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    if (onMobileClose) onMobileClose();
  };

  // --- Derive task stats from shared store ---
  const { totalTasks, completedTasks } = useDashboardStore();

  const taskPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const statusLabel = useMemo(() => {
    if (totalTasks === 0) return "No Tasks";
    if (taskPercent === 100) return "Complete!";
    if (taskPercent >= 80) return "On Track";
    if (taskPercent >= 60) return "Almost There";
    if (taskPercent >= 30) return "In Progress";
    if (taskPercent > 0) return "Getting Started";
    return "Not Started";
  }, [totalTasks, taskPercent]);

  // SVG ring calculations
  const circumference = 2 * Math.PI * 12; // r=12
  const dashOffset = circumference - (taskPercent / 100) * circumference;
  const ringColor =
    taskPercent === 0
      ? "#6B7280"
      : taskPercent < 30
        ? "#EF4444"
        : taskPercent < 60
          ? "#F59E0B"
          : taskPercent < 80
            ? "#3B82F6"
            : "#10B981";

  const handleLogout = () => {
    logout();
    navigate("/");
    if (onMobileClose) onMobileClose();
  };

  const navItems = [
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: Calculator, label: "Calculator", path: "/calculator" },
    { icon: StickyNote, label: "Sticky Notes", path: "/sticky-notes" },
    { icon: NotebookPen, label: "Notes", path: "/notes" },
    { icon: PenTool, label: "Drawing Pad", path: "/drawing-pad" },
    { icon: ListTodo, label: "Todo Lists", path: "/todos" },
  ];

  const currentPath = window.location.pathname;

  return (
    <aside className="w-64 md:w-20 md:hover:w-64 bg-surface h-full flex flex-col justify-between py-6 z-50 overflow-y-auto overflow-x-hidden custom-scrollbar shadow-card transition-all duration-300 ease-in-out group border-r border-border">
      {/* Logo Area */}
      <div className="flex flex-col gap-6 w-full px-4">
        <div
          onClick={() => handleNavigation("/dashboard")}
          className="flex items-center gap-4 cursor-pointer"
          title="Mantessa"
        >
          <img src="/logo.jpeg" alt="Mantessa" className="w-12 h-12 shrink-0 rounded-2xl object-contain hover:scale-105 transition-all duration-300 shadow-soft hover:shadow-card" />
          <span className="text-xl font-bold tracking-tight text-text-main opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Mantessa
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4 w-full mt-2">
          {navItems.map((item, index) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                title={item.label}
                className={
                  "relative w-full h-12 rounded-[14px] flex items-center gap-4 transition-all duration-300 " +
                  (isActive
                    ? "bg-background shadow-inner"
                    : "bg-surface shadow-soft hover:shadow-card")
                }
              >
                <div className="w-12 h-12 shrink-0 flex items-center justify-center">
                  <item.icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={
                      isActive
                        ? "text-primary"
                        : "text-text-muted hover:text-primary"
                    }
                  />
                </div>
                <span
                  className={
                    "text-sm font-medium whitespace-nowrap opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 " +
                    (isActive ? "text-primary" : "text-text-secondary")
                  }
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-r-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-5 w-full px-4 overflow-hidden">
        {/* Circular Daily Goal */}
        <div
          className="relative cursor-pointer w-full h-12 flex items-center bg-background rounded-[14px] shadow-inner hover:bg-surface-hover transition-colors duration-200"
          title={`Daily Goal: ${taskPercent}%`}
          onClick={() => handleNavigation("/todos")}
        >
          <div className="w-12 h-12 shrink-0 flex items-center justify-center relative">
            <svg width="32" height="32" className="rotate-[-90deg]">
              <circle
                cx="16"
                cy="16"
                r="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-white/10"
              />
              <circle
                cx="16"
                cy="16"
                r="12"
                fill="none"
                stroke={ringColor}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="drop-shadow-md transition-all duration-1000 ease-out"
              />
            </svg>
            <div
              className="absolute inset-0 flex items-center justify-center font-bold text-[8px] tracking-tighter"
              style={{ color: ringColor }}
            >
              {taskPercent}%
            </div>
          </div>
          <div className="flex flex-col items-start justify-center ml-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Daily Goal
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: ringColor }}
            >
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="w-full h-12 flex items-center gap-4 text-text-muted hover:text-red-500 bg-surface rounded-[14px] transition-all duration-300 shadow-soft hover:shadow-card"
        >
          <div className="w-12 h-12 shrink-0 flex items-center justify-center">
            <LogOut size={18} strokeWidth={2} />
          </div>
          <span className="text-sm font-medium whitespace-nowrap opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
