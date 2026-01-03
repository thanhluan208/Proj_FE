"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Send, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import {
  telegramAuthService,
  TelegramAuthData,
} from "@/services/telegram.service";
import toast from "react-hot-toast";
import { Profile } from "@/types/authentication.type";
import { useTranslations } from "next-intl";
import { LoginButton } from "@telegram-auth/react";

interface TelegramBindingProps {
  userData: Profile;
}

const TelegramBinding = ({ userData }: TelegramBindingProps) => {
  const t = useTranslations("profile.telegram");
  const [isLoading, setIsLoading] = useState(false);
  const [deepLink, setDeepLink] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<number | null>(null);

  const isTelegramConnected = !!userData.telegramId;
  const botAccessEnabled = userData.botAccessEnabled;

  const handleTelegramAuth = async (user: TelegramAuthData) => {
    setIsLoading(true);
    try {
      const response = await telegramAuthService.authenticateTelegram(user);

      setDeepLink(response.deepLink);
      setExpiresIn(response.expiresIn);

      toast.success(t("authSuccess"));
    } catch (error: any) {
      console.error("Telegram auth error:", error);
      toast.error(error.response?.data?.message || t("authError"));
    } finally {
      setIsLoading(false);
    }
  };

  const openDeepLink = () => {
    if (deepLink) {
      window.open(`https://${deepLink}`, "_blank");
    }
  };

  if (isTelegramConnected) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            <CardTitle>{t("title")}</CardTitle>
          </div>
          <CardDescription>{t("connectedDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="font-medium">{t("connectedStatus")}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {userData.telegramUsername ? (
                  <>
                    {t("username")}{" "}
                    <span className="font-mono">
                      @{userData.telegramUsername}
                    </span>
                  </>
                ) : (
                  <>
                    {t("telegramId")}{" "}
                    <span className="font-mono">{userData.telegramId}</span>
                  </>
                )}
              </div>
            </div>
            <Badge variant={botAccessEnabled ? "default" : "secondary"}>
              {botAccessEnabled ? t("botActive") : t("botInactive")}
            </Badge>
          </div>

          {!botAccessEnabled && (
            <Alert>
              <AlertDescription>
                {t.rich("activationRequired", {
                  code: (chunks) => (
                    <code className="px-1.5 py-0.5 bg-muted rounded">
                      {chunks}
                    </code>
                  ),
                  link: (chunks) => (
                    <a
                      href="https://t.me/valetum_bot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline underline-offset-4"
                    >
                      {chunks}
                    </a>
                  ),
                })}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Send className="h-5 w-5 text-primary" />
          <CardTitle>{t("title")}</CardTitle>
        </div>
        <CardDescription>{t("notConnectedDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!deepLink ? (
          <>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-muted-foreground">
                  {t("notConnectedStatus")}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {t("connectInstruction")}
              </p>
              <div className="flex justify-center py-2">
                <LoginButton
                  botUsername="valetum_bot"
                  onAuthCallback={handleTelegramAuth}
                  buttonSize="large"
                  cornerRadius={8}
                  requestAccess="write"
                  lang="en"
                />
              </div>
              {isLoading && (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                {t("authSuccessDesc")}
              </AlertDescription>
            </Alert>

            <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
              <div className="space-y-1">
                <p className="text-sm font-medium">{t("nextStep")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("nextStepDesc", {
                    time: Math.floor((expiresIn || 300) / 60),
                  })}
                </p>
              </div>

              <Button onClick={openDeepLink} className="w-full" size="lg">
                <ExternalLink className="mr-2 h-4 w-4" />
                {t("openBot")}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                {t("manualOpen")}{" "}
                <a
                  href={`https://${deepLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono underline underline-offset-4"
                >
                  {deepLink}
                </a>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TelegramBinding;
