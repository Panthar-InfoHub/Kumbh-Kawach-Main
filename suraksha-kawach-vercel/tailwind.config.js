/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate"
const config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				blue_blob: 'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);',
				bottom_bg: 'linear-gradient(to bottom, #ffffff00 97%, #66a6ff 3%);',
				white_glass: 'linear-gradient(0deg, rgba(240, 244, 248, .5), rgba(240, 244, 248, .1));',
			},
			boxShadow: {
				'shadown_red': '0px 0px 2px 3px rgba(249, 115, 22, 0.5)',
				'shadown_yellow': '0px 0px 2px 3px rgba(234, 179, 8, 0.5)',
				'shadow_blue': '0px 0px 2px 3px  rgba(59, 130, 246, 0.5)',
			},
			colors: {
				'white-1': '#f5f5f5',
				'white-glass': 'rgba(235, 235, 235, 0.4)',
				'glass_bg': 'rgba(0, 0, 0, 0)',
				'border-color': 'rgba(0, 0, 0, .16) rgba(255, 255, 255, .16) rgba(255, 255, 255, .36) rgba(255, 255, 255, .16);',
				'grey-1': '#c6c6c6',
				'grey-2': '#e1e1e1',
				'grey-3': '#ececec',
				'grey-4': '#fafafa',
				'black-1': '#0a0a0a',
				'black-2': '#171717',
				'black-3': '#1F2127',
				'black-hover': 'rgba(0, 0, 0, 0.7)',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [tailwindcssAnimate],
};
export default config;
