import { describe, expect, it } from "vitest";

import { escapeCsvValue, toCsv } from "./csv";

describe("csv", () => {
    it("quotes values with commas, quotes and newlines", () => {
        expect(escapeCsvValue('a,"b"')).toBe('"a,""b"""');
        expect(escapeCsvValue("line1\nline2")).toBe('"line1\nline2"');
    });

    it("neutralises spreadsheet formula injection in text cells", () => {
        expect(escapeCsvValue("=HYPERLINK(\"http://evil\")")).toMatch(/^"?'=/);
        expect(escapeCsvValue("+1+1")).toBe("'+1+1");
        expect(escapeCsvValue("@SUM(A1)")).toBe("'@SUM(A1)");
        expect(escapeCsvValue("-2+3")).toBe("'-2+3");
    });

    it("leaves genuine negative numbers alone", () => {
        expect(escapeCsvValue(-42.5)).toBe("-42.5");
    });

    it("builds rows", () => {
        expect(toCsv(["a", "b"], [[1, "x,y"]])).toBe('a,b\n1,"x,y"');
    });
});
