import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  Flame,
  Clock,
  Sparkles,
  Calendar,
  Play,
  Pause,
  RotateCcw,
  Check,
  TrendingUp,
  Award,
  Plus
} from 'lucide-react';

type ScreenTab = 'home' | 'tasks' | 'habits' | 'focus' | 'planner' | 'review';

export const InteractivePhoneShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ScreenTab>('home');

  // Interactive state inside the phone
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Finalize Room Database DAO', priority: 'HIGH', done: true, category: 'Work' },
    { id: 2, title: 'Distraction-free notification check', priority: 'HIGH', done: false, category: 'Engineering' },
    { id: 3, title: 'Evening daily review reflection', priority: 'MED', done: false, category: 'Routine' },
    { id: 4, title: 'Hydration & 30m brisk walk', priority: 'LOW', done: true, category: 'Health' }
  ]);

  const [habits, setHabits] = useState([
    { id: 1, name: 'Cold Shower & Breathwork', streak: 14, done: true, time: 'Morning' },
    { id: 2, name: '90m Unbroken Deep Work', streak: 21, done: true, time: 'Morning' },
    { id: 3, name: 'Zero Social Media Before 12', streak: 9, done: true, time: 'Afternoon' },
    { id: 4, name: 'Evening Daily Reflection', streak: 12, done: false, time: 'Evening' }
  ]);

  // Focus timer simulation
  const [timerSeconds, setTimerSeconds] = useState(1500); // 25:00
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerSeconds]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const toggleHabit = (id: number) => {
    setHabits(
      habits.map((h) =>
        h.id === id ? { ...h, done: !h.done, streak: !h.done ? h.streak + 1 : h.streak - 1 } : h
      )
    );
  };

  return (
    <section id="phone-showcase" className="py-24 border-t border-[#161A22] bg-[#07090C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-semibold text-[#00E5A3] uppercase tracking-wider mb-2">
            Native Experience
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            Everything you need. One place.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#94A3B8]">
            Interact directly with the simulated Zenin OS Android interface below.
          </p>

          {/* Screen Tab Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-[#0D0F12] border border-[#222A38] max-w-xl mx-auto">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'home'
                  ? 'bg-[#00E5A3] text-[#07090C] shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'tasks'
                  ? 'bg-[#00E5A3] text-[#07090C] shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setActiveTab('habits')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'habits'
                  ? 'bg-[#00E5A3] text-[#07090C] shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Habits
            </button>
            <button
              onClick={() => setActiveTab('focus')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'focus'
                  ? 'bg-[#00E5A3] text-[#07090C] shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Focus
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1 ${
                activeTab === 'planner'
                  ? 'bg-[#00E5A3] text-[#07090C] shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>AI Planner</span>
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'review'
                  ? 'bg-[#00E5A3] text-[#07090C] shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Review
            </button>
          </div>
        </div>

        {/* Large Central Phone Display */}
        <div className="flex justify-center">
          <div className="w-full max-w-[380px] sm:max-w-[420px] rounded-[48px] p-3.5 bg-gradient-to-b from-[#2A3445] via-[#161A22] to-[#0A0C0F] border border-[#334155] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.95)]">
            {/* Phone Bezel Interior */}
            <div className="relative rounded-[40px] bg-[#0D0F12] border border-[#1E232E] overflow-hidden flex flex-col h-[680px] select-none text-white">
              {/* Android Dynamic Island / Notch */}
              <div className="pt-3 px-6 pb-2 flex items-center justify-between text-[11px] text-[#94A3B8] font-mono tracking-tight bg-[#0D0F12] shrink-0 border-b border-[#1A202C]/60">
                <span>09:41</span>
                {/* Speaker Hole */}
                <div className="w-20 h-4 bg-[#07090C] rounded-full border border-[#1E232E] flex items-center justify-center space-x-1.5">
                  <div className="w-8 h-1 bg-[#1A202C] rounded-full" />
                  <div className="w-2 h-2 rounded-full bg-[#131720]" />
                </div>
                <div className="flex items-center space-x-1.5">
                  <span>LTE</span>
                  <div className="w-4 h-2 rounded-xs border border-[#94A3B8] p-0.5 flex items-center">
                    <div className="w-full h-full bg-[#00E5A3]" />
                  </div>
                </div>
              </div>

              {/* Screen Top Bar */}
              <div className="px-5 py-3 border-b border-[#1E232E] flex items-center justify-between bg-[#11141B] shrink-0">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#00E5A3]" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                    {activeTab === 'home' && 'Dashboard'}
                    {activeTab === 'tasks' && 'Daily Tasks'}
                    {activeTab === 'habits' && 'Habit Streaks'}
                    {activeTab === 'focus' && 'Focus Chamber'}
                    {activeTab === 'planner' && 'Gemini Day Plan'}
                    {activeTab === 'review' && 'Daily Review'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#00E5A3] bg-[#00E5A3]/10 px-2 py-0.5 rounded border border-[#00E5A3]/20">
                  v1.0.0
                </span>
              </div>

              {/* Screen Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-none bg-[#0D0F12]">
                {/* 1. HOME SCREEN */}
                {activeTab === 'home' && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    {/* Welcome & Score Box */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#161A22] to-[#1E232E] border border-[#262C3A] flex items-center justify-between">
                      <div>
                        <div className="text-xs text-[#94A3B8]">Today's Trajectory</div>
                        <div className="text-lg font-bold text-white">High Discipline</div>
                        <div className="text-[11px] text-[#00E5A3] mt-0.5">+14% vs 7-day average</div>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-[#07090C] border border-[#00E5A3]/40 flex flex-col items-center justify-center">
                        <span className="text-base font-mono font-bold text-[#00E5A3]">88</span>
                        <span className="text-[9px] text-[#64748B] uppercase">Score</span>
                      </div>
                    </div>

                    {/* AI Planner Banner */}
                    <div
                      onClick={() => setActiveTab('planner')}
                      className="p-3 rounded-2xl bg-[#00E5A3]/10 border border-[#00E5A3]/30 flex items-center justify-between cursor-pointer hover:bg-[#00E5A3]/15 transition-colors"
                    >
                      <div className="flex items-center space-x-2.5">
                        <Sparkles className="w-4 h-4 text-[#00E5A3]" />
                        <div>
                          <div className="text-xs font-bold text-white">AI Day Schedule Available</div>
                          <div className="text-[10px] text-[#94A3B8]">Tap to view energy-aligned plan</div>
                        </div>
                      </div>
                      <span className="text-xs text-[#00E5A3]">→</span>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 rounded-xl bg-[#131720] border border-[#222A38]">
                        <div className="text-[10px] text-[#64748B]">FOCUS MINUTES</div>
                        <div className="text-base font-bold font-mono text-white mt-0.5">85m</div>
                        <div className="text-[10px] text-[#00E5A3]">3 sessions today</div>
                      </div>
                      <div className="p-3 rounded-xl bg-[#131720] border border-[#222A38]">
                        <div className="text-[10px] text-[#64748B]">HABIT CONSISTENCY</div>
                        <div className="text-base font-bold font-mono text-[#FF6D00] mt-0.5 flex items-center space-x-1">
                          <Flame className="w-3.5 h-3.5 fill-[#FF6D00]" />
                          <span>14 Days</span>
                        </div>
                        <div className="text-[10px] text-[#94A3B8]">3 of 4 checked</div>
                      </div>
                    </div>

                    {/* Today's Priority List in Home */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                        <span>Today's Critical Tasks</span>
                        <span
                          onClick={() => setActiveTab('tasks')}
                          className="text-[#00E5A3] cursor-pointer hover:underline"
                        >
                          View All
                        </span>
                      </div>
                      {tasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          onClick={() => toggleTask(task.id)}
                          className="p-2.5 rounded-xl bg-[#131720] border border-[#222A38] flex items-center justify-between text-xs cursor-pointer hover:border-[#00E5A3]/30"
                        >
                          <div className="flex items-center space-x-2.5">
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                                task.done ? 'bg-[#00E5A3] text-[#07090C]' : 'border border-[#475569]'
                              }`}
                            >
                              {task.done && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className={task.done ? 'line-through text-[#64748B]' : 'text-slate-200'}>
                              {task.title}
                            </span>
                          </div>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              task.priority === 'HIGH' ? 'bg-[#FF5252]/10 text-[#FF5252]' : 'bg-[#FFB100]/10 text-[#FFB100]'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. TASKS SCREEN */}
                {activeTab === 'tasks' && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-[#94A3B8]">
                        Tap to toggle completion · Room SQLite
                      </div>
                      <span className="text-[10px] font-bold text-[#00E5A3] bg-[#00E5A3]/10 px-2 py-0.5 rounded">
                        {tasks.filter((t) => t.done).length} / {tasks.length} Done
                      </span>
                    </div>

                    <div className="space-y-2">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => toggleTask(task.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                            task.done
                              ? 'bg-[#10141B] border-[#1E232E] opacity-75'
                              : 'bg-[#131720] border-[#222A38] hover:border-[#00E5A3]/40'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                                task.done
                                  ? 'bg-[#00E5A3] text-[#07090C]'
                                  : 'border border-[#475569] text-transparent hover:border-[#00E5A3]'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                            <div>
                              <div
                                className={`font-medium ${
                                  task.done ? 'line-through text-[#64748B]' : 'text-white'
                                }`}
                              >
                                {task.title}
                              </div>
                              <div className="text-[10px] text-[#64748B]">{task.category}</div>
                            </div>
                          </div>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              task.priority === 'HIGH'
                                ? 'bg-[#FF5252]/15 text-[#FF5252]'
                                : task.priority === 'MED'
                                ? 'bg-[#FFB100]/15 text-[#FFB100]'
                                : 'bg-[#448AFF]/15 text-[#448AFF]'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Quick Add Demo Banner */}
                    <div className="p-3 rounded-xl border border-dashed border-[#262C3A] text-center text-xs text-[#94A3B8] hover:border-[#00E5A3] cursor-pointer flex items-center justify-center space-x-1.5">
                      <Plus className="w-3.5 h-3.5 text-[#00E5A3]" />
                      <span>Quick Add Task to Room DB</span>
                    </div>
                  </div>
                )}

                {/* 3. HABITS SCREEN */}
                {activeTab === 'habits' && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                      <span>Daily Streaks</span>
                      <span className="text-[#FF6D00] font-bold flex items-center space-x-1">
                        <Flame className="w-3.5 h-3.5 fill-[#FF6D00]" />
                        <span>Active Streaks</span>
                      </span>
                    </div>

                    <div className="space-y-2">
                      {habits.map((habit) => (
                        <div
                          key={habit.id}
                          onClick={() => toggleHabit(habit.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                            habit.done
                              ? 'bg-[#131720] border-[#FF6D00]/40 shadow-[0_0_15px_rgba(255,109,0,0.06)]'
                              : 'bg-[#10141B] border-[#1E232E]'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                                habit.done
                                  ? 'bg-[#FF6D00] text-black font-bold'
                                  : 'border border-[#334155] text-transparent hover:border-[#FF6D00]'
                              }`}
                            >
                              <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                            <div>
                              <div className="font-semibold text-white">{habit.name}</div>
                              <div className="text-[10px] text-[#64748B]">{habit.time} routine</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-mono font-bold text-[#FF6D00] flex items-center space-x-1">
                              <Flame className="w-3 h-3 fill-[#FF6D00]" />
                              <span>{habit.streak}d</span>
                            </div>
                            <div className="text-[9px] text-[#64748B]">
                              {habit.done ? 'Checked' : 'Pending'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. FOCUS SCREEN */}
                {activeTab === 'focus' && (
                  <div className="space-y-5 py-4 text-center animate-in fade-in duration-200">
                    <div className="text-xs text-[#94A3B8]">Offline Focus Chamber</div>

                    {/* Circular Timer Visual */}
                    <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-4 border-[#1E232E]" />
                      <div
                        className={`absolute inset-0 rounded-full border-4 border-[#00E5A3] transition-all duration-1000 ${
                          timerRunning ? 'border-t-transparent animate-spin' : ''
                        }`}
                      />
                      <div className="relative z-10">
                        <div className="text-4xl font-mono font-bold text-white tracking-wider">
                          {formatTimer(timerSeconds)}
                        </div>
                        <div className="text-[10px] text-[#00E5A3] mt-1 font-semibold uppercase tracking-wider">
                          {timerRunning ? 'Deep Focus Active' : 'Ready'}
                        </div>
                      </div>
                    </div>

                    {/* Session Controls */}
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => setTimerRunning(!timerRunning)}
                        className="px-6 py-2.5 rounded-xl bg-[#00E5A3] text-[#07090C] font-bold text-xs flex items-center space-x-1.5 shadow-[0_0_20px_rgba(0,229,163,0.3)] active:scale-95 transition-transform"
                      >
                        {timerRunning ? (
                          <>
                            <Pause className="w-4 h-4 fill-current" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-current" />
                            <span>Start Focus</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setTimerRunning(false);
                          setTimerSeconds(1500);
                        }}
                        className="p-2.5 rounded-xl border border-[#222A38] bg-[#131720] text-[#94A3B8] hover:text-white"
                        title="Reset 25m"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Target Anchor Task */}
                    <div className="p-3 rounded-xl bg-[#131720] border border-[#222A38] text-xs text-left">
                      <span className="text-[10px] text-[#64748B] uppercase font-bold">Target Task</span>
                      <div className="text-white font-medium mt-0.5">
                        Distraction-free notification check
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. AI PLANNER SCREEN */}
                {activeTab === 'planner' && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-[#00E5A3]/15 to-[#38BDF8]/10 border border-[#00E5A3]/30">
                      <div className="flex items-center space-x-2 text-xs font-bold text-[#00E5A3]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Intelligent Schedule Generated</span>
                      </div>
                      <div className="text-[10px] text-[#94A3B8] mt-0.5">
                        Context: 4 tasks, 2 active habits, peak energy morning
                      </div>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      <div className="p-2.5 rounded-xl bg-[#131720] border border-[#222A38] flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-[#00E5A3]">08:00 – 09:30 · 90m</div>
                          <div className="font-sans font-semibold text-white">Deep Work (Core Coding)</div>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 bg-[#00E5A3]/10 text-[#00E5A3] rounded">
                          FOCUS
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#131720] border border-[#222A38] flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-[#94A3B8]">09:30 – 10:00 · 30m</div>
                          <div className="font-sans font-semibold text-slate-300">Break &amp; Hydration</div>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 bg-[#475569]/20 text-[#94A3B8] rounded">
                          REST
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#131720] border border-[#222A38] flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-[#38BDF8]">10:00 – 12:30 · 150m</div>
                          <div className="font-sans font-semibold text-white">Priority Sprint Task</div>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 bg-[#38BDF8]/15 text-[#38BDF8] rounded">
                          SPRINT
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#131720] border border-[#222A38] flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-[#FF6D00]">16:00 – 17:00 · 60m</div>
                          <div className="font-sans font-semibold text-white">Habit &amp; Fitness Routine</div>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 bg-[#FF6D00]/15 text-[#FF6D00] rounded">
                          HABIT
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. DAILY REVIEW SCREEN */}
                {activeTab === 'review' && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="p-3.5 rounded-xl bg-[#131720] border border-[#222A38] space-y-2">
                      <div className="text-xs font-bold text-white">Evening Debrief</div>
                      <div className="text-[11px] text-[#94A3B8]">
                        "Discipline is the bridge between goals and accomplishment."
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-[#10141B] border border-[#1E232E] space-y-1.5">
                        <div className="flex justify-between text-[#94A3B8]">
                          <span>Focus Quality</span>
                          <span className="text-[#00E5A3] font-bold">5 / 5 (Flow State)</span>
                        </div>
                        <div className="w-full bg-[#161A22] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#00E5A3] h-full w-[100%]" />
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#10141B] border border-[#1E232E] space-y-1.5">
                        <div className="flex justify-between text-[#94A3B8]">
                          <span>Daily Habit Execution</span>
                          <span className="text-[#FF6D00] font-bold">75% (3/4)</span>
                        </div>
                        <div className="w-full bg-[#161A22] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#FF6D00] h-full w-[75%]" />
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#10141B] border border-[#1E232E] space-y-1">
                        <div className="text-[10px] text-[#64748B] uppercase font-bold">Today's Big Win</div>
                        <div className="text-slate-200 text-[11px]">
                          Finished the entire core database logic without checking notifications.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Phone Bottom Navigation Bar */}
              <div className="px-5 py-3 border-t border-[#1E232E] bg-[#0A0C0F] shrink-0 grid grid-cols-5 text-center text-[10px] text-[#64748B]">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`flex flex-col items-center space-y-0.5 ${
                    activeTab === 'home' ? 'text-[#00E5A3] font-bold' : 'hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Home</span>
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`flex flex-col items-center space-y-0.5 ${
                    activeTab === 'tasks' ? 'text-[#00E5A3] font-bold' : 'hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tasks</span>
                </button>
                <button
                  onClick={() => setActiveTab('habits')}
                  className={`flex flex-col items-center space-y-0.5 ${
                    activeTab === 'habits' ? 'text-[#00E5A3] font-bold' : 'hover:text-white'
                  }`}
                >
                  <Flame className="w-4 h-4" />
                  <span>Habits</span>
                </button>
                <button
                  onClick={() => setActiveTab('focus')}
                  className={`flex flex-col items-center space-y-0.5 ${
                    activeTab === 'focus' ? 'text-[#00E5A3] font-bold' : 'hover:text-white'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Focus</span>
                </button>
                <button
                  onClick={() => setActiveTab('planner')}
                  className={`flex flex-col items-center space-y-0.5 ${
                    activeTab === 'planner' ? 'text-[#00E5A3] font-bold' : 'hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
