import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { ActivityItem } from "./types";
import {
  Bell,
  CheckCircle2,
  Clock,
  FileText,
  AlertTriangle,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  const t = useTranslations("dashboard.activity");

  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "PAYMENT":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "NEW_CONTRACT":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "MAINTENANCE":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "EXPIRING_SOON":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("noActivity")}</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-center">
                <div className="mr-4 rounded-full border p-2 bg-muted/50">
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
                <div className="ml-auto text-xs text-muted-foreground">
                  {dayjs(activity.timestamp).fromNow()}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
