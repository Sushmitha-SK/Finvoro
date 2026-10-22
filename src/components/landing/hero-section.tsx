"use client";

import Link from "next/link";
import { ArrowRight, Check, Sparkles, ShieldCheck, } from "lucide-react";
import { Show, useClerk } from "@clerk/nextjs";
import { motion, useReducedMotion, } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getAccessibleMotionVariants, springTransition, } from "@/lib/motion-variants";
import { DashboardPreview } from "./dashboard-preview";
import { heroBenefits } from "@/config/landing-content";
import { CloudShader } from "../ui/cloud-shader";

export function HeroSection() {
  const clerk = useClerk();
  const shouldReduceMotion = useReducedMotion() ?? false;

  const motionVariants =
    getAccessibleMotionVariants(shouldReduceMotion);

  const headlineWords = ["Your", "money.", "Your", "clarity."];

  const subtitleText =
    "Finvoro brings your transactions, intelligent budgets, real-time spending insights, and financial reports together in one beautifully simple workspace.";

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-background"
    >
      <div className="absolute inset-0 -z-10">
        <CloudShader className="absolute inset-0" />
        <div className="absolute inset-0 bg-linear-to-b from-background/20 via-background/60 to-background" />
      </div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl sm:h-96 sm:w-96"
        animate={
          shouldReduceMotion
            ? { scale: 1, opacity: 0.6 }
            : {
              scale: [1, 1.15, 1],
              opacity: [0.6, 0.9, 0.6],
            }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }
        } />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-40 sm:pt-44 lg:px-8 lg:pb-48">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                  opacity: 0,
                  y: -12,
                  scale: 0.9,
                  filter: "blur(8px)",
                }
            }
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
            }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : springTransition
            }
            className="mb-6 inline-flex max-w-full items-center gap-1.5 rounded-full border border-border/50 bg-muted/40 px-3 py-1.5 text-[11px] font-medium text-foreground shadow-sm backdrop-blur-md sm:mb-8 sm:mt-5 sm:gap-2.5 sm:px-3.5 sm:text-xs">
            <motion.span
              aria-hidden="true"
              animate={
                shouldReduceMotion
                  ? { rotate: 0 }
                  : { rotate: [0, 20, -10, 0] }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
              }
              className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm sm:size-5">
              <Sparkles className="size-2.5 sm:size-3" />
            </motion.span>

            <span className="truncate bg-linear-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text font-medium text-transparent">
              A simpler way to manage your money
            </span>

            <span aria-hidden="true" className="h-3 w-px shrink-0 bg-border" />

            <div className="flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary sm:px-2 sm:text-[11px]">
              <ShieldCheck aria-hidden="true" className="size-3" />
              <span>Secure</span>
            </div>
          </motion.div>

          <motion.h1
            id="hero-heading"
            variants={motionVariants.container(0.1, 0.05)}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-x-2 text-balance font-heading text-3xl font-extrabold tracking-tight sm:gap-x-3 sm:text-6xl lg:text-7xl">
            {headlineWords.map((word, index) => {
              const isHighlighted = index >= 2;

              return (
                <motion.span
                  key={`${word}-${index}`}
                  variants={motionVariants.word}
                  className="inline-block"
                >
                  {isHighlighted ? (
                    <motion.span
                      className="inline-block bg-linear-to-r from-primary via-primary/70 to-primary/60 bg-clip-text text-transparent bg-size-[200%_auto]"
                      animate={
                        shouldReduceMotion
                          ? {
                            backgroundPosition: "0% center",
                          }
                          : {
                            backgroundPosition: [
                              "0% center",
                              "100% center",
                              "0% center",
                            ],
                          }
                      }
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : {
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }
                      }
                    >
                      {word}
                    </motion.span>
                  ) : (
                    word
                  )}
                </motion.span>
              );
            })}
          </motion.h1>

          <motion.p
            variants={motionVariants.container(0.03, 0.35)}
            initial="hidden"
            animate="visible"
            className="mx-auto mt-4 flex max-w-2xl flex-wrap justify-center gap-x-1.5 px-2 text-pretty text-base leading-relaxed text-foreground/80 sm:mt-6 sm:px-0 sm:text-lg">
            {subtitleText.split(" ").map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                variants={motionVariants.word}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </motion.p>

          <motion.div
            variants={motionVariants.container(0.1, 0.9)}
            initial="hidden"
            animate="visible"
            className="mt-8 flex w-full flex-col items-center justify-center gap-3.5 px-4 sm:mt-10 sm:w-auto sm:flex-row sm:gap-4 sm:px-0">
            <Show when="signed-out">
              <motion.div
                variants={motionVariants.fade}
                className="w-full sm:w-auto">
                <Button
                  type="button"
                  onClick={() => clerk.openSignUp()}
                  className="group inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:w-auto motion-reduce:transition-none"
                >
                  Get started free
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                  />
                </Button>
              </motion.div>
            </Show>

            <Show when="signed-in">
              <motion.div
                variants={motionVariants.fade}
                whileTap={
                  shouldReduceMotion
                    ? undefined
                    : { scale: 0.97 }
                }
                className="w-full sm:w-auto">
                <Button
                  className="group inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:w-auto motion-reduce:transition-none">
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                    />
                  </Link>
                </Button>
              </motion.div>
            </Show>

            <motion.div
              variants={motionVariants.fade}
              className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-border/80 bg-background/80 px-8 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:w-auto motion-reduce:transition-none">
                <Link href="#features">
                  Explore features
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={motionVariants.container(0.08, 1.1)}
            initial="hidden"
            animate="visible"
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 px-2 sm:mt-10 sm:gap-x-8 sm:gap-y-3">
            {heroBenefits.map((benefit) => (
              <motion.div
                key={benefit}
                variants={motionVariants.fade}
                className="flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
                <motion.span
                  aria-hidden="true"
                  initial={
                    shouldReduceMotion
                      ? false
                      : { scale: 0 }
                  }
                  animate={{ scale: 1 }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : {
                        ...springTransition,
                        delay: 1.2,
                      }
                  }
                  className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-foreground/80 sm:size-5">
                  <Check className="size-2.5 stroke-[2.5] sm:size-3" />
                </motion.span>

                <span>{benefit}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                opacity: 0,
                y: 40,
                filter: "blur(10px)",
              }
          }
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                ...springTransition,
                delay: 1.3,
              }
          }
          className="mt-10 -mb-16 sm:mt-20 sm:-mb-36 lg:-mb-62">
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}
