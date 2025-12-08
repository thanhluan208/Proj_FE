import { ComponentPropsWithoutRef, FC } from "react";
import { Button } from "./button";
import { SpinIcon } from "../icons";
import { useTranslations } from "next-intl";

interface ButtonSubmitProps
  extends Omit<ComponentPropsWithoutRef<"button">, "type"> {
  isPending?: boolean;
}

const ButtonSubmit: FC<ButtonSubmitProps> = ({
  disabled,
  isPending,
  ...props
}) => {
  const t = useTranslations("common");

  return (
    <Button disabled={isPending || disabled} type="submit" {...props}>
      {isPending ? <SpinIcon /> : t("submit")}
    </Button>
  );
};

export default ButtonSubmit;
