import { cn } from "@/lib/utils";
import { Eye, EyeClosed, EyeOff } from "lucide-react";
import React, { ComponentPropsWithoutRef, useState } from "react";

interface BlurWrapperProps extends ComponentPropsWithoutRef<"div"> {
  defaultBlur?: boolean;
}

const BlurWrapper = ({
  defaultBlur,
  className,
  children,
}: BlurWrapperProps) => {
  const [shouldBlur, setShouldBlur] = useState(defaultBlur);

  return (
    <div className={cn("relative", className)}>
      <div className={cn("transition-all", shouldBlur && "blur-3xl")}>
        {children}
      </div>
      <button
        className="absolute right-0 top-0 cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShouldBlur((prev) => !prev);
        }}
      >
        {shouldBlur ? <EyeOff /> : <Eye />}
      </button>
    </div>
  );
};

export default BlurWrapper;
