"use client";

import React, { useEffect } from "react";
import { useGetThemeSettingsQuery } from "@/redux/api/themeApi";

export const loadGoogleFont = (fontFamilyStr?: string) => {
  if (typeof window === "undefined" || !fontFamilyStr) return;
  const cleanName = fontFamilyStr.split(",")[0].replace(/['"]/g, "").trim();
  if (
    !cleanName ||
    cleanName.toLowerCase() === "sans-serif" ||
    cleanName.toLowerCase() === "serif" ||
    cleanName.toLowerCase() === "monospace"
  ) {
    return;
  }

  const fontId = `dynamic-google-font-${cleanName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  if (document.getElementById(fontId)) return;

  const link = document.createElement("link");
  link.id = fontId;
  link.rel = "stylesheet";
  const formattedName = cleanName.replace(/\s+/g, "+");
  link.href = `https://fonts.googleapis.com/css2?family=${formattedName}:wght@300;400;500;600;700;800&display=swap`;
  document.head.appendChild(link);
};

export default function DynamicAdminTheme() {
  const { data: themeData } = useGetThemeSettingsQuery();

  useEffect(() => {
    if (!themeData?.data) return;
    const t = themeData.data;
    const root = document.documentElement;

    if (t.primaryColor) root.style.setProperty("--color-primary", t.primaryColor);
    if (t.secondaryColor) root.style.setProperty("--color-secondary", t.secondaryColor);
    if (t.accentColor) root.style.setProperty("--color-accent", t.accentColor);
    if (t.backgroundColor) root.style.setProperty("--color-background", t.backgroundColor);
    if (t.surfaceColor) root.style.setProperty("--color-surface", t.surfaceColor);
    if (t.textPrimary) root.style.setProperty("--color-text-primary", t.textPrimary);
    if (t.textSecondary) root.style.setProperty("--color-text-secondary", t.textSecondary);
    if (t.textMuted) root.style.setProperty("--color-text-muted", t.textMuted);
    if (t.successColor) root.style.setProperty("--color-success", t.successColor);
    if (t.warningColor) root.style.setProperty("--color-warning", t.warningColor);
    if (t.errorColor) root.style.setProperty("--color-error", t.errorColor);

    const appliedFont = t.fontFamily || "'Poppins', sans-serif";
    const appliedHeading = t.headingFont || appliedFont;

    loadGoogleFont(appliedFont);
    if (appliedHeading !== appliedFont) loadGoogleFont(appliedHeading);

    root.style.setProperty("--font-family", appliedFont);
    root.style.setProperty("--font-heading", appliedHeading);

    const styleId = "dynamic-admin-theme-global";
    let styleTag = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    styleTag.innerHTML = `
      :root {
        --color-primary: ${t.primaryColor || "#619d23"};
        --color-secondary: ${t.secondaryColor || "#4B5966"};
        --color-accent: ${t.accentColor || "#FF6B6B"};
        --font-family: ${appliedFont};
        --font-heading: ${appliedHeading};
      }
      html, body, button, input, select, textarea {
        font-family: ${appliedFont} !important;
      }
      h1, h2, h3, h4, h5, h6 {
        font-family: ${appliedHeading} !important;
      }
    `;
  }, [themeData]);

  return null;
}
