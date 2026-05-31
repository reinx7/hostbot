import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        muted: "hsl(var(--muted))",
        border: "hsl(var(--border))",
        primary: "#6366F1",
        violet: "#A855F7",
      },
      boxShadow: {
        neon: "0 0 40px rgba(99,102,241,.25)",
      },
      animation: {
        "border-flow": "border-flow 5s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        "border-flow": { "0%": { backgroundPosition: "0% 50%" }, "100%": { backgroundPosition: "200% 50%" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
      },
    },
  },
  plugins: [],
} satisfies Config;
