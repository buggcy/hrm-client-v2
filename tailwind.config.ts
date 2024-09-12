import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          contentVisibility: {
            auto: 'auto',
            hidden: 'hidden',
            visible: 'visible',
          },
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },

        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsla(var(--success) / 0.15)',
        },
        progress: {
          DEFAULT: 'hsl(var(--progress))',
          foreground: 'hsla(var(--progress) / 0.15)',
        },
        error: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsla(var(--destructive) / 0.15)',
        },
        'blur-background': {
          DEFAULT: 'hsla(229, 84%, 5%, 0.2)',
          foreground: 'hsla(0, 0%, 100%, 1)',
        },
      },
      ringColor: {
        DEFAULT: 'hsl(var(--primary))',
      },
      boxShadow: {
        'icon-button': '0px 6px 25px -2px rgba(242, 48, 170, 0.31)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      spacing: {
        'w-sidebar': '4.5rem',
        'w-sidebar-open': '15rem',
        'w-sidebar-item': '13rem',
        6.5: '1.625rem',
        13: '3.25rem',
        13.5: '3.375rem',
        18: '4.5rem',
        18.5: '4.625rem',
        19: '4.75rem',
        19.5: '4.875rem',
        35: '8.75rem',
        35.5: '8.875rem',
        38.5: '9.625rem',
        45: '11.25rem',
        45.5: '11.375rem',
        76.5: '19.125rem',
        78.5: '19.625rem',
      },
      screens: {
        xl: '1304px',
      },
      'content-visibility': {
        auto: 'auto',
        hidden: 'hidden',
        visible: 'visible',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(function ({ addUtilities, theme }) {
      const newUtilities = {
        '.content-visibility-auto': {
          'content-visibility': theme('content-visibility.auto', 'auto'),
        },
        '.content-visibility-hidden': {
          'content-visibility': theme('content-visibility.hidden', 'hidden'),
        },
        '.content-visibility-visible': {
          'content-visibility': theme('content-visibility.visible', 'visible'),
        },
      };
      addUtilities(newUtilities);
    }),
  ],
} satisfies Config;

export default config;
