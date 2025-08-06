import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'image_ymZOY',
    'banner1_OkOk1',
    'banner2_vEFCM',
    'banner3_j1JMk',
    'text-gray-900',
    'text-transparent'
  ],
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
				primary: "rgb(var(--primary) / <alpha-value>)",
				secondary: "rgb(var(--secondary) / <alpha-value>)",
				background: "rgb(var(--background) / <alpha-value>)",
				foreground: "rgb(var(--foreground) / <alpha-value>)",
				accent: "rgb(var(--accent) / <alpha-value>)",
				mute: "rgb(var(--mute) / <alpha-value>)",
				warning: "rgb(var(--warning) / <alpha-value>)",
				warningForeground: "rgb(var(--warning-foreground) / <alpha-value>)",
				danger: "rgb(var(--danger) / <alpha-value>)",
				dangerForeground: "rgb(var(--danger-foreground) / <alpha-value>)",
				success: "rgb(var(--success) / <alpha-value>)",
				successForeground: "rgb(var(--success-foreground) / <alpha-value>)",
				action: "rgb(var(--action) / <alpha-value>)",
				actionForeground: "rgb(var(--action-foreground) / <alpha-value>)",
			},
      animation: {
        orbit: "orbit calc(var(--duration)*1s) linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient": "gradient 6s linear infinite",
        "expand": "expand 1s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "text-slide-up": "text-slide-up 0.5s ease-out forwards",
        "text-slide-down": "text-slide-down 0.5s ease-out forwards",
      },
      keyframes: {
        orbit: {
          "0%": {
            transform:
              "rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)",
          },
          "100%": {
            transform:
              "rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)",
          },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        gradient: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center"
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center"
          }
        },
        expand: {
          "0%": {
            transform: "scaleX(0)",
            opacity: "0"
          },
          "100%": {
            transform: "scaleX(1)",
            opacity: "1"
          }
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0)"
          },
          "50%": {
            transform: "translateY(-20px)"
          }
        },
        "text-slide-up": {
          "0%": {
            transform: "translateY(100%)",
            opacity: "0"
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1"
          }
        },
        "text-slide-down": {
          "0%": {
            transform: "translateY(-100%)",
            opacity: "0"
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1"
          }
        }
      },
    },
  },
  plugins: [require("tailwindcss-animate"),require("tailwindcss-react-aria-components"),require("tailwind-scrollbar")({ nocompatible: true })], 
};
export default config;
