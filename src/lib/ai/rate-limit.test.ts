import { beforeEach, describe, expect, it } from "vitest";

import { checkRateLimit, resetRateLimits } from "./rate-limit";

const bucket = { name: "t", limit: 3, windowMs: 1000 };

describe("checkRateLimit", () => {
    beforeEach(() => resetRateLimits());

    it("allows up to the limit then blocks with a retry hint", () => {
        for (let i = 0; i < 3; i += 1) {
            expect(checkRateLimit("u1", bucket, 1000 + i).allowed).toBe(true);
        }

        const blocked = checkRateLimit("u1", bucket, 1500);

        expect(blocked.allowed).toBe(false);
        expect(blocked).toHaveProperty("retryAfterSeconds");
    });

    it("recovers after the window slides", () => {
        for (let i = 0; i < 3; i += 1) checkRateLimit("u1", bucket, 1000);

        expect(checkRateLimit("u1", bucket, 2500).allowed).toBe(true);
    });

    it("isolates users and buckets", () => {
        for (let i = 0; i < 3; i += 1) checkRateLimit("u1", bucket, 1000);

        expect(checkRateLimit("u2", bucket, 1000).allowed).toBe(true);
        expect(checkRateLimit("u1", { ...bucket, name: "other" }, 1000).allowed).toBe(true);
    });
});
