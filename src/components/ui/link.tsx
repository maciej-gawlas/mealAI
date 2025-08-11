import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface LinkProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export function Link({ className, href, children, ...props }: LinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "font-medium text-primary underline-offset-4 hover:underline",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
