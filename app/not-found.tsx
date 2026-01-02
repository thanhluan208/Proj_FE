"use client";

import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import "./globals.css";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-background via-secondary-10 to-primary-10 dark:from-background dark:via-secondary-90 dark:to-primary-90 flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [-100, 100, -100],
            y: [-50, 50, -50],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-2xl w-full"
      >
        {/* Glass card */}
        <div className="bg-card/80 dark:bg-card/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 p-8 md:p-12">
          {/* 404 Number with gradient */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-6"
          >
            <h1 className="text-8xl md:text-9xl font-bold bg-linear-to-r from-primary via-primary-60 to-secondary bg-clip-text text-transparent leading-none">
              404
            </h1>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-64 h-64"
            >
              <Image
                src="/images/not-found.png"
                alt="404 Not Found"
                width={256}
                height={256}
                className="w-full h-full object-contain drop-shadow-2xl"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center space-y-4 mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Page Not Found
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Oops! The page you're looking for seems to have wandered off.
              Let's get you back on track.
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              asChild
              size="lg"
              className="group relative overflow-hidden bg-linear-to-r from-primary to-primary-60 hover:from-primary-60 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </Button>
          </motion.div>

          {/* Additional help text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 pt-8 border-t border-border/50 text-center"
          >
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Search className="w-4 h-4" />
              <span>
                If you believe this is an error, please contact support
              </span>
            </p>
          </motion.div>
        </div>

        {/* Floating decorative elements */}
        <motion.div
          className="absolute -top-4 -right-4 w-24 h-24 bg-linear-to-br from-primary to-primary-60 rounded-2xl opacity-20 blur-xl"
          animate={{
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-4 -left-4 w-32 h-32 bg-linear-to-br from-secondary to-secondary-60 rounded-2xl opacity-20 blur-xl"
          animate={{
            rotate: [360, 180, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>
    </div>
  );
}
