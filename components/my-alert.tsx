import * as React from "react"; 
import { 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  Loader2, 
  TriangleAlert, 
} from "lucide-react"; 
import { cn } from "@/lib/utils"; 
 
type AlertVariant = "default" | "warning" | "error" | "success" | "loading"; 
 
interface MyAlertProps extends Omit<React.ComponentProps<"div">, "title"> { 
  /** 
   * Controls the visual state of the alert. 
   * @default "default" 
   */ 
  variant?: AlertVariant; 
 
  /** 
   * Alert title. 
   */ 
  title?: React.ReactNode; 
 
  /** 
   * Alert description/content. 
   */ 
  description?: React.ReactNode; 
 
  /** 
   * Optional custom icon. 
   * If omitted, an icon is automatically selected based on the variant. 
   */ 
  icon?: React.ReactNode; 
 
  /** 
   * Optional action element. 
   * Example: <Button>Fix</Button> 
   */ 
  action?: React.ReactNode; 
 
  /** 
   * Additional classes for the title. 
   */ 
  titleClassName?: string; 
 
  /** 
   * Additional classes for the description. 
   */ 
  descriptionClassName?: string; 
 
  /** 
   * Additional classes for the action container. 
   */ 
  actionClassName?: string; 
 
  /** 
   * Additional classes for the icon. 
   */ 
  iconClassName?: string; 
} 
 
const variantStyles: Record< 
  AlertVariant, 
  { 
    container: string; 
    title: string; 
    description: string; 
    icon: string; 
  } 
> = { 
  default: { 
    container: "border-border bg-card text-card-foreground hover:bg-muted/50", 
    title: "text-card-foreground", 
    description: "text-muted-foreground", 
    icon: "text-muted-foreground", 
  }, 
 
  warning: { 
    container: 
      "border-amber-500/30 bg-amber-500/10 text-amber-950 hover:bg-amber-500/15 dark:text-amber-100 dark:hover:bg-amber-500/15", 
    title: "text-amber-950 dark:text-amber-100", 
    description: "text-amber-800/80 dark:text-amber-200/80", 
    icon: "text-amber-500", 
  }, 
 
  error: { 
    container: 
      "border-red-500/30 bg-red-500/10 text-red-950 hover:bg-red-500/15 dark:text-red-100 dark:hover:bg-red-500/15", 
    title: "text-red-950 dark:text-red-100", 
    description: "text-red-800/80 dark:text-red-200/80", 
    icon: "text-red-500", 
  }, 
 
  success: { 
    container: 
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-950 hover:bg-emerald-500/15 dark:text-emerald-100 dark:hover:bg-emerald-500/15", 
    title: "text-emerald-950 dark:text-emerald-100", 
    description: "text-emerald-800/80 dark:text-emerald-200/80", 
    icon: "text-emerald-500", 
  }, 
 
  loading: { 
    container: "border-border bg-muted/50 text-foreground hover:bg-muted", 
    title: "text-foreground", 
    description: "text-muted-foreground", 
    icon: "text-muted-foreground", 
  }, 
}; 
 
function getDefaultIcon(variant: AlertVariant) { 
  switch (variant) { 
    case "warning": 
      return <TriangleAlert />; 
 
    case "error": 
      return <AlertCircle />; 
 
    case "success": 
      return <CheckCircle2 />; 
 
    case "loading": 
      return <Loader2 className="animate-spin" />; 
 
    case "default": 
    default: 
      return <Info />; 
  } 
} 
 
export function MyAlert({ 
  variant = "default", 
  title, 
  description, 
  icon, 
  action, 
  className, 
  titleClassName, 
  descriptionClassName, 
  actionClassName, 
  iconClassName, 
  ...props 
}: MyAlertProps) { 
  const styles = variantStyles[variant]; 
 
  return ( 
    <div 
      role="alert" 
      data-variant={variant} 
      className={cn( 
        "relative grid w-full grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-lg border px-4 py-3 text-left", 
        action && "lg:pr-24", 
        styles.container, 
        className, 
      )} 
      {...props} 
    > 
      <div 
        className={cn( 
          "row-span-2 mt-0.5 flex size-5 shrink-0 items-center justify-center", 
          styles.icon, 
          iconClassName, 
        )} 
      > 
        {icon ?? getDefaultIcon(variant)} 
      </div> 
 
      {title && ( 
        <div 
          className={cn( 
            "text-sm font-semibold leading-5 tracking-tight", 
            styles.title, 
            titleClassName, 
          )} 
        > 
          {title} 
        </div> 
      )} 
 
      {description && ( 
        <div 
          className={cn( 
            "text-sm leading-5", 
            styles.description, 
            descriptionClassName, 
          )} 
        > 
          {description} 
        </div> 
      )} 
 
      {action && ( 
        <div 
          className={cn( 
            "col-start-2 mt-2 flex w-full justify-end lg:mt-0 lg:w-auto lg:absolute lg:top-1/2 lg:right-3 lg:-translate-y-1/2", 
            actionClassName, 
          )} 
        > 
          {action} 
        </div> 
      )} 
    </div> 
  ); 
}