import { ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Baby } from '@/lib/types';
import { getTimeBasedTheme } from '@/lib/utils';
import { useScrollDirection } from '@/lib/hooks/useScrollDirection';

interface HomeHeroProps {
  baby: Baby | null;
  ageLabel: string;
  onBabySelectorOpen: () => void;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((segment) => segment[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

export function HomeHero({ baby, ageLabel, onBabySelectorOpen }: HomeHeroProps) {
  const { gradient, textColor } = getTimeBasedTheme();
  const scrollDirection = useScrollDirection();

  const isScrolledDown = scrollDirection === 'down';

  // Placeholder para a narrativa da IA
  const aiNarrative =
    'Hoje o dia está perfeito para uma soneca gostosa à tarde, depois de muitas brincadeiras e descobertas.';

  const isDarkText = textColor === 'text-gray-800';

  return (
    <motion.div
      animate={{ height: isScrolledDown ? 80 : 250 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`relative rounded-b-[2.5rem] shadow-lg -mx-4 mb-6 overflow-hidden bg-gradient-to-br ${gradient} ${textColor}`}
    >
      <div
        className={`relative z-10 p-6 transition-padding duration-300 ${
          isScrolledDown ? 'pt-3' : 'pt-12'
        }`}
      >
        <motion.button
          onClick={onBabySelectorOpen}
          className="flex items-center gap-4 w-full text-left hover:opacity-90 transition-opacity"
        >
          <motion.div
            layout
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex items-center gap-4"
          >
            <Avatar
              className={`border-4 transition-all duration-300 ${
                isScrolledDown ? 'w-12 h-12' : 'w-20 h-20'
              } ${isDarkText ? 'border-black/10' : 'border-white/30'}`}
            >
              <AvatarImage src={baby?.avatar} alt={baby?.name ?? 'Bebê'} />
              <AvatarFallback
                className={`font-medium transition-all duration-300 ${
                  isScrolledDown ? 'text-lg' : 'text-2xl'
                } ${isDarkText ? 'bg-black/5' : 'bg-white/20'} ${textColor}`}
              >
                {baby ? getInitials(baby.name) : '?'}
              </AvatarFallback>
            </Avatar>
            <AnimatePresence>
              {isScrolledDown && (
                <motion.h2
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-lg font-bold"
                >
                  {baby?.name}
                </motion.h2>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="flex-1"
            animate={{ opacity: isScrolledDown ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-3xl font-bold tracking-tight">{baby?.name ?? 'Bebê atual'}</h1>
            <p className={`${isDarkText ? 'text-current/70' : 'text-white/80'} mt-1`}>
              {ageLabel}
            </p>
            <p className={`${isDarkText ? 'text-current/70' : 'text-white/80'} text-sm`}>
              {baby?.city}
            </p>
          </motion.div>

          <motion.div animate={{ opacity: isScrolledDown ? 0 : 1 }} transition={{ duration: 0.2 }}>
            <ChevronRight
              className={`w-6 h-6 ${isDarkText ? 'text-current/80' : 'text-white/80'}`}
            />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {!isScrolledDown && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="mt-6"
            >
              <p
                className={`${
                  isDarkText ? 'text-current/90' : 'text-white/90'
                } italic text-sm`}
              >
                "{aiNarrative}"
              </p>
              <p
                className={`${
                  isDarkText ? 'text-current/70' : 'text-white/70'
                } mt-4 text-xs`}
              >
                ✨ <strong>Novidade:</strong> Agora os capítulos podem ser personalizados!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
