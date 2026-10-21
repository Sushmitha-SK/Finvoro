export function escapeCsvValue(value: string | number | null | undefined) {
    let text = value === null || value === undefined ? "" : String(value);

    if (typeof value === "string" && /^[=+\-@\t\r]/.test(text)) {
        text = `'${text}`;
    }

    if (/[",\n\r]/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`;
    }

    return text;
}

export function toCsv(
    headers: string[],
    rows: Array<Array<string | number | null | undefined>>,
) {
    return [headers, ...rows]
        .map((row) => row.map(escapeCsvValue).join(","))
        .join("\n");
}

export function csvResponse(csv: string, filename: string) {
    return new Response(`\uFEFF${csv}`, {
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Cache-Control": "no-store",
        },
    });
}
