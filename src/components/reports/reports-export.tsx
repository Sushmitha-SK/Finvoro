"use client";

import { Download } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(
        date.getMonth() + 1,
    ).padStart(2, "0");
    const day = String(
        date.getDate(),
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getCurrentMonthRange() {
    const now = new Date();

    return {
        from: new Date(
            now.getFullYear(),
            now.getMonth(),
            1,
        ),
        to: new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
        ),
    };
}

export function ReportsExport() {
    const searchParams =
        useSearchParams();

    const [isExporting, setIsExporting] =
        useState(false);

    const handleExport = async () => {
        setIsExporting(true);

        try {
            const params =
                new URLSearchParams(
                    searchParams.toString(),
                );

            let from = params.get("from");
            let to = params.get("to");

            if (!from || !to) {
                const range =
                    getCurrentMonthRange();

                from = formatDate(
                    range.from,
                );

                to = formatDate(
                    range.to,
                );
            }

            const exportParams =
                new URLSearchParams();

            exportParams.set(
                "from",
                from,
            );

            exportParams.set(
                "to",
                to,
            );

            const response =
                await fetch(
                    `/api/reports/export?${exportParams.toString()}`,
                );

            if (!response.ok) {
                throw new Error(
                    "Failed to export report.",
                );
            }

            const blob =
                await response.blob();

            const url =
                URL.createObjectURL(blob);

            const link =
                document.createElement(
                    "a",
                );

            link.href = url;

            link.download =
                `finvoro-report-${from}-to-${to}.csv`;

            document.body.appendChild(
                link,
            );

            link.click();

            link.remove();

            URL.revokeObjectURL(url);
        } catch (error) {
            console.error(
                "Report export failed:",
                error,
            );
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button
            type="button"
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
        >
            <Download />

            {isExporting
                ? "Exporting..."
                : "Export CSV"}
        </Button>
    );
}