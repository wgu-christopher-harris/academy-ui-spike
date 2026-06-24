import {ButtonDesignTokens} from "@primeuix/themes/types/button";

const academySecondary800 = 'var(--academy-secondary-800)';
const academySecondary900 = 'var(--academy-secondary-900)';
const academyPrimary0 = 'var(--academy-primary-0)';
const academyPrimary50 = 'var(--academy-primary-50)';
const academyPrimary100 = 'var(--academy-primary-100)';
const academyPrimary500 = 'var(--academy-primary-500)';
const academyTertiary400 = 'var(--academy-tertiary-400)';

export const academyButtons: ButtonDesignTokens = {
  root: {
    borderRadius: '5px',
    roundedBorderRadius: '9999px',
    gap: '0.5rem',
    paddingX: '32px',
    paddingY: '14px',
    iconOnlyWidth: '46px',
    sm: {
      fontSize: '15px',
      paddingX: '16px',
      paddingY: '6px',
      iconOnlyWidth: '30px',
    },
    lg: {
      fontSize: '15px',
      paddingX: '97px',
      paddingY: '14px',
      iconOnlyWidth: '46px',
    },
    label: {
      fontWeight: '600',
    },
    focusRing: {
      width: '2px',
      style: 'solid',
      offset: '2px',
    },
    badgeSize: '1rem',
    transitionDuration: '{form.field.transition.duration}',
  },
  colorScheme: {
    light: {
      root: {
        primary: {
          background: academySecondary800,
          hoverBackground: academySecondary900,
          activeBackground: academySecondary900,
          borderColor: academySecondary800,
          hoverBorderColor: academySecondary900,
          activeBorderColor: academySecondary900,
          color: academyPrimary0,
          hoverColor: academyPrimary0,
          activeColor: academyPrimary0,
          focusRing: {
            color: academySecondary800,
            shadow: 'none',
          },
        },
        secondary: {
          background: academyPrimary50,
          hoverBackground: academyPrimary50,
          activeBackground: academyPrimary100,
          borderColor: academySecondary800,
          hoverBorderColor: academySecondary800,
          activeBorderColor: academySecondary900,
          color: academySecondary800,
          hoverColor: academySecondary800,
          activeColor: academySecondary900,
          focusRing: {
            color: academySecondary800,
            shadow: 'none',
          },
        },
      },
      outlined: {
        primary: {
          hoverBackground: academyPrimary50,
          activeBackground: academyPrimary100,
          borderColor: academySecondary800,
          color: academySecondary800,
        },
        plain: {
          hoverBackground: academyPrimary50,
          activeBackground: academyPrimary100,
          borderColor: academySecondary800,
          color: academySecondary800,
        },
      },
      text: {
        primary: {
          hoverBackground: academyPrimary50,
          activeBackground: academyPrimary100,
          color: academySecondary800,
        },
        plain: {
          hoverBackground: academyPrimary50,
          activeBackground: academyPrimary100,
          color: academySecondary800,
        },
      },
      link: {
        color: academySecondary800,
        hoverColor: academySecondary900,
        activeColor: academySecondary900,
      },
    },
    dark: {
      root: {
        primary: {
          background: academyTertiary400,
          hoverBackground: academyTertiary400,
          activeBackground: academyTertiary400,
          borderColor: academyTertiary400,
          hoverBorderColor: academyTertiary400,
          activeBorderColor: academyTertiary400,
          color: academyPrimary500,
          hoverColor: academyPrimary500,
          activeColor: academyPrimary500,
          focusRing: {
            color: academyTertiary400,
            shadow: 'none',
          },
        },
        secondary: {
          background: 'transparent',
          hoverBackground: 'transparent',
          activeBackground: 'transparent',
          borderColor: academyTertiary400,
          hoverBorderColor: academyTertiary400,
          activeBorderColor: academyTertiary400,
          color: academyTertiary400,
          hoverColor: academyTertiary400,
          activeColor: academyTertiary400,
          focusRing: {
            color: academyTertiary400,
            shadow: 'none',
          },
        },
      },
      outlined: {
        primary: {
          hoverBackground: 'color-mix(in srgb, var(--academy-tertiary-400), transparent 84%)',
          activeBackground: 'color-mix(in srgb, var(--academy-tertiary-400), transparent 76%)',
          borderColor: academyTertiary400,
          color: academyTertiary400,
        },
        plain: {
          hoverBackground: 'color-mix(in srgb, var(--academy-tertiary-400), transparent 84%)',
          activeBackground: 'color-mix(in srgb, var(--academy-tertiary-400), transparent 76%)',
          borderColor: academyTertiary400,
          color: academyTertiary400,
        },
      },
      text: {
        primary: {
          hoverBackground: 'color-mix(in srgb, var(--academy-tertiary-400), transparent 84%)',
          activeBackground: 'color-mix(in srgb, var(--academy-tertiary-400), transparent 76%)',
          color: academyTertiary400,
        },
        plain: {
          hoverBackground: 'color-mix(in srgb, var(--academy-tertiary-400), transparent 84%)',
          activeBackground: 'color-mix(in srgb, var(--academy-tertiary-400), transparent 76%)',
          color: academyTertiary400,
        },
      },
      link: {
        color: academyTertiary400,
        hoverColor: academyTertiary400,
        activeColor: academyTertiary400,
      },
    },
  },
  css: () => `
    .p-button {
      font-family: "Lato", var(--academy-font-family);
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.46px;
      line-height: 18px;
    }

    .p-button .p-button-label {
      font: inherit;
    }

    .p-button:focus-visible {
      outline-offset: 2px;
    }
  `,
};
