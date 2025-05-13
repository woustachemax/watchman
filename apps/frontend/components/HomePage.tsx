// "use client";
// import { Button } from "@/components/ui/button";
// import { ArrowRight } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { SignUp } from "@clerk/nextjs"; 
// import { motion } from "framer-motion"; 
// import { useRouter } from "next/navigation";

// export function HomePage() {
//     const router = useRouter()
//   return (
//     <section className="relative pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden">
//       <motion.div
//         className="absolute inset-0 -z-10 overflow-hidden"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1 }}
//       >
//         <motion.div
//           className="absolute top-0 left-1/3 w-80 h-80 bg-chart-1/20 rounded-full blur-[100px]"
//           initial={{ x: -50, y: -50 }}
//           animate={{ x: 0, y: 0 }}
//           transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
//         />
//         <motion.div
//           className="absolute bottom-0 right-1/4 w-72 h-72 bg-chart-2/20 rounded-full blur-[100px]"
//           initial={{ x: 50, y: 50 }}
//           animate={{ x: 0, y: 0 }}
//           transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
//         />
//       </motion.div>

//       <div className="container px-4 sm:px-6 mx-auto">
//         <motion.div
//           className="flex flex-col items-center text-center mb-12 md:mb-16"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//         >
//           <Badge
//             variant="outline"
//             className="mb-4 px-4 py-1 border-primary/30 bg-primary/10"
//           >
//             Next-Gen Uptime Monitoring
//           </Badge>
//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 max-w-4xl">
//             <span className="text-primary">Monitor</span> Your Website.{" "}
//             <span className="text-primary">Earn</span> Rewards.
//           </h1>
//           <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
//             A decentralized platform where real users monitor your website and
//             earn crypto bounties for reporting outages, ensuring reliable uptime
//             and valuable insights.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 mb-12">
//             <Button size="lg" variant="outline" className=" hover:bg-white hover:text-black" onClick={()=>router.push('/')}> Get Started </Button>
//             <Button size="lg" variant="outline" className=" hover:bg-white hover:text-black"> Learn More </Button>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-4xl mx-auto mt-8">
//             <motion.div
//               className="flex flex-col items-center"
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5, delay: 0.4 }}
//             >
//               <p className="text-3xl font-bold text-primary">99.99%</p>
//               <p className="text-sm text-muted-foreground">Uptime Accuracy</p>
//             </motion.div>
//             <motion.div
//               className="flex flex-col items-center"
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5, delay: 0.6 }}
//             >
//               <p className="text-3xl font-bold text-primary">10K+</p>
//               <p className="text-sm text-muted-foreground">Active Monitors</p>
//             </motion.div>
//             <motion.div
//               className="flex flex-col items-center"
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5, delay: 0.8 }}
//             >
//               <p className="text-3xl font-bold text-primary">5s</p>
//               <p className="text-sm text-muted-foreground">Average Alert Time</p>
//             </motion.div>
//             <motion.div
//               className="flex flex-col items-center"
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5, delay: 1.0 }}
//             >
//               <p className="text-3xl font-bold text-primary">50K+</p>
//               <p className="text-sm text-muted-foreground">Websites Protected</p>
//             </motion.div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }