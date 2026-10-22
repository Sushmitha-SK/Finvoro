"use client";

import { motion, MotionConfig } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Show, useClerk } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import assets from "@/assets/assets";

export function FinalCTA() {
  const clerk = useClerk();

  return (
    <section
      aria-labelledby="final-cta-heading"
      className="relative isolate overflow-hidden bg-muted/30"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <Image
          src={assets.heroBackground.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-25"
        />

        <div className="absolute inset-0 bg-linear-to-b from-background/5 via-background/20 to-background/30" />
      </div>

      <MotionConfig reducedMotion="user">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative z-10 mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:py-28"
        >
          <div className="mx-auto flex size-12 items-center justify-center">
            <Image
              src={assets.logoIcon.src}
              alt="Finvoro logo"
              width={40}
              height={40}
              sizes="40px"
              className="size-10 object-contain"
            />
          </div>

          <h2
            id="final-cta-heading"
            className="mx-auto mt-6 max-w-3xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-5xl lg:leading-[1.08]"
          >
            A clearer picture of your money starts here.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground">
            Track your spending, plan your budgets, and understand
            your financial habits with Finvoro.
          </p>

          <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Show when="signed-out">
              <Button
                type="button"
                onClick={() => clerk.openSignUp()}
                className="group h-12 w-full gap-1.5 rounded-xl px-6 text-sm font-medium shadow-lg transition-opacity hover:opacity-95 sm:w-auto"
              >
                Get started for free
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 h-12 gap-2 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none"
                />
              </Button>


              <Button
                type="button"
                variant="outline"
                onClick={() => clerk.openSignIn()}
                className="h-11 w-full rounded-lg border-border/80 bg-background/80 px-6 text-sm font-medium shadow-sm backdrop-blur-sm transition-colors hover:bg-muted sm:w-auto"
              >
                Sign in
              </Button>
            </Show>


            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-lg transition-opacity hover:opacity-95 sm:w-auto"
              >
                Go to Dashboard
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none"
                />
              </Link>
            </Show>

          </div>

          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            No complicated setup. Start organizing your finances today.
          </p>
        </motion.div>
      </MotionConfig>
    </section>
  );
}
