"use client";
import { useTranslations } from "next-intl";
import { ComponentPropsWithoutRef, FC } from "react";
import { Button } from "./button";

const ButtonCancel: FC<ComponentPropsWithoutRef<"button">> = (props) => {
  const t = useTranslations("common");

  return (
    <Button type="button" variant="outline" className="flex-1" {...props}>
      {t("cancel")}
    </Button>
  );
};

export default ButtonCancel;
