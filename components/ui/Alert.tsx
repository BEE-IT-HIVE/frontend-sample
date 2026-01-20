
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils";

const alertVariants = cva(
  "relative w-full rounded-2xl border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7 shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-top-2",
  {
    variants: {
      variant: {
        default: "bg-white text-hive-blue border-gray-200 dark:bg-white/5 dark:text-white dark:border-white/10",
        destructive:
          "border-red-500/50 text-red-600 dark:border-red-500 [&>svg]:text-red-600 bg-red-50 dark:bg-red-900/20",
        success: 
          "border-green-500/50 text-green-600 dark:border-green-500 [&>svg]:text-green-600 bg-green-50 dark:bg-green-900/20",
        warning: 
          "border-yellow-500/50 text-yellow-600 dark:border-yellow-500 [&>svg]:text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-bold leading-none tracking-tight font-heading", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs [&_p]:leading-relaxed font-sans", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
