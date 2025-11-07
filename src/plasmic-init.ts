// src/plasmic-init.ts
import { initPlasmicLoader } from "@plasmicapp/loader-react";

// ── LAYOUTS & SHELLS ──────────────────────────────────────────────────
import DashboardLayout from "@/components/DashboardLayout";
import DashboardLayoutHome from "@/components/DashboardLayoutHome";
import DashboardLayoutCompanies from "@/components/DashboardLayoutCompanies";
import DashboardLayoutStartups from "@/components/DashboardLayoutStartups";
import DashboardLayoutTargets from "@/components/DashboardLayoutTargets";
import DashboardLayoutStocklist from "@/components/DashboardLayoutStocklist";
import DashboardLayoutPlanning from "@/components/DashboardLayoutPlanning";
import DashboardLayoutTasks from "@/components/DashboardLayoutTasks";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

// ── CORE UI COMPONENTS ────────────────────────────────────────────────
import Counter from "@/components/Counter";
import LoginForm from "@/components/LoginForm";
import LoginBackground from "@/components/LoginBackground";
import MovingLoginBackground from "@/components/MovingLoginBackground";
import LoginEntryBox from "@/components/LoginEntryBox";
import SocialLoginButton from "@/components/SocialLoginButton";

// ── METRIC CARDS ──────────────────────────────────────────────────────
import MetricCard from "@/components/MetricCard";
import BottomMetricCard from "@/components/BottomMetricCard";

// ── ANIMATED HERO ─────────────────────────────────────────────────────


// ── ORIGINAL DASHBOARD WIDGETS (8) ────────────────────────────────────
import WidgetCalendar from "@/components/WidgetCalendar";
import WidgetRevenue from "@/components/WidgetRevenue";
import WidgetAnalytics from "@/components/WidgetAnalytics";
import WidgetTaskStatus from "@/components/WidgetTaskStatus";
import WidgetTimeline from "@/components/WidgetTimeline";
import WidgetPendingTasks from "@/components/WidgetPendingTasks";
import WidgetActiveProjects from "@/components/WidgetActiveProjects";
import WidgetNewCustomers from "@/components/WidgetNewCustomers";

// ── NEW WIDGETS (6) – INTERACTIVE & DATA-DRIVEN ───────────────────────
import WidgetKanbanBoard from "@/components/WidgetKanbanBoard";
import WidgetMeetingsActivities from "@/components/WidgetMeetingsActivities";
import WidgetRecentLeads from "@/components/WidgetRecentLeads";
import WidgetProjectManagement from "@/components/WidgetProjectManagement";
import WidgetTaskList from "@/components/WidgetTaskList";
import WidgetNotifications from "@/components/WidgetNotifications";

// ── INITIALIZE PLASMIC LOADER ─────────────────────────────────────────
export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "dmLmwLa7oPVx57TJDP3Fhb",
      token: "mdmmlWL7aPoXf75JJTPTF3bx",
    },
  ],
  preview: true,
});

// ── HELPER: Register Slot-Based Layouts ───────────────────────────────
const registerLayout = (
  Component: React.ComponentType<any>,
  name: string,
  slots: Record<string, "slot">
) => {
  PLASMIC.registerComponent(Component, {
    name,
    props: slots,
  });
};

// ── HELPER: Register Simple Widget (no props) ─────────────────────────
const registerWidget = (Component: React.ComponentType<any>, name: string) => {
  PLASMIC.registerComponent(Component, { name, props: {} });
};

// ── REGISTER LAYOUTS ──────────────────────────────────────────────────
registerLayout(DashboardLayout, "DashboardLayout", {
  topMetric1: "slot",
  topMetric2: "slot",
  topMetric3: "slot",
  topMetric4: "slot",
  loginEntry: "slot",
  bottomMetric1: "slot",
  bottomMetric2: "slot",
  magicBento: "slot",
  halfLeft: "slot",
  halfRight: "slot",
  fullWidth2: "slot",
});

registerLayout(DashboardLayoutHome, "DashboardLayoutHome", {
  slot1: "slot",
  slot2: "slot",
  slot3: "slot",
  slot4: "slot",
  slot5: "slot",
  slot6: "slot",
  slot7: "slot",
  slot8: "slot",
  slot9: "slot",
});

registerLayout(DashboardLayoutCompanies, "DashboardLayoutCompanies", {
  widget9: "slot",
  widget10: "slot",
  widget11: "slot",
  widget12: "slot",
});

registerLayout(DashboardLayoutStartups, "DashboardLayoutStartups", {
  widget24: "slot",
  widget25: "slot",
});

registerLayout(DashboardLayoutTargets, "DashboardLayoutTargets", {
  widget35: "slot",
  widget36: "slot",
  widget37: "slot",
  widget38: "slot",
});

registerLayout(DashboardLayoutStocklist, "DashboardLayoutStocklist", {
  widget13: "slot",
  widget14: "slot",
  widget15: "slot",
  widget16: "slot",
  widget17: "slot",
  widget18: "slot",
  widget19: "slot",
  widget20: "slot",
});

registerLayout(DashboardLayoutPlanning, "DashboardLayoutPlanning", {
  widget21: "slot",
  widget22: "slot",
  widget23: "slot",
  widget24: "slot",
  widget25: "slot",
  widget26: "slot",
  widget27: "slot",
  widget28: "slot",
  widget29: "slot",
  widget30: "slot",
});

registerLayout(DashboardLayoutTasks, "DashboardLayoutTasks", {
  widget31: "slot",
  widget32: "slot",
  widget33: "slot",
  widget34: "slot",
});

// ── SHELL COMPONENTS ──────────────────────────────────────────────────
PLASMIC.registerComponent(Sidebar, { name: "Sidebar", props: {} });
PLASMIC.registerComponent(Header, {
  name: "Header",
  props: {
    pageName: "slot",
  },
});

// ── CORE UI COMPONENTS ────────────────────────────────────────────────
PLASMIC.registerComponent(Counter, {
  name: "Counter",
  props: {
    initialValue: { type: "number", defaultValue: 0 },
  },
});

PLASMIC.registerComponent(LoginForm, {
  name: "LoginForm",
  props: {
    buttonText: { type: "string", defaultValue: "Log in" },
    showSignup: { type: "boolean", defaultValue: true },
    onLogin: {
      type: "eventHandler",
      argTypes: [
        { name: "email", type: "string" },
        { name: "password", type: "string" },
      ],
    },
  },
});

PLASMIC.registerComponent(LoginBackground, {
  name: "LoginBackground",
  props: { children: "slot" },
});

PLASMIC.registerComponent(MovingLoginBackground, {
  name: "MovingLoginBackground",
  props: {
    hueShift: { type: "number", defaultValue: 0, min: -180, max: 180 },
    noiseIntensity: { type: "number", defaultValue: 0.05, min: 0, max: 0.2 },
    scanlineIntensity: { type: "number", defaultValue: 0.1, min: 0, max: 0.5 },
    speed: { type: "number", defaultValue: 0.5, min: 0.1, max: 2 },
    scanlineFrequency: { type: "number", defaultValue: 2, min: 0.5, max: 5 },
    warpAmount: { type: "number", defaultValue: 0.1, min: 0, max: 0.3 },
    resolutionScale: { type: "number", defaultValue: 1, min: 0.5, max: 2 },
  },
});

PLASMIC.registerComponent(LoginEntryBox, { name: "LoginEntryBox", props: {} });
PLASMIC.registerComponent(SocialLoginButton, {
  name: "SocialLoginButton",
  props: {
    provider: {
      type: "choice",
      options: ["google", "apple"],
      defaultValue: "google",
    },
  },
});

// ── METRIC CARDS ──────────────────────────────────────────────────────
PLASMIC.registerComponent(MetricCard, {
  name: "MetricCard",
  props: {
    title: { type: "string", defaultValue: "Metric" },
    value: { type: "string", defaultValue: "0" },
    change: { type: "string", defaultValue: "+10%" },
  },
});

PLASMIC.registerComponent(BottomMetricCard, {
  name: "BottomMetricCard",
  props: {
    label: { type: "string", defaultValue: "Label" },
    value: { type: "string", defaultValue: "Value" },
    icon: { type: "string", defaultValue: "icon" },
  },
});

// ── ANIMATED HERO: MagicBento ─────────────────────────────────────────
PLASMIC.registerComponent(MagicBento, {
  name: "MagicBento",
  props: {
    textAutoHide: { type: "boolean", defaultValue: true },
    enableStars: { type: "boolean", defaultValue: true },
    enableSpotlight: { type: "boolean", defaultValue: true },
    enableBorderGlow: { type: "boolean", defaultValue: true },
    enableTilt: { type: "boolean", defaultValue: true },
    enableMagnetism: { type: "boolean", defaultValue: true },
    clickEffect: { type: "boolean", defaultValue: true },
    spotlightRadius: { type: "number", defaultValue: 300, min: 100, max: 600 },
    particleCount: { type: "number", defaultValue: 12, min: 0, max: 30 },
    glowColor: { type: "string", defaultValue: "132, 0, 255" },
  },
});

// ── ORIGINAL WIDGETS (8) ──────────────────────────────────────────────
[
  WidgetCalendar,
  WidgetRevenue,
  WidgetAnalytics,
  WidgetTaskStatus,
  WidgetTimeline,
  WidgetPendingTasks,
  WidgetActiveProjects,
  WidgetNewCustomers,
].forEach((Component, i) => {
  const names = [
    "WidgetCalendar",
    "WidgetRevenue",
    "WidgetAnalytics",
    "WidgetTaskStatus",
    "WidgetTimeline",
    "WidgetPendingTasks",
    "WidgetActiveProjects",
    "WidgetNewCustomers",
  ];
  registerWidget(Component, names[i]);
});

// ── NEW WIDGETS (6) – DATA-DRIVEN & INTERACTIVE ───────────────────────
PLASMIC.registerComponent(WidgetKanbanBoard, {
  name: "WidgetKanbanBoard",
  props: {
    tasks: {
      type: "array",
      itemType: {
        type: "object",
        fields: {
          id: "number",
          title: "string",
          column: { type: "choice", options: ["To Do", "In Progress", "Done"] },
        },
      },
      defaultValue: [],
    },
  },
});

PLASMIC.registerComponent(WidgetMeetingsActivities, {
  name: "WidgetMeetingsActivities",
  props: {
    activities: {
      type: "array",
      itemType: {
        type: "object",
        fields: {
          time: "string",
          title: "string",
          type: { type: "choice", options: ["meeting", "call", "task"] },
        },
      },
      defaultValue: [],
    },
  },
});

PLASMIC.registerComponent(WidgetRecentLeads, {
  name: "WidgetRecentLeads",
  props: {
    leads: {
      type: "array",
      itemType: {
        type: "object",
        fields: {
          name: "string",
          company: "string",
          value: "string",
          status: { type: "choice", options: ["Hot", "Warm", "Cold"] },
        },
      },
      defaultValue: [],
    },
  },
});

PLASMIC.registerComponent(WidgetProjectManagement, {
  name: "WidgetProjectManagement",
  props: {
    projects: {
      type: "array",
      itemType: {
        type: "object",
        fields: {
          name: "string",
          progress: "number",
          team: "string",
        },
      },
      defaultValue: [],
    },
  },
});

PLASMIC.registerComponent(WidgetTaskList, {
  name: "WidgetTaskList",
  props: {
    tasks: {
      type: "array",
      itemType: {
        type: "object",
        fields: {
          id: "number",
          name: "string",
          due: "string",
          assigned: "string",
          status: "string",
          priority: { type: "choice", options: ["High", "Medium", "Low"] },
        },
      },
      defaultValue: [],
    },
    onCreateTask: {
      type: "eventHandler",
      argTypes: [],
    },
  },
});

PLASMIC.registerComponent(WidgetNotifications, {
  name: "WidgetNotifications",
  props: {
    notifications: {
      type: "array",
      itemType: {
        type: "object",
        fields: {
          message: "string",
          time: "string",
          read: "boolean",
        },
      },
      defaultValue: [],
    },
    onMarkAllRead: {
      type: "eventHandler",
      argTypes: [],
    },
  },
});