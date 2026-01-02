"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/server/auth";
import { useTransition } from "react";

const ButtonLogout = () => {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <div className="flex items-center gap-2.5 justify-center cursor-pointer group">
      <button
        className={
          "w-10 h-10 group-hover:bg-primary-foreground group-hover:text-secondary flex justify-center items-center rounded-md bg-transparent transition-colors border-none outline-none disabled:opacity-50"
        }
        title="Logout"
        onClick={handleLogout}
        disabled={isPending}
      >
        <LogOut className="text-destructive w-5 h-5" />
      </button>
    </div>
  );
};

export default ButtonLogout;
