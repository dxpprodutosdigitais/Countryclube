import Link from "next/link";
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

export type ButtonVariant = "primary" | "accent" | "secondary" | "ghost" | "onDark" | "onDarkSolid";
export type ButtonSize = "sm" | "md" | "lg";

interface BaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconRight?: ReactNode;
  full?: boolean;
  className?: string;
  style?: CSSProperties;
}

type ButtonAsButton = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "style"> & { href?: undefined };
type ButtonAsLink = BaseProps & { href: string; external?: boolean; target?: string; rel?: string; onClick?: () => void };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function classes({ variant = "primary", size = "md", full, className }: BaseProps) {
  return ["btn", `btn--${variant}`, size !== "md" ? `btn--${size}` : "", full ? "btn--full" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");
}

/** Design-system Button — variantes primary / accent / secondary / ghost / onDark / onDarkSolid. */
export function Button(props: ButtonProps) {
  const { children, icon, iconRight } = props;
  const inner = (
    <>
      {icon && <span className="btn__icon" aria-hidden>{icon}</span>}
      {children}
      {iconRight && <span className="btn__icon" aria-hidden>{iconRight}</span>}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const { href, external, target, rel, onClick, style } = props;
    const cls = classes(props);
    if (external || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return (
        <a href={href} className={cls} style={style} target={target ?? (external ? "_blank" : undefined)} rel={rel ?? (external ? "noopener noreferrer" : undefined)} onClick={onClick}>
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} style={style} onClick={onClick}>
        {inner}
      </Link>
    );
  }

  const { variant, size, icon: _i, iconRight: _ir, full, className, type = "button", ...rest } = props as ButtonAsButton;
  void _i; void _ir;
  return (
    <button type={type} className={classes({ children, variant, size, full, className })} {...rest}>
      {inner}
    </button>
  );
}
