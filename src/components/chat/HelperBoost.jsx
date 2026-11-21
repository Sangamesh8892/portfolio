import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { motion } from 'framer-motion';
import {
  Award,
  Bot,
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleEllipsis,
  CodeIcon,
  GraduationCapIcon,
  Laugh,
  Layers,
  MailIcon,
  PartyPopper,
  Sparkles,
  UserRoundSearch,
  UserSearch,
} from 'lucide-react';
import { useState } from 'react';
import { Drawer } from 'vaul';
import { questionDrawer, quickQuestions } from '@/data/portfolio';

const ICONS = {
  laugh: Laugh,
  briefcase: BriefcaseBusiness,
  layers: Layers,
  party: PartyPopper,
  'user-search': UserRoundSearch,
  user: UserSearch,
  code: CodeIcon,
  graduation: GraduationCapIcon,
  mail: MailIcon,
  bot: Bot,
  award: Award,
};

const specialQuestions = questionDrawer.highlighted;

// Animated Chevron component
const AnimatedChevron = () => {
  return (
    <motion.div
      animate={{
        y: [0, -4, 0], // Subtle up and down motion
      }}
      transition={{
        duration: 1.5,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'loop',
      }}
      className="text-primary mb-1.5"
    >
      <ChevronUp size={16} />
    </motion.div>
  );
};

export default function HelperBoost({ submitQuery, defaultOpen = false }) {
  const [isVisible, setIsVisible] = useState(true);
  const [open, setOpen] = useState(defaultOpen);

  const handleQuestionClick = (question, answerId) => {
    submitQuery?.(question, answerId);
  };

  const handleDrawerQuestionClick = (question) => {
    if (submitQuery) {
      submitQuery(question);
    }
    setOpen(false);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <Drawer.Root open={open} onOpenChange={setOpen}>
        <div className="w-full">
          {/* Toggle Button */}
          <div
            className={
              isVisible
                ? 'mb-2 flex justify-center'
                : 'mb-0 flex justify-center'
            }
          >
            <button
              onClick={toggleVisibility}
              className="flex items-center gap-1 px-3 py-1 text-xs text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
            >
              {isVisible ? (
                <>
                  <ChevronDown size={14} />
                  Hide quick questions
                </>
              ) : (
                <>
                  <ChevronUp size={14} />
                  Show quick questions
                </>
              )}
            </button>
          </div>

          {/* HelperBoost Content */}
          {isVisible && (
            <div className="w-full">
              <div
                className="flex w-full flex-wrap gap-1 md:gap-3"
                style={{ justifyContent: 'safe center' }}
              >
                {quickQuestions.map(
                  ({ label, answerId, question, color, icon }) => {
                    const Icon = ICONS[icon];
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => handleQuestionClick(question, answerId)}
                        className="chip glass h-auto min-w-[100px] flex-shrink-0 px-4 py-3"
                      >
                        <span className="flex items-center gap-3">
                          <Icon size={18} strokeWidth={2} color={color} />
                          <span className="text-sm font-medium">{label}</span>
                        </span>
                      </button>
                    );
                  }
                )}

                {/* Need Inspiration Button */}
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Drawer.Trigger
                        className="group relative flex flex-shrink-0 items-center justify-center"
                        aria-label="More questions"
                      >
                        <motion.div
                          className="chip glass flex h-auto items-center px-4 py-3 text-sm"
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <CircleEllipsis
                              className="h-[20px] w-[18px]"
                              //style={{ color: '#3B82F6' }}
                              strokeWidth={2}
                            />
                            {/*<span className="text-sm font-medium">More</span>*/}
                          </div>
                        </motion.div>
                      </Drawer.Trigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <AnimatedChevron />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Content */}
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-100 bg-black/60 backdrop-blur-xs" />
          <Drawer.Content className="bg-background fixed right-0 bottom-0 left-0 z-100 mt-24 flex h-[80%] flex-col rounded-t-[20px] outline-none lg:h-[60%]">
            <div className="bg-background flex-1 overflow-y-auto rounded-t-[20px] p-4">
              <div className="mx-auto max-w-md space-y-4">
                <div
                  aria-hidden
                  className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-[var(--ink-soft)] opacity-40"
                />
                <div className="mx-auto w-full max-w-md">
                  <div className="space-y-8 pb-16">
                    {questionDrawer.categories.map((category) => (
                      <CategorySection
                        key={category.id}
                        name={category.name}
                        Icon={ICONS[category.icon]}
                        questions={category.questions}
                        onQuestionClick={handleDrawerQuestionClick}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}

function CategorySection({ name, Icon, questions, onQuestionClick }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5 px-1">
        <Icon className="h-5 w-5" />
        <Drawer.Title className="text-foreground text-[22px] font-medium">
          {name}
        </Drawer.Title>
      </div>

      <Separator className="my-4" />

      <div className="space-y-3">
        {questions.map((question, index) => (
          <QuestionItem
            key={index}
            question={question}
            onClick={() => onQuestionClick(question)}
            isSpecial={specialQuestions.includes(question)}
          />
        ))}
      </div>
    </div>
  );
}

function QuestionItem({ question, onClick, isSpecial }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className={cn(
        'flex w-full items-center justify-between rounded-[10px]',
        'text-md px-6 py-4 text-left font-normal',
        'transition-all',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        isSpecial
          ? 'bg-[var(--ink)] text-[var(--bg)]'
          : 'bg-[var(--hover-bg)] hover:bg-[color-mix(in_oklab,var(--ink)_10%,transparent)]'
      )}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center">
        {isSpecial && <Sparkles className="mr-2 h-4 w-4" />}
        <span className={isSpecial ? 'font-medium' : ''}>
          {question}
        </span>
      </div>
      <motion.div
        animate={{ x: isHovered ? 4 : 0 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
      >
        <ChevronRight
          className={cn(
            'h-5 w-5 shrink-0',
            isSpecial ? 'text-[var(--bg)]' : 'text-[var(--em)]'
          )}
        />
      </motion.div>
    </motion.button>
  );
}
