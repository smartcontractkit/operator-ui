/**
 * Compatibility shim: re-exports `withStyles` in the curried
 * `withStyles(styles)(Component)` form that the codebase uses, backed by
 * tss-react (Emotion) instead of the deprecated @mui/styles (JSS).
 *
 * Also provides local `WithStyles` and `createStyles` replacements so all the
 * old `import { ... } from '@mui/styles'` references just change path.
 *
 * IMPORTANT: tss-react is configured to use the TssCacheProvider in index.js
 * (key: 'tss', no-prepend), which sits AFTER MUI's injectFirst prepend cache
 * in <head>. This guarantees our custom styles always win over MUI defaults
 * when they target the same CSS property with the same specificity.
 */
import type { ComponentType } from 'react'
import { createMakeAndWithStyles } from 'tss-react'
import { useTheme } from '@mui/material/styles'

// Build a withStyles that is bound to the MUI theme and picks up the
// TssCacheProvider cache defined in index.js.
const { withStyles: tssWithStyles } = createMakeAndWithStyles({ useTheme })

// createStyles is a pure identity function used only for TypeScript inference.
// The MUI v5 version is typed as returning `never`, which breaks all the
// `WithStyles` usages.  This one correctly preserves the argument type.
export function createStyles<T extends Record<string, unknown>>(styles: T): T {
  return styles
}

// WithStyles<typeof stylesCreatorFn> → { classes: { classKey: string; … } }
export type WithStyles<
  T extends
    | ((...args: never[]) => Record<string, unknown>)
    | Record<string, unknown>,
> = {
  classes: T extends (...args: never[]) => infer R
    ? { [K in keyof R]: string }
    : { [K in keyof T]: string }
}

// Curried wrapper: withStyles(styles)(Component)
// `classes` is stripped from required external props (withStyles injects it)
// but kept as an optional override to allow partial class-name overrides from
// parent components (the same pattern MUI v4 supported).
export function withStyles<StylesCreator>(styles: StylesCreator) {
  return function <P extends { classes: Record<string, string> }>(
    component: ComponentType<P>,
  ): ComponentType<
    Omit<P, 'classes'> & { classes?: Partial<Record<string, string>> }
  > {
    return tssWithStyles(
      component as Parameters<typeof tssWithStyles>[0],
      styles as never,
    ) as unknown as ComponentType<
      Omit<P, 'classes'> & { classes?: Partial<Record<string, string>> }
    >
  }
}
