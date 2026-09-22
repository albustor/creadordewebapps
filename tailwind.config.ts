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
          blue: "#1E3A5F",
          darkBlue: "#0F243E",
          lightBlue: "#2D68A8",
          accent: "#0284C7",
          gold: "#C59B27",
          emerald: "#2E6847",
          coral: "#C93B3B",
          amber: "#B86A1D",
          lightBg: "#FAF8F5",
        },
        pastel: {
          canvas: "#FAF8F5",
          canvasAlt: "#F5EFEB",
          card: "#FFFFFF",
          sageBg: "#EBF3EE",
          sageBorder: "#C7DEC9",
          sageText: "#1B432D",
          sageAccent: "#2E6847",
          skyBg: "#EBF3FA",
          skyBorder: "#C9DFEE",
          skyText: "#19385C",
          skyAccent: "#2B5C8F",
          lavenderBg: "#F2EEF8",
          lavenderBorder: "#D8CEEA",
          lavenderText: "#37284F",
          lavenderAccent: "#574476",
          sandBg: "#FAF3EB",
          sandBorder: "#EAD7C4",
          sandText: "#573415",
          sandAccent: "#875529",
          coralBg: "#FDF0F0",
          coralBorder: "#F5C6C6",
          coralText: "#6E1C1C",
          coralAccent: "#9E3333",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "Courier New", "monospace"],
      },
      boxShadow: {
        mepCard: "0 2px 12px -2px rgba(46, 56, 77, 0.06), 0 1px 4px -1px rgba(46, 56, 77, 0.04)",
        mepElevated: "0 8px 24px -4px rgba(46, 56, 77, 0.08), 0 3px 8px -2px rgba(46, 56, 77, 0.04)",
        softPastel: "0 4px 20px -2px rgba(120, 110, 100, 0.07), 0 1px 3px 0 rgba(120, 110, 100, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
