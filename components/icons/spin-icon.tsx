import { cn } from "@/lib/utils";

export const SpinIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 36 36"
      className={cn("animate-spin", "w-6 h-6", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M34 18C34 21.1645 33.0616 24.2579 31.3035 26.8891C29.5454 29.5203 27.0466 31.5711 24.1229 32.7821C21.1993 33.9931 17.9823 34.3099 14.8786 33.6926C11.7749 33.0752 8.92393 31.5513 6.68629 29.3137C4.44865 27.0761 2.9248 24.2251 2.30744 21.1214C1.69007 18.0177 2.00693 14.8007 3.21793 11.8771C4.42893 8.95345 6.47969 6.45459 9.11088 4.69649C11.7421 2.93838 14.8355 2 18 2"
        stroke="#D0D5DD"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};
