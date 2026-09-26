// "use client";

// import { ThemeProvider as NextThemesProvider } from "next-themes";
// import type { ComponentProps } from "react";

// export function ThemeProvider(props: ComponentProps<typeof NextThemesProvider>) {
//     return <NextThemesProvider {...props} />;
// }


"use client";

import type { ComponentProps } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Suppress React 19 false-positive warning for the next-themes inline script tag
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    const originalConsoleError = console.error;
    console.error = (...args: unknown[]) => {
        if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) {
            return;
        }
        originalConsoleError.apply(console, args);
    };
}

export function ThemeProvider(props: ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props} />;
}