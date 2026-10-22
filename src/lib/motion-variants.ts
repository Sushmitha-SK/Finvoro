
import type { Variants, Transition } from "framer-motion";

//Hero section

export const springTransition: Transition = {
    type: "spring",
    stiffness: 163,
    damping: 40,
    mass: 1,
};

export const wordVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.94,
        filter: "blur(10px)",
        y: 14,
    },
    visible: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        y: 0,
        transition: springTransition,
    },
};

export const fadeUpVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 16,
        filter: "blur(6px)",
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: springTransition,
    },
};

export const containerVariants = (
    stagger: number,
    delayChildren = 0,
): Variants => ({
    hidden: {},
    visible: {
        transition: {
            staggerChildren: stagger,
            delayChildren,
        },
    },
});

const reducedMotionWordVariants: Variants = {
    hidden: { opacity: 1, scale: 1, filter: "blur(0px)", y: 0 },
    visible: { opacity: 1, scale: 1, filter: "blur(0px)", y: 0 },
};

const reducedMotionFadeVariants: Variants = {
    hidden: { opacity: 1, y: 0, filter: "blur(0px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const reducedMotionContainerVariants: Variants = {
    hidden: {},
    visible: {},
};

export function getAccessibleMotionVariants(reduceMotion: boolean) {
    return {
        word: reduceMotion ? reducedMotionWordVariants : wordVariants,
        fade: reduceMotion ? reducedMotionFadeVariants : fadeUpVariants,
        container: (stagger: number, delayChildren = 0) =>
            reduceMotion
                ? reducedMotionContainerVariants
                : containerVariants(stagger, delayChildren),
    };
}

//value-Strip

export const valueStripContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
        },
    },
};

export const valueStripItemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 80,
            damping: 18,
            mass: 0.9,
        },
    },
};


//Features
export const sectionAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export const cardAnimation = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

export const animationViewport = {
    once: true,
    margin: '-50px',
} as const;

//Product showcase
export const showcaseAnimation = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
};

//How it works
export const howItWorksContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

export const howItWorksItemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 150,
            damping: 30,
        },
    },
};

//Footer
export const footerContainerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export const footerItemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};