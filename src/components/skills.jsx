'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { skills } from '@/data/portfolio';
import { Award, Cloud, Code, Cpu, PenTool, Search, Sparkles, Users } from 'lucide-react';

const ICONS = {
  code: Code,
  cpu: Cpu,
  pen: PenTool,
  users: Users,
  sparkles: Sparkles,
  search: Search,
  cloud: Cloud,
  award: Award,
};

const Skills = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="mx-auto w-full max-w-5xl rounded-4xl"
    >
      <Card className="w-full border-none px-0 pb-12 shadow-none">
        <CardHeader className="px-0 pb-1">
          <CardTitle className="text-primary px-0 text-4xl font-bold">
            Skills & Expertise
          </CardTitle>
        </CardHeader>

        <CardContent className="px-0">
          <motion.div
            className="space-y-8 px-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {skills.map((section, index) => {
              const Icon = ICONS[section.icon];
              return (
                <motion.div
                  key={index}
                  className="space-y-3 px-0"
                  variants={itemVariants}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <h3 className="text-accent-foreground text-lg font-semibold">
                      {section.category}
                    </h3>
                  </div>

                  <motion.div
                    className="flex flex-wrap gap-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {section.items.map((skill, idx) => (
                      <motion.div
                        key={idx}
                        variants={badgeVariants}
                        whileHover={{
                          scale: 1.04,
                          transition: { duration: 0.2 },
                        }}
                      >
                        <Badge className={`border px-3 py-1.5 font-normal`}>
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Skills;
