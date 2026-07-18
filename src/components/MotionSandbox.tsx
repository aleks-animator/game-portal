import { motion, stagger, type Variants  } from 'framer-motion'

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {  delayChildren: stagger(0.2),
            type: "spring",
            stiffness: 400,
            damping: 100,
            mass: 10}
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

function MotionSandbox() {


    return (
        <div>



            <motion.ul variants={containerVariants} initial="hidden" animate="visible">
                <motion.li variants={itemVariants}>Item 1</motion.li>
                <motion.li variants={itemVariants}>Item 2</motion.li>
                <motion.li variants={itemVariants}>Item 3</motion.li>
            </motion.ul>
        </div>
    )
}

export default MotionSandbox
