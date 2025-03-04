
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				rajdhani: ['Rajdhani', 'sans-serif'],
				orbitron: ['Orbitron', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Solo Leveling inspired colors - enhanced
				'sl-dark': '#151823',
				'sl-darker': '#0D0F16',
				'sl-blue': '#7BB4FF',
				'sl-blue-light': '#A0CFFF',
				'sl-blue-dark': '#4A7AC8',
				'sl-purple': '#9b87f5',
				'sl-purple-light': '#BDB2FF',
				'sl-purple-dark': '#7E69AB',
				'sl-grey': '#8E9196',
				'sl-grey-dark': '#2A2D36',
				'sl-red': '#FF5E5E',
				'sl-green': '#50E3A4',
				'sl-yellow': '#FFD166',
				// Light mode colors
				'light-bg': '#F4F6FE',
				'light-card': '#FFFFFF',
				'light-text': '#333344',
				'light-border': '#E4E6F1',
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
				},
				'pulse-glow': {
					'0%, 100%': { 
						opacity: '1',
						boxShadow: '0 0 15px 0px rgba(123, 180, 255, 0.7)'
					},
					'50%': { 
						opacity: '0.8',
						boxShadow: '0 0 25px 5px rgba(123, 180, 255, 0.9)'
					}
				},
				'fade-in': {
					'0%': { 
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': { 
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in': {
					'0%': {
						opacity: '0',
						transform: 'translateX(-20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'glow': {
					'0%, 100%': { 
						boxShadow: '0 0 5px 0px rgba(123, 180, 255, 0.5)'
					},
					'50%': { 
						boxShadow: '0 0 15px 2px rgba(123, 180, 255, 0.8)'
					}
				},
				'flicker': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' },
				},
				'system-scan': {
					'0%': { backgroundPosition: '0% 0%' },
					'100%': { backgroundPosition: '100% 100%' },
				},
				'appear': {
					'0%': { 
						opacity: '0',
						transform: 'scale(0.9)'
					},
					'100%': { 
						opacity: '1',
						transform: 'scale(1)'
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s infinite ease-in-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'slide-up': 'slide-up 0.5s ease-out',
				'slide-in': 'slide-in 0.5s ease-out',
				'glow': 'glow 2s infinite ease-in-out',
				'flicker': 'flicker 2s linear infinite',
				'system-scan': 'system-scan 3s ease-in-out infinite alternate',
				'appear': 'appear 0.5s ease-out forwards',
			},
			backgroundImage: {
				'sl-grid': 'linear-gradient(rgba(123, 180, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(123, 180, 255, 0.1) 1px, transparent 1px)',
				'sl-hex-pattern': 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 30 L15 7.5 L45 7.5 L60 30 L45 52.5 L15 52.5 Z\' fill=\'none\' stroke=\'rgba(123, 180, 255, 0.05)\' stroke-width=\'1\'/%3E%3C/svg%3E")',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
