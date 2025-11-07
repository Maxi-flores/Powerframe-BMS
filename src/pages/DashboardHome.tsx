// src/pages/DashboardHome.tsx
import AppLayout from "@/layouts/AppLayout";
import WidgetCalendar from "@/components/WidgetCalendar";
import WidgetRevenue from "@/components/WidgetRevenue";
import WidgetAnalytics from "@/components/WidgetAnalytics";
import WidgetTaskStatus from "@/components/WidgetTaskStatus";
import WidgetTimeline from "@/components/WidgetTimeline";

export default function DashboardHome() {
  return (
    <AppLayout>
      <DashboardLayoutHome
        widget1={<WidgetCalendar />}
        widget2={<WidgetRevenue />}
        widget3={<WidgetAnalytics />}
        widget4={<WidgetTaskStatus />}
        widget5={<WidgetTimeline />}
        // widget6–8: optional or empty
      />
    </AppLayout>
  );
}