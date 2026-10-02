'use client'

import Link from "next/link";
import { ArrowRight, Check, Sparkles, ShieldCheck } from "lucide-react";
import { Show } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { DashboardPreview } from "./dashboard-preview";
import { heroBenefits } from "@/config/landing-content";

const springTransition = {
  type: "spring" as const,
  stiffness: 163,
  damping: 40,
  mass: 1,
};

const wordVariants = {
  hidden: { opacity: 0, scale: 0.94, filter: "blur(10px)", y: 14 },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    y: 0,
    transition: springTransition,
  },
};

const containerVariants = (stagger: number, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

const fadeUpVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: springTransition,
  },
};

export function HeroSection() {
  const headlineWords = ["Your", "money.", "Your", "clarity."];
  const subtitleText =
    "Finvoro brings your transactions, intelligent budgets, real-time spending insights, and financial reports together in one beautifully simple workspace.";

  return (
    <section className="relative isolate overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover opacity-80 dark:opacity-35"
        >
          <source src="/clouds.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-linear-to-b from-background/20 via-background/60 to-background" />
      </div>

      <motion.div
        className="absolute top-1/4 left-1/2 -z-10 h-72 w-72 sm:h-96 sm:w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-40 sm:pt-44 lg:px-8 lg:pb-48">
        <div className="mx-auto max-w-4xl text-center">
         
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.9, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={springTransition}
            className="mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/75 px-3 py-1.5 text-xs 
            font-medium text-foreground/80 shadow-sm shadow-primary/5 backdrop-blur-xl"
          >
            <motion.span
              animate={{ rotate: [0, 15, -10, 0] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
              className="flex size-5 items-center justify-center rounded-full bg-primary/10"
            >
              <Sparkles className="size-3 text-primary" />
            </motion.span>

            <span className="whitespace-nowrap">
              A simpler way to manage your money
            </span>

            <span className="mx-0.5 h-3 w-px bg-border" />

            <span className="flex items-center gap-1.5 text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" />
              <span>Secure</span>
            </span>
          </motion.div>

          <motion.h1
            variants={containerVariants(0.1, 0.05)}
            initial="hidden"
            animate="visible"
            className="text-balance text-3xl font-extrabold font-heading tracking-tight sm:text-6xl lg:text-7xl flex flex-wrap justify-center gap-x-2 sm:gap-x-3"
          >
            {headlineWords.map((word, index) => {
              const isHighlighted = index >= 2;
              return (
                <motion.span
                  key={index}
                  variants={wordVariants}
                  className={
                    isHighlighted
                      ? "bg-linear-to-r from-primary via-primary/70 to-primary/60 bg-clip-text text-transparent inline-block bg-size-[200%_auto]"
                      : "inline-block"
                  }
                  {...(isHighlighted && {
                    animate: {
                      backgroundPosition: ["0% center", "100% center", "0% center"],
                    },
                    transition: {
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  })}
                >
                  {word}
                </motion.span>
              );
            })}
          </motion.h1>

          <motion.p
            variants={containerVariants(0.03, 0.35)}
            initial="hidden"
            animate="visible"
            className="mx-auto mt-4 sm:mt-6 max-w-2xl text-pretty text-base sm:text-lg leading-relaxed text-foreground/80 flex flex-wrap justify-center gap-x-1.5 px-2 sm:px-0"
          >
            {subtitleText.split(" ").map((word, index) => (
              <motion.span key={index} variants={wordVariants} className="inline-block">
                {word}
              </motion.span>
            ))}
          </motion.p>

          <motion.div
            variants={containerVariants(0.1, 0.9)}
            initial="hidden"
            animate="visible"
            className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 w-full px-4 sm:px-0"
          >
            <Show when="signed-out">
              <motion.div variants={fadeUpVariants} className="w-full sm:w-auto">
                <Link
                  href="/sign-up"
                  className="group inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-colors hover:bg-primary/90"
                >
                  Get started free
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </Show>

            <Show when="signed-in">
              <motion.div variants={fadeUpVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Link
                  href="/dashboard"
                  className="group inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-colors hover:bg-primary/90"
                >
                  Go to Dashboard
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </Show>

            <motion.div variants={fadeUpVariants} className="w-full sm:w-auto">
              <Link
                href="#features"
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-xl border border-border/80 bg-background/80 px-8 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-muted hover:text-foreground"
              >
                Explore features
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={containerVariants(0.08, 1.1)}
            initial="hidden"
            animate="visible"
            className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-2.5 sm:gap-y-3 px-2"
          >
            {heroBenefits.map((benefit) => (
              <motion.div
                key={benefit}
                variants={fadeUpVariants}
                className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ ...springTransition, delay: 1.2 }}
                  className="flex size-4 sm:size-5 items-center justify-center rounded-full bg-primary/10 text-foreground/80 shrink-0"
                >
                  <Check className="size-2.5 sm:size-3 stroke-[2.5]" />
                </motion.span>
                <span>{benefit}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ ...springTransition, delay: 1.3 }}
          className="mt-10 sm:mt-20 -mb-16 sm:-mb-36 lg:-mb-62"
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}