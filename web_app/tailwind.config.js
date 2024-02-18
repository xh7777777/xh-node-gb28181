// @ts-check
const { fontFamily } = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

// /** @type {import("tailwindcss/types").Config } */
module.exports = {
  content: [
    './src/**/*.{js,ts,tsx}',
    './src/*.tsx'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        stroke: {
          '0%': { strokeDashoffset: 20, strokeDasharray: 20 },
          '100%': { strokeDashoffset: 0, strokeDasharray: 0 },
        },
      },
      animation: {
        stroke: 'stroke 1s forwards',
      },
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', ...fontFamily.sans],
      },
      colors: {
        primary: colors.blue,
        gray: colors.gray,
        slate: colors.slate
      },
      backgroundColor: {
        'transparent-blue': 'rgba(148, 137, 231, 0.2)',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.600')}`,
              },
              code: { color: theme('colors.primary.400') },
            },
            'h1,h2': {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
            },
            h3: {
              fontWeight: '600',
            },
            pre: {
              backgroundColor: theme('colors.slate.100'),
              borderRadius: theme('borderRadius.lg'),
              padding: theme('padding.2'),
            },
            code: {
              color: theme('colors.indigo.500'),
            },
            img: {
              borderRadius: theme('borderRadius.lg'),
            }
          },
        },
        invert: {
          css: {
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.400')}`,
              },
              code: { color: theme('colors.primary.400') },
            },
            'h1,h2,h3,h4,h5,h6': {
              color: theme('colors.slate.100'),
            },
            pre: {
              backgroundColor: theme('colors.slate.800'),
              borderRadius: theme('borderRadius.lg'),
              padding: theme('padding.2'),
            },
          },
        },
      }),
    },
  },
  plugins: [],
}
