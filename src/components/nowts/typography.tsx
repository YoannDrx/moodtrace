/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { ComponentPropsWithRef, ElementType, ForwardedRef } from "react";

import type React from "react";
import { forwardRef } from "react";

// Source : https://www.totaltypescript.com/pass-component-as-prop-react
type FixedForwardRef = <T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode,
) => (props: P & React.RefAttributes<T>) => React.ReactNode;

const fixedForwardRef = forwardRef as FixedForwardRef;

type DistributiveOmit<T, TOmitted extends PropertyKey> = T extends any
  ? Omit<T, TOmitted>
  : never;

/**
 * MoodTrace Typography Variants
 *
 * Complete typography system with all heading levels and text styles.
 * Uses design tokens from the MoodTrace design system.
 */
export const typographyVariants = cva("", {
  variants: {
    variant: {
      // Display - Hero titles, landing pages
      display:
        "font-caption text-5xl font-extrabold tracking-tight lg:text-6xl xl:text-7xl",

      // Headings
      h1: "font-caption scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "font-caption scroll-m-20 text-3xl font-semibold tracking-tight transition-colors",
      h3: "font-caption scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "font-caption scroll-m-20 text-xl font-semibold tracking-tight",
      h5: "font-caption scroll-m-20 text-lg font-semibold tracking-tight",
      h6: "font-caption scroll-m-20 text-base font-semibold tracking-tight",

      // Body text
      p: "leading-7 [&:not(:first-child)]:mt-6",
      default: "",

      // Special text styles
      lead: "text-muted-foreground text-xl",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-muted-foreground text-sm",

      // Specialized
      quote: "mt-6 border-l-2 border-primary pl-6 italic",
      code: "bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      link: "text-primary font-medium hover:underline",

      // Labels and captions
      overline:
        "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
      caption: "text-xs text-muted-foreground",

      // Inline styles
      strong: "font-semibold",
      emphasis: "italic",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type TypographyVariant = NonNullable<
  VariantProps<typeof typographyVariants>["variant"]
>;

type TypographyCvaProps = VariantProps<typeof typographyVariants>;

const defaultElementMapping = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  p: "p",
  quote: "blockquote",
  code: "code",
  lead: "p",
  large: "p",
  small: "small",
  muted: "p",
  link: "a",
  overline: "span",
  caption: "span",
  strong: "strong",
  emphasis: "em",
  default: "p",
} satisfies Record<NonNullable<TypographyCvaProps["variant"]>, ElementType>;

type ElementMapping = typeof defaultElementMapping;

type ElementTypeForVariant<TVariant extends keyof ElementMapping> =
  ElementMapping[TVariant];

/**
 * MoodTrace Typography Component
 *
 * A polymorphic typography component with comprehensive variants for all text styles.
 *
 * @example
 * ```tsx
 * // Display title for hero sections
 * <Typography variant="display">Suivez votre humeur</Typography>
 *
 * // Standard headings
 * <Typography variant="h1">Page Title</Typography>
 * <Typography variant="h2">Section Title</Typography>
 * <Typography variant="h3">Subsection</Typography>
 * <Typography variant="h4">Card Title</Typography>
 *
 * // Body text
 * <Typography variant="p">Regular paragraph text.</Typography>
 * <Typography variant="lead">Lead paragraph with emphasis.</Typography>
 * <Typography variant="muted">Secondary, less important text.</Typography>
 *
 * // Labels
 * <Typography variant="overline">SECTION LABEL</Typography>
 * <Typography variant="caption">Image caption or note</Typography>
 *
 * // With custom element
 * <Typography variant="h2" as="a" href="#">Clickable heading</Typography>
 * <Typography variant="large" as={Link} href="#">Next.js link</Typography>
 * ```
 *
 * @param variant - The typography style variant
 * @param as - Override the default HTML element
 * @param className - Additional CSS classes
 */
const InnerTypography = <
  TAs extends ElementType,
  TVariant extends TypographyCvaProps["variant"] = "default",
>(
  {
    variant = "default",
    className,
    as,
    ...props
  }: {
    as?: TAs;
    variant?: TVariant;
  } & DistributiveOmit<
    ComponentPropsWithRef<
      ElementType extends TAs
        ? ElementTypeForVariant<NonNullable<TVariant>>
        : TAs
    >,
    "as"
  >,
  ref: ForwardedRef<any>,
) => {
  const Comp = as ?? defaultElementMapping[variant ?? "default"];
  return (
    <Comp
      {...props}
      className={cn(typographyVariants({ variant }), className)}
      ref={ref}
    ></Comp>
  );
};

export const Typography = fixedForwardRef(InnerTypography);
