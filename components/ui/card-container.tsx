import { ComponentPropsWithoutRef, FC, ReactNode } from "react";

interface CardContainerProps extends ComponentPropsWithoutRef<"div"> {
  cardTitle?: ReactNode;
  subTitle?: ReactNode;
  actions?: ReactNode;
}

const CardContainer: FC<CardContainerProps> = ({
  cardTitle,
  actions,
  subTitle,
  children,
}) => {
  return (
    <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border">
      {/* Header */}
      <div className="flex flex-col items-start sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-1 bg-primary rounded-full" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">{cardTitle}</h2>
            <p className="text-sm text-muted-foreground">{subTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end flex-wrap">
          {actions}
        </div>
      </div>

      {children}
    </div>
  );
};

export default CardContainer;
