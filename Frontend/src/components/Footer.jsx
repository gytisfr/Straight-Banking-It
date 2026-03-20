import { Link } from "react-router-dom";
import ShapeBlur from './ShapeBlur';
import { motion } from "framer-motion";

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    },
  },
};

// New fade-in variant for About section
const aboutVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
  },
};

const Footer = () => {
  return (
    <footer className="w-full bg-white text-slate-900 relative z-50">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">

        {/* Section 1 - About */}
        <div>
          <h2 className="text-xl font-bold mb-3">About Team4 Banking</h2>
          <motion.p
            className="text-black font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: false, amount: 0.5 }}
          >
            Team4 Banking is dedicated to helping you manage your finances smarter while building a secure and reliable banking experience. Join us in shaping a more efficient and user-friendly future for banking!
          </motion.p>
        </div>

        {/* Section 2 - Quick Links */}
        <div>
          <div className="flex justify-end">
            <h2 className="text-xl mr-auto font-bold mb-3">Quick Links</h2>
            <div className="flex justify-end h-10 overflow-hidden">
              <div className="w-10 h-10">
                <ShapeBlur variation={0} pixelRatioProp={window.devicePixelRatio || 1} shapeSize={1} roundness={0.5} borderSize={0.125} circleSize={0.25} circleEdge={1}/>
              </div>
              <div className="w-10 h-10">
                <ShapeBlur variation={0} pixelRatioProp={window.devicePixelRatio || 1} shapeSize={1} roundness={0.5} borderSize={0.125} circleSize={0.25} circleEdge={1}/>
              </div>
              <div className="w-10 h-10">
                <ShapeBlur variation={0} pixelRatioProp={window.devicePixelRatio || 1} shapeSize={1} roundness={0.5} borderSize={0.125} circleSize={0.25} circleEdge={1}/>
              </div>
            </div>
          </div>
          <motion.ul
            className="text-black font-medium space-y-0.5 "
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            variants={listVariants}
          >
            <motion.li variants={itemVariants}>
              <Link to="/" className="hover:opacity-50">Home</Link>
            </motion.li>
            <motion.li variants={itemVariants}>
              <Link to="/withdraw" className="hover:opacity-50">Withdraw</Link>
            </motion.li>
            <motion.li variants={itemVariants}>
              <Link to="/deposit" className="hover:opacity-50">Deposit</Link>
            </motion.li>
            <motion.li variants={itemVariants}>
              <Link to="/newpayment" className="hover:opacity-50">New Payment</Link>
            </motion.li>
          </motion.ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-slate-900 text-slate-100 text-center py-4">
        &copy; {new Date().getFullYear()} Team4 Banking. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
