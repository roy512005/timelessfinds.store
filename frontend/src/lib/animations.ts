export const psychologyVariants = {
    fadeIn: {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    },
    staggerContainer: {
        animate: { transition: { staggerChildren: 0.1 } },
    },
    pulse: {
        animate: {
            scale: [1, 1.05, 1],
            transition: { repeat: Infinity, duration: 2 },
        },
    },
    shake: {
        animate: {
            x: [-5, 5, -5, 5, 0],
            transition: { duration: 0.4 },
        },
    },
    slideInRight: {
        initial: { x: 50, opacity: 0 },
        animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
    },
};
