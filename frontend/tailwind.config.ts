import sharedConfig from '@keel/config/tailwind';
import type { Config } from 'tailwindcss';

const config: Config = {
  presets: [sharedConfig as Config],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    // Badge & Alert semantic colors
    'bg-emerald-100', 'text-emerald-700', 'dark:bg-emerald-900/30', 'dark:text-emerald-400',
    'bg-amber-100', 'text-amber-700', 'dark:bg-amber-900/30', 'dark:text-amber-400',
    'bg-sky-100', 'text-sky-700', 'dark:bg-sky-900/30', 'dark:text-sky-400',
    'bg-red-100', 'text-red-700', 'dark:bg-red-900/30', 'dark:text-red-400',
    // Alert borders and backgrounds
    'border-sky-200', 'bg-sky-50', 'text-sky-900', '[&>svg]:text-sky-500',
    'dark:border-sky-800', 'dark:bg-sky-950', 'dark:text-sky-100',
    'border-emerald-200', 'bg-emerald-50', 'text-emerald-900', '[&>svg]:text-emerald-500',
    'dark:border-emerald-800', 'dark:bg-emerald-950', 'dark:text-emerald-100',
    'border-amber-200', 'bg-amber-50', 'text-amber-900', '[&>svg]:text-amber-500',
    'dark:border-amber-800', 'dark:bg-amber-950', 'dark:text-amber-100',
    'border-red-200', 'bg-red-50', 'text-red-900', '[&>svg]:text-red-500',
    'dark:border-red-800', 'dark:bg-red-950', 'dark:text-red-100',
    // Toast colors
    'border-emerald-300', 'dark:border-emerald-700', 'dark:bg-emerald-950',
    '[&>svg]:text-emerald-600', 'dark:[&>svg]:text-emerald-400',
    'border-red-300', 'dark:border-red-700', 'dark:bg-red-950',
    '[&>svg]:text-red-600', 'dark:[&>svg]:text-red-400',
    'text-emerald-600', 'hover:bg-emerald-100', 'dark:text-emerald-400', 'dark:hover:bg-emerald-900',
    'text-red-600', 'hover:bg-red-100', 'dark:text-red-400', 'dark:hover:bg-red-900',
    // Switch colors and transforms
    'bg-slate-300', 'bg-violet-600', 'dark:bg-slate-600', 'dark:bg-violet-500',
    'data-[state=checked]:bg-violet-600', 'dark:data-[state=checked]:bg-violet-500',
    'data-[state=checked]:translate-x-5', 'data-[state=unchecked]:translate-x-0',
    'translate-x-5', 'translate-x-0',
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
