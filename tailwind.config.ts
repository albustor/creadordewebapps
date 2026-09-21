import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mep: {
          blue: "#003366",
          darkBlue: "#001F3F",
          lightBlue: "#0055A5",
          accent: "#0088CC",
          gold: "#D4AF37",
          emerald: "#059669",
          coral: "#E11D48",
          amber: "#D97706",
          lightBg: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "Courier New", "monospace"],
      },
      boxShadow: {
        mepCard: "0 4px 20px -2px rgba(0, 51, 102, 0.08), 0 2px 6px -2px rgba(0, 51, 102, 0.04)",
        mepElevated: "0 10px 30px -4px rgba(0, 51, 102, 0.12), 0 4px 12px -2px rgba(0, 51, 102, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
