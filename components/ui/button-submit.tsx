import { ComponentPropsWithoutRef, FC } from "react";
import { Button } from "./button";
import { SpinIcon } from "../icons";
import { useTranslations } from "next-intl";

interface ButtonSubmitProps
  extends Omit<ComponentPropsWithoutRef<"button">, "type"> {
  isPending?: boolean;
  isEdit?: boolean;
}

const ButtonSubmit: FC<ButtonSubmitProps> = ({
  disabled,
  isPending,
  isEdit,
  ...props
}) => {
  const t = useTranslations("common");

  return (
    <Button disabled={isPending || disabled} type="submit" {...props}>
      {isPending ? <SpinIcon /> : t(isEdit ? "save" : "submit")}
    </Button>
  );
};

export default ButtonSubmit;
