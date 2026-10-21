"use client";

import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch, updateTheme, resetTheme, toggleDarkMode } from '@/redux';
import { useGetThemeSettingsQuery, useUpdateThemeSettingsMutation } from '@/redux/api/themeApi';
import toast from 'react-hot-toast';
import { FiRefreshCw, FiSave, FiRotateCcw } from 'react-icons/fi';
import { loadGoogleFont } from '@/components/theme/DynamicAdminTheme';

const normalizeFontValue = (val?: string) => {
    if (!val) return "'Poppins', sans-serif";
    const cleaned = val.replace(/['"]/g, "").trim().toLowerCase();
    if (cleaned.startsWith("open sans")) return "'Open Sans', sans-serif";
    if (cleaned.startsWith("inter")) return "'Inter', sans-serif";
    if (cleaned.startsWith("roboto")) return "'Roboto', sans-serif";
    if (cleaned.startsWith("nunito")) return "'Nunito', sans-serif";
    if (cleaned.startsWith("montserrat")) return "'Montserrat', sans-serif";
    if (cleaned.startsWith("hind siliguri")) return "'Hind Siliguri', sans-serif";
    if (cleaned.startsWith("lato")) return "'Lato', sans-serif";
    if (cleaned.startsWith("raleway")) return "'Raleway', sans-serif";
    if (cleaned.startsWith("playfair display")) return "'Playfair Display', serif";
    return val;
};

const ThemeEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const theme = useAppSelector(state => state.theme.config);
    const { data: dbThemeData, isLoading: isFetchingTheme } = useGetThemeSettingsQuery();
    const [updateThemeSettings, { isLoading: isSaving }] = useUpdateThemeSettingsMutation();

    // Populate theme from DB on first load
    useEffect(() => {
        if (dbThemeData?.data) {
            dispatch(updateTheme(dbThemeData.data));
        }
    }, [dbThemeData, dispatch]);

    // Apply theme to CSS variables in admin preview
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--color-primary', theme.primaryColor);
        root.style.setProperty('--color-secondary', theme.secondaryColor);
        root.style.setProperty('--color-accent', theme.accentColor);
        root.style.setProperty('--color-background', theme.backgroundColor);
        root.style.setProperty('--color-surface', theme.surfaceColor);
        root.style.setProperty('--color-text-primary', theme.textPrimary);
        root.style.setProperty('--color-text-secondary', theme.textSecondary);
        root.style.setProperty('--color-text-muted', theme.textMuted);

        // Typography
        const currentFont = theme.fontFamily || "'Poppins', sans-serif";
        const currentHeading = theme.headingFont || currentFont;
        loadGoogleFont(currentFont);
        if (currentHeading !== currentFont) loadGoogleFont(currentHeading);

        root.style.setProperty('--font-family', currentFont);
        root.style.setProperty('--font-heading', currentHeading);

        // Update utility classes and font override
        const style = document.createElement('style');
        style.id = 'dynamic-theme';
        style.innerHTML = `
      .cp { color: ${theme.primaryColor} !important; }
      .ct { color: ${theme.secondaryColor} !important; }
      .bgp { background-color: ${theme.primaryColor} !important; }
      .ts { color: ${theme.secondaryColor} !important; }
      
      html, body, button, input, select, textarea {
        font-family: ${currentFont} !important;
      }
      h1, h2, h3, h4, h5, h6 {
        font-family: ${currentHeading} !important;
      }
    `;

        // Remove old style if exists
        const oldStyle = document.getElementById('dynamic-theme');
        if (oldStyle) oldStyle.remove();
        document.head.appendChild(style);
    }, [theme]);

    const handleColorChange = (key: string, value: string) => {
        dispatch(updateTheme({ [key]: value }));
    };

    const handleSaveTheme = async () => {
        try {
            const res = await updateThemeSettings(theme).unwrap();
            if (res.success) {
                toast.success('Theme successfully saved to database! Changes are now live across your site.');
            }
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to save theme to database');
        }
    };

    const handleResetTheme = () => {
        dispatch(resetTheme());
        toast('Theme reset to defaults. Click "Save Theme" to persist.', { icon: 'ℹ️' });
    };

    const colorInputs = [
        { key: 'primaryColor', label: 'Primary Color', description: 'Main brand color (buttons, links, badges)' },
        { key: 'secondaryColor', label: 'Secondary Color', description: 'Secondary text, headers, subheadings' },
        { key: 'accentColor', label: 'Accent Color', description: 'Sale badges, notifications, highlights' },
        { key: 'backgroundColor', label: 'Background Color', description: 'Page background' },
        { key: 'surfaceColor', label: 'Surface Color', description: 'Card backgrounds, input backgrounds' },
        { key: 'textPrimary', label: 'Text Primary', description: 'Main body text' },
        { key: 'textSecondary', label: 'Text Secondary', description: 'Subtitle, muted text' },
        { key: 'successColor', label: 'Success Color', description: 'Success indicators and alerts' },
        { key: 'warningColor', label: 'Warning Color', description: 'Warning indicators and alerts' },
        { key: 'errorColor', label: 'Error Color', description: 'Error and discount badges' },
    ];

    if (isFetchingTheme) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#619d23] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-sm font-medium text-gray-500">Loading store theme settings...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-24">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Theme Customization</h1>
                        <p className="text-gray-600 mt-2">
                            Customize your store appearance. Colors and typography are stored in the database and applied dynamically to your storefront.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleSaveTheme}
                        disabled={isSaving}
                        className="px-6 py-3 bg-[#619d23] hover:bg-[#52841d] text-white rounded-xl font-bold shadow-lg shadow-[#619d23]/25 transition flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? <FiRefreshCw className="animate-spin" /> : <FiSave />}
                        {isSaving ? 'Saving...' : 'Save Theme'}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Settings Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Colors */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bgp flex items-center justify-center text-white font-bold">🎨</span>
                                Brand & UI Colors
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {colorInputs.map(input => (
                                    <div key={input.key} className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            {input.label}
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="color"
                                                value={(theme as any)[input.key] || '#619d23'}
                                                onChange={(e) => handleColorChange(input.key, e.target.value)}
                                                className="w-12 h-12 rounded-xl cursor-pointer border-2 border-gray-200"
                                            />
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={(theme as any)[input.key] || ''}
                                                    onChange={(e) => handleColorChange(input.key, e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-xl text-sm font-mono uppercase bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#619d23]"
                                                />
                                                <p className="text-xs text-gray-400 mt-1">{input.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Typography */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold">Aa</span>
                                Typography
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Font Family
                                    </label>
                                    <select
                                        value={normalizeFontValue(theme.fontFamily)}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            loadGoogleFont(val);
                                            dispatch(updateTheme({ fontFamily: val, headingFont: val }));
                                        }}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white text-sm"
                                    >
                                        <option value="'Poppins', sans-serif">Poppins (Default Modern)</option>
                                        <option value="'Inter', sans-serif">Inter (Clean & Professional)</option>
                                        <option value="'Roboto', sans-serif">Roboto (Google Standard)</option>
                                        <option value="'Open Sans', sans-serif">Open Sans (Readable & Friendly)</option>
                                        <option value="'Nunito', sans-serif">Nunito (Soft & Rounded)</option>
                                        <option value="'Montserrat', sans-serif">Montserrat (Geometric Elegance)</option>
                                        <option value="'Hind Siliguri', sans-serif">Hind Siliguri (Bangla & English Optimal)</option>
                                        <option value="'Lato', sans-serif">Lato (Warm & Corporate)</option>
                                        <option value="'Raleway', sans-serif">Raleway (Stylish & Clean)</option>
                                        <option value="'Playfair Display', serif">Playfair Display (Luxury & Editorial)</option>
                                    </select>
                                    <p className="text-xs text-gray-400">Selected font applies across storefront and admin panel.</p>
                                </div>

                                {/* Live Font Preview Box */}
                                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex flex-col justify-center">
                                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                        Live Font Preview ({theme.fontFamily?.split(',')[0]?.replace(/['"]/g, '') || 'Poppins'})
                                    </span>
                                    <h4 className="text-base font-bold text-gray-900 transition-all leading-tight" style={{ fontFamily: theme.fontFamily }}>
                                        Fresh Organic Grocery & Daily Essentials
                                    </h4>
                                    <p className="text-xs text-gray-600 mt-1 transition-all" style={{ fontFamily: theme.fontFamily }}>
                                        সবজিহাট - তাজা শাকসবজি, ফলমূল ও মাছ-মাংস সরাসরি আপনার ঘরে।
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Dark Mode */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-white">🌙</span>
                                Dark Mode
                            </h2>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-700">Enable Dark Mode</p>
                                    <p className="text-sm text-gray-400">Switch store to dark theme</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => dispatch(toggleDarkMode())}
                                    className={`relative w-14 h-7 rounded-full transition-colors ${theme.darkMode ? 'bg-[#619d23]' : 'bg-gray-300'}`}
                                >
                                    <span
                                        className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow ${theme.darkMode ? 'translate-x-8' : 'translate-x-1'}`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={handleResetTheme}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition flex items-center gap-2"
                            >
                                <FiRotateCcw size={16} /> Reset to Default
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveTheme}
                                disabled={isSaving}
                                className="px-8 py-3 bg-[#619d23] hover:bg-[#52841d] text-white rounded-xl font-bold shadow-lg shadow-[#619d23]/25 transition flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? <FiRefreshCw className="animate-spin" /> : <FiSave />}
                                {isSaving ? 'Saving...' : 'Save Theme'}
                            </button>
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
                            <h2 className="text-xl font-semibold mb-6">Live Preview</h2>

                            {/* Preview Card */}
                            <div
                                className="rounded-xl p-4 mb-4 border border-gray-100 transition-colors"
                                style={{ backgroundColor: theme.surfaceColor, fontFamily: theme.fontFamily }}
                            >
                                <div
                                    className="w-16 h-16 rounded-xl mb-3 flex items-center justify-center text-2xl text-white shadow-sm"
                                    style={{ backgroundColor: theme.primaryColor }}
                                >
                                    🛍️
                                </div>
                                <h3
                                    className="font-bold mb-1"
                                    style={{ color: theme.textPrimary }}
                                >
                                    Sample Grocery Item
                                </h3>
                                <p
                                    className="text-xs mb-2"
                                    style={{ color: theme.textSecondary }}
                                >
                                    Fresh Farm Vegetables
                                </p>
                                <div className="flex gap-2 items-center">
                                    <span
                                        className="font-bold text-lg"
                                        style={{ color: theme.primaryColor }}
                                    >
                                        ৳240
                                    </span>
                                    <span
                                        className="text-xs line-through"
                                        style={{ color: theme.textMuted }}
                                    >
                                        ৳300
                                    </span>
                                </div>
                            </div>

                            {/* Preview Buttons */}
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    className="w-full py-2.5 rounded-xl text-white font-bold text-sm shadow-sm transition active:scale-95"
                                    style={{ backgroundColor: theme.primaryColor }}
                                >
                                    Primary Button (Add to Cart)
                                </button>
                                <button
                                    type="button"
                                    className="w-full py-2.5 rounded-xl text-white font-bold text-sm shadow-sm transition active:scale-95"
                                    style={{ backgroundColor: theme.secondaryColor }}
                                >
                                    Secondary Button
                                </button>
                                <button
                                    type="button"
                                    className="w-full py-2.5 rounded-xl text-white font-bold text-sm shadow-sm transition active:scale-95"
                                    style={{ backgroundColor: theme.accentColor }}
                                >
                                    Accent Button (Buy Now)
                                </button>
                            </div>

                            {/* Status Colors */}
                            <div className="mt-6 flex flex-wrap gap-2">
                                <span
                                    className="px-3 py-1 rounded-lg text-white text-xs font-semibold"
                                    style={{ backgroundColor: theme.successColor }}
                                >
                                    In Stock
                                </span>
                                <span
                                    className="px-3 py-1 rounded-lg text-white text-xs font-semibold"
                                    style={{ backgroundColor: theme.warningColor }}
                                >
                                    Low Stock
                                </span>
                                <span
                                    className="px-3 py-1 rounded-lg text-white text-xs font-semibold"
                                    style={{ backgroundColor: theme.errorColor }}
                                >
                                    Out of Stock
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThemeEditor;
