import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { PropertySummary } from "./types";
import { Building2, Home } from "lucide-react";

export function PropertyOverview({
  properties,
}: {
  properties: PropertySummary[];
}) {
  const t = useTranslations("dashboard.propertyOverview");

  return (
    <Card className="col-span-1 lg:col-span-4">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {properties.map((property) => (
            <div
              key={property.id}
              className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-muted p-2 rounded-lg">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {property.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {property.address}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className="text-xs">
                    {property.occupiedRooms} {t("occupied")}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {property.totalRooms - property.occupiedRooms} {t("vacant")}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
