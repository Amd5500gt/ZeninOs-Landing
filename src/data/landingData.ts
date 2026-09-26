export const APK_DOWNLOAD_URL = "/assets/zenin-os-v1.0.0.apk";
export const APK_FILE_NAME = "zenin-os-v1.0.0.apk";
export const RAZORPAY_PRO_URL = "https://rzp.io/rzp/Ic78CbB";

export interface FeatureItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  tag: string;
  highlight: string;
}

export const CORE_PILLARS = [
  {
    step: "01",
    tag: "PLAN",
    title: "Know what matters today.",
    description: "Prioritize what genuinely drives your goals. Categorize by urgency and energy so you stop reacting to chaos and execute with clarity.",
    details: ["Priority matrices (P1, P2, P3)", "Categorized workflows", "Zero-clutter interface"]
  },
  {
    step: "02",
    tag: "FOCUS",
    title: "Protect your attention.",
    description: "Deep work sessions with custom durations, audible cues, and full distraction defense. Keep your attention locked on the single task that moves the needle.",
    details: ["25/45m Pomodoro & Deep Work", "Session analytics & logging", "Full offline focus mode"]
  },
  {
    step: "03",
    tag: "BUILD",
    title: "Create habits that compound.",
    description: "Discipline is formed through atomic consistency. Track active streaks, daily review reflections, and a quantified productivity score.",
    details: ["Streak persistence tracking", "Daily evening review loop", "Real-time 0–100 discipline score"]
  }
];

export const FEATURES: FeatureItem[] = [
  {
    id: "tasks",
    title: "Tasks",
    subtitle: "Organize what needs to get done.",
    description: "Structured task tracking with High, Medium, and Low priorities. Archive completed items, filter by project, and eliminate mental load.",
    iconName: "CheckCircle2",
    tag: "P1 / P2 / P3",
    highlight: "Room SQLite offline persistence"
  },
  {
    id: "habits",
    title: "Habits",
    subtitle: "Build consistency through streaks and routines.",
    description: "Track morning, afternoon, and evening habits. Watch your streak flame grow with uninterrupted daily completion records.",
    iconName: "Flame",
    tag: "Daily Streaks",
    highlight: "Visual streak accountability"
  },
  {
    id: "focus",
    title: "Focus Timer",
    subtitle: "Work deeply without constant distractions.",
    description: "Custom session durations with dedicated task anchoring. Log completed focus minutes directly into your productivity insights.",
    iconName: "Clock",
    tag: "Deep Work",
    highlight: "Distraction-free timer"
  },
  {
    id: "notifications",
    title: "Notifications",
    subtitle: "Get reminders when your system needs you.",
    description: "Scheduled exact alarms powered by Android AlarmManager. Receive timely habit nudges and morning agenda alerts without background battery drain.",
    iconName: "Bell",
    tag: "Exact Alarms",
    highlight: "Battery-efficient system alarms"
  },
  {
    id: "review",
    title: "Daily Review",
    subtitle: "Reflect on what you accomplished.",
    description: "End each evening with an honest reflection. Rate your focus, journal key wins, and calibrate tomorrow's expectations.",
    iconName: "Calendar",
    tag: "Evening Loop",
    highlight: "Structured daily debrief"
  },
  {
    id: "score",
    title: "Productivity Score",
    subtitle: "Understand your consistency over time.",
    description: "A calculated 0–100 score weighing completed priorities, focus minutes logged, and habit adherence. Objective truth, not guesswork.",
    iconName: "TrendingUp",
    tag: "0–100 Index",
    highlight: "Holistic discipline metric"
  },
  {
    id: "planner",
    title: "AI Day Planner",
    subtitle: "Turn your responsibilities into an intelligent daily schedule.",
    description: "Combines your active tasks, habits, and time availability into a structured timeline tailored to your peak energy curve.",
    iconName: "Sparkles",
    tag: "Intelligent Schedule",
    highlight: "Contextual advisory scheduling"
  }
];

export const SCHEDULE_BLOCKS = [
  { time: "08:00", title: "Deep Work", category: "Core Focus", type: "focus", duration: "90 min", note: "Architecture review & high-priority deliverables" },
  { time: "09:30", title: "Break", category: "Recovery", type: "break", duration: "30 min", note: "Hydration, light movement, offline reset" },
  { time: "10:00", title: "Priority Task", category: "Execution", type: "task", duration: "150 min", note: "Complete sprint milestones with zero tabs open" },
  { time: "12:30", title: "Lunch", category: "Nutrition", type: "break", duration: "90 min", note: "Mindful break & away-from-screen rest" },
  { time: "14:00", title: "Focus Session", category: "Deep Focus", type: "focus", duration: "120 min", note: "Problem solving, technical analysis, documentation" },
  { time: "16:00", title: "Habit", category: "Discipline", type: "habit", duration: "60 min", note: "Physical movement, reading, and routine checkout" },
  { time: "18:00", title: "Daily Review", category: "Reflection", type: "review", duration: "30 min", note: "Log discipline score, evaluate accomplishments, wind down" }
];

export const FAQS = [
  {
    q: "What is Zenin OS?",
    a: "Zenin OS is a native Android productivity operating system designed for disciplined people. Unlike fragmented to-do apps, it unifies task prioritization, atomic habit streaks, deep work focus timers, daily evening reviews, and an intelligent AI Day Planner into one offline-first system."
  },
  {
    q: "Is Zenin OS free?",
    a: "Yes. Zenin OS offers a robust Free tier that includes core task management, habit tracking, deep focus timers, Room SQLite persistence, and scheduled notifications. An optional one-time Pro upgrade (₹79 Lifetime) unlocks the AI Day Planner and advanced analytics."
  },
  {
    q: "How do I download Zenin OS?",
    a: "Simply click any 'Download Zenin OS' or 'Download APK' button on this page. The official Android APK package downloads directly to your device. Once downloaded, tap the APK in your notifications or Downloads folder to install. (Ensure 'Install from unknown sources' is enabled in your Android settings)."
  },
  {
    q: "What is AI Day Planner?",
    a: "AI Day Planner is an intelligent scheduling capability in Zenin OS Pro. It evaluates your pending tasks, active habits, and target work hours to generate an optimized, energy-aligned timeblock schedule for your day."
  },
  {
    q: "How much does Pro cost?",
    a: "Zenin OS Pro is available for a one-time payment of ₹79 with lifetime access. There are no subscriptions, recurring charges, or annual renewals."
  },
  {
    q: "How does the ₹79 payment work?",
    a: "Payments are processed securely through Razorpay using UPI (Google Pay, PhonePe, Paytm), debit/credit cards, or net banking. Upon successful completion, your account is immediately upgraded with lifetime Pro status."
  },
  {
    q: "Does AI automatically modify my tasks?",
    a: "No. All AI Day Planner recommendations are strictly advisory and user-controlled. You retain 100% control over your schedule, tasks, and priorities. Nothing in your database is altered without your explicit approval."
  },
  {
    q: "Is Zenin OS available on Android?",
    a: "Yes. Zenin OS is built specifically for Android (API 26+ / Android 8.0 and above, fully tested through Android 14). It leverages native Java, Material Design, and Room SQLite for instant, battery-efficient performance."
  }
];

export const PRODUCT_PILLARS = [
  {
    title: "100% Offline-First",
    description: "Built on Android Room SQLite. Your tasks, habits, and reflections reside locally on your device with zero cloud dependency.",
    iconName: "ShieldCheck"
  },
  {
    title: "Zero Ads. Zero Trackers.",
    description: "No advertising SDKs, no behavioral telemetry, and no data harvesting. Your focus remains entirely your own.",
    iconName: "Shield"
  },
  {
    title: "Battery & Performance Tuned",
    description: "Native Java implementation with Android Jetpack MVVM. No heavy web wrappers or battery-draining background loops.",
    iconName: "Zap"
  },
  {
    title: "Exact Alarms via AlarmManager",
    description: "Reliable system alarms wake your device only when a focus session ends or a habit reminder is scheduled.",
    iconName: "Bell"
  }
];
