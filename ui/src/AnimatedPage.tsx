import { motion } from "framer-motion";
import { ReactNode } from "react";

const animations = {
    initial: {opacity: 0, x: 100},
    animate: {opacity: 1, x: 0},
    exit: {opacity: 0, x: -100}
}

interface Props {
    children?: ReactNode
}

export function AnimatedPage({children}: Props) {
    return (
        <motion.div
            variants={animations}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{duration: 1}}
        >
            {children}
        </motion.div>
    )
}