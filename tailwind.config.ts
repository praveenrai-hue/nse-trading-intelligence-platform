import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f1419',
        foreground: '#ffffff',
        primary: '#00d4ff',
        secondary: '#1e3a5f',
        accent: '#ff6b35',
        muted: '#374151',
        'muted-foreground': '#9ca3af',
        border: '#1f2937',
      },
      backgroundColor: {
        'secondary/5': 'rgba(30, 58, 95, 0.05)',
        'secondary/10': 'rgba(30, 58, 95, 0.1)',
        'secondary/20': 'rgba(30, 58, 95, 0.2)',
        'secondary/30': 'rgba(30, 58, 95, 0.3)',
        'primary/10': 'rgba(0, 212, 255, 0.1)',
        'primary/20': 'rgba(0, 212, 255, 0.2)',
        'primary/5': 'rgba(0, 212, 255, 0.05)',
      },
      borderColor: {
        border: '#1f2937',
      },
    },
  },
}

export default config
