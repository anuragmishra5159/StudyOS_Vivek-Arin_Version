import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import RightPanel from "../components/RightPanel";
import {
  Search,
  Bell,
  Clock,
  CheckCircle2,
  TrendingUp,
  Zap,
  Menu,
  X,
  Filter,
  Calendar,
  Play,
  Loader2,
  Sparkles,
  PanelRightOpen,
  PanelRightClose,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useFocusStore } from "../store/focusStore";
import { useNudgeStore } from "../store/nudgeStore";
import { useDashboardStore } from "../store/dashboardStore";
import { useLayoutStore } from "../store/layoutStore";


const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const { isRightPanelOpen: isRightPanelOpenDesktop, toggleRightPanel } = useLayoutStore();

  const {
    toggleOpen: toggleNudges,
    getCount: getNudgeCount,
    refresh: refreshNudges,
  } = useNudgeStore();
  const nudgeCount = getNudgeCount();

  const {
    isActive: focusIsActive,
    elapsed: focusElapsed,
    start: startFocus,
    hydrate,
  } = useFocusStore();

  // Shared dashboard store – single source of truth
  const {
    stats: dashStats,
    subjects,
    pendingTasks,
    totalTasks,
    upcomingEvents,
    weeklyActivity,
    loading,
    fetch: fetchDashboard,
    fetchIfStale,
  } = useDashboardStore();

  useEffect(() => {
    if (user) {
      fetchDashboard();   // always force-fetch on user change
      hydrate();
      refreshNudges();
    }
  }, [user]);

  // Re-fetch dashboard data when a focus session ends
  const prevFocusRef = useRef(focusIsActive);
  useEffect(() => {
    if (prevFocusRef.current && !focusIsActive && user) {
      fetchDashboard();
    }
    prevFocusRef.current = focusIsActive;
  }, [focusIsActive]);

  // Live study hours including the active session's elapsed time
  const liveStudyHours = focusIsActive
    ? parseFloat(((dashStats.studyHours || 0) + focusElapsed / 3600).toFixed(1))
    : dashStats.studyHours;

  const liveTodayHours = focusIsActive
    ? parseFloat(((dashStats.todayHours || 0) + focusElapsed / 3600).toFixed(1))
    : dashStats.todayHours;

  const handleStartSession = async () => {
    if (!focusIsActive) {
      await startFocus();
    }
  };

  return (
    <div className="min-h-screen bg-background flex font-sans text-text-main relative overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Wrapper */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar onMobileClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <main className={`flex-1 md:ml-20 main-content right-panel-transition p-4 md:p-8 overflow-y-auto overflow-x-hidden h-screen relative z-0 `}>
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          {/* Mobile Menu Button */}
          <div className="flex items-center justify-between w-full md:hidden mb-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 bg-surface rounded-xl text-text-secondary hover:text-primary transition-colors border border-border/50"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <img src="/logo.jpeg" alt="Mantessa" className="w-8 h-8 rounded-lg object-contain" />
              <span className="font-bold text-lg text-text-main">Mantessa</span>
            </div>
            <button
              onClick={() => setIsRightPanelOpen(true)}
              className="p-2 bg-surface rounded-xl text-text-secondary hover:text-primary transition-colors border border-border/50"
            >
              <Filter size={24} />
            </button>
          </div>

          <div className="relative w-full md:w-96 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search tasks, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-surface border border-transparent focus:bg-surface focus:border-primary/20 focus:ring-4 focus:ring-primary/5 rounded-2xl text-text-main shadow-card hover:shadow-soft transition-all outline-none placeholder:text-text-muted transition-all"
            />
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={toggleNudges}
              className="relative p-3 bg-surface rounded-xl text-text-secondary hover:text-primary hover:bg-white/5 hover:shadow-soft transition-all duration-200 border border-transparent hover:border-border/50"
            >
              <Sparkles size={22} />
              {nudgeCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold border-2 border-surface">
                  {nudgeCount > 9 ? "9+" : nudgeCount}
                </span>
              )}
            </button>

            <button
              onClick={toggleRightPanel}
              className="p-3 bg-surface rounded-xl text-text-secondary hover:text-primary hover:bg-white/5 hover:shadow-soft transition-all duration-200 border border-transparent hover:border-border/50"
              title={isRightPanelOpenDesktop ? "Close Right Panel" : "Open Right Panel"}
            >
              {isRightPanelOpenDesktop ? <PanelRightClose size={22} /> : <PanelRightOpen size={22} />}
            </button>

            <div className="flex items-center gap-4 pl-8 border-l border-border/60">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-bold text-text-main tracking-tight">
                  {user?.username || "Arin GUPTA"}
                </p>
                <p className="text-xs text-text-secondary font-medium">
                  Level 1 Scholar
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold text-lg shadow-inner cursor-pointer hover:scale-105 transition-transform">
                {user?.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" style={{ borderRadius: 'inherit' }} /> : (user?.username ? user.username[0].toUpperCase() : "A")}
              </div>
            </div>
          </div>
        </header>

        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-10 bg-primary/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-card border border-primary/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between group hover:shadow-float transition-all duration-500"
        >
          <div className="relative z-10 max-w-xl">
            <h1 className="text-2xl md:text-3xl font-bold text-text-main mb-3 tracking-tight">
              Hi {user?.username || "Arin"},{" "}
              <span className="text-text-secondary font-normal">
                ready to focus?
              </span>
            </h1>
            <p className="text-text-secondary leading-relaxed mb-8 text-base md:text-lg">
              You have{" "}
              <span className="font-bold text-primary">
                {pendingTasks} tasks
              </span>{" "}
              pending for today. Your productivity score is looking great!
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleStartSession}
                className="btn-primary flex items-center justify-center gap-2"
              >
                {focusIsActive ? (
                  <>
                    <Clock size={18} className="animate-pulse" /> Session Active
                  </>
                ) : (
                  <>
                    <Play size={18} /> Start Session
                  </>
                )}
              </button>
              <button
                onClick={() => navigate("/calendar")}
                className="bg-surface text-text-main border border-border px-6 py-3 sm:px-8 sm:py-3.5 rounded-2xl font-semibold shadow-soft hover:shadow-card transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Calendar size={18} /> View Calendar
              </button>
            </div>
          </div>


        </motion.div>

        {/* Stats Grid */}
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp size={20} className="text-primary" />
          <h3 className="text-lg font-bold text-text-main">Overview</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {[
            {
              label: "Study Hours",
              value: `${liveTodayHours}h`,
              icon: Clock,
              color: "text-blue-500",
              bg: "bg-blue-100",
              trend:
                liveStudyHours > 0
                  ? `${liveStudyHours}h total`
                  : "Start studying",
            },
            {
              label: "Tasks Done",
              value: `${dashStats.tasksDone}/${totalTasks || 0}`,
              icon: CheckCircle2,
              color: "text-primary",
              bg: "bg-primary-light",
              trend:
                pendingTasks > 0
                  ? `${pendingTasks} pending`
                  : "All done!",
            },
            {
              label: "Current Streak",
              value: `${dashStats.currentStreak} Days`,
              icon: Zap,
              color: "text-amber-500",
              bg: "bg-amber-100",
              trend:
                dashStats.currentStreak > 0
                  ? "Keep going!"
                  : "Start today",
            },
            {
              label: "Focus Score",
              value: dashStats.focusScore,
              icon: TrendingUp,
              color: "text-purple-500",
              bg: "bg-purple-100",
              trend: `${dashStats.focusScore} sessions`,
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card group"
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-3 rounded-xl ${stat.bg} ${stat.color} shadow-inner group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon size={24} strokeWidth={2.5} />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg shadow-inner text-primary bg-primary-light">
                  {stat.trend}
                </span>
              </div>
              <h4 className="text-2xl font-bold text-text-main mb-1 tracking-tight">
                {stat.value}
              </h4>
              <p className="text-sm text-text-secondary font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-text-main">
                  Today's Focus
                </h3>
                <button
                  onClick={() => navigate("/subjects")}
                  className="text-sm font-semibold text-primary hover:text-primary-dark hover:underline bg-primary/5 px-4 py-2 rounded-lg transition-colors"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subjects.map((subject, i) => (
                  <div
                    key={i}
                    onClick={() => navigate("/subjects")}
                    className="p-5 bg-surface rounded-2xl border border-border hover:shadow-card transition-all cursor-pointer group"
                  >
                    <div className="flex gap-4 mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-inner">
                        <span className="font-bold">
                          {subject.name.substring(0, 1)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-text-main group-hover:text-primary transition-colors line-clamp-1">
                          {subject.name}
                        </h4>
                        <p className="text-xs text-text-muted mt-0.5">
                          {subject.chapter} • {subject.tasksPending} Tasks
                          Pending
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-background rounded-full h-1.5 shadow-inner overflow-hidden">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{ width: `${subject.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                {subjects.length === 0 && (
                  <div className="col-span-2 text-center py-6 text-text-muted">
                    No focus subjects found for today.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Upcoming Events - real data */}
            <div className="card text-text-main relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-4">Upcoming Events</h3>
                {upcomingEvents &&
                upcomingEvents.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingEvents.map((event, i) => (
                      <div
                        key={event._id || i}
                        className="flex items-start gap-3 p-3 bg-background rounded-xl"
                      >
                        <div
                          className={`p-2 rounded-lg shrink-0 ${
                            event.type === "Quiz"
                              ? "bg-amber-100 text-amber-600"
                              : event.type === "Exam"
                                ? "bg-red-100 text-red-600"
                                : event.type === "Assignment"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          <Calendar size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-sm text-text-main truncate">
                            {event.title}
                          </h4>
                          <p className="text-xs text-text-muted mt-0.5">
                            {event.type} •{" "}
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                            {event.time && ` at ${event.time}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-muted py-4 text-center">
                    No upcoming events.{" "}
                    <button
                      onClick={() => navigate("/calendar")}
                      className="text-primary font-medium hover:underline"
                    >
                      Add one
                    </button>
                  </p>
                )}
              </div>
            </div>

            {/* Weekly Activity - real data */}
            <div className="card">
              <h3 className="font-bold text-text-main mb-4">Weekly Activity</h3>
              <div className="h-32 flex items-end justify-between gap-2 px-1">
                {(weeklyActivity &&
                weeklyActivity.length > 0
                  ? weeklyActivity
                  : [
                      { day: "Mon", percent: 0, minutes: 0 },
                      { day: "Tue", percent: 0, minutes: 0 },
                      { day: "Wed", percent: 0, minutes: 0 },
                      { day: "Thu", percent: 0, minutes: 0 },
                      { day: "Fri", percent: 0, minutes: 0 },
                      { day: "Sat", percent: 0, minutes: 0 },
                      { day: "Sun", percent: 0, minutes: 0 },
                    ]
                ).map((d, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div className="w-full bg-background shadow-inner rounded-t-sm relative group cursor-pointer h-24 flex items-end">
                      <div
                        className="w-full bg-primary rounded-t-sm transition-all duration-500 group-hover:bg-primary-dark min-h-[2px]"
                        style={{ height: `${Math.max(d.percent, 2)}%` }}
                      ></div>
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-surface text-text-main text-[10px] px-2 py-0.5 rounded shadow-soft transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {d.minutes}m
                      </div>
                    </div>
                    <span className="text-[10px] text-text-muted font-medium">
                      {d.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile RightPanel Overlay */}
      {isRightPanelOpen && (
        <div
          onClick={() => setIsRightPanelOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 xl:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Right Panel Wrapper */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-80 transform transition-transform duration-300 ease-in-out shrink-0 ${isRightPanelOpen ? "translate-x-0" : "translate-x-full"} ${isRightPanelOpenDesktop ? "xl:relative xl:transform-none xl:translate-x-0" : "xl:fixed xl:translate-x-full"}`}
      >
        <RightPanel onClose={() => setIsRightPanelOpen(false)} />
      </div>

    </div>
  );
};

export default Dashboard;
