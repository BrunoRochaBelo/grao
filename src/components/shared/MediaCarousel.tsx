import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '../ui/carousel';
import { cn } from '../ui/utils';

interface MediaCarouselProps {
  items: string[];
  className?: string;
  aspectRatioClass?: string;
  roundedClass?: string;
  onItemClick?: (index: number) => void;
  onSlideChange?: (index: number) => void;
  overlay?: (currentIndex: number) => React.ReactNode;
  hideIndicators?: boolean;
}

export function MediaCarousel({
  items,
  className,
  aspectRatioClass = 'aspect-[4/3]',
  roundedClass = 'rounded-2xl',
  onItemClick,
  onSlideChange,
  overlay,
  hideIndicators,
}: MediaCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!api) return;

    const updateCurrent = () => {
      const selectedIndex = api.selectedScrollSnap();
      setCurrentSlide(selectedIndex);
      onSlideChange?.(selectedIndex);
    };

    updateCurrent();
    api.on('select', updateCurrent);

    return () => {
      api.off('select', updateCurrent);
    };
  }, [api, onSlideChange]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="relative">
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            loop: items.length > 1,
          }}
          className="w-full"
        >
          <CarouselContent className="ml-0">
            {items.map((src, index) => (
              <CarouselItem key={`${src}-${index}`} className="pl-0">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={(event) => {
                    event.stopPropagation();
                    onItemClick?.(index);
                  }}
                  className={cn(
                    'relative block w-full overflow-hidden bg-muted',
                    aspectRatioClass,
                    roundedClass,
                  )}
                  aria-label={`Abrir mídia ${index + 1}`}
                >
                  <img
                    src={src}
                    alt={`Mídia ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </motion.button>
              </CarouselItem>
            ))}
          </CarouselContent>

          {items.length > 1 && (
            <>
              <CarouselPrevious className="left-3 top-1/2 -translate-y-1/2 border-none bg-black/40 text-white hover:bg-black/60" />
              <CarouselNext className="right-3 top-1/2 -translate-y-1/2 border-none bg-black/40 text-white hover:bg-black/60" />
            </>
          )}
        </Carousel>

        {overlay?.(currentSlide)}
      </div>

      {items.length > 1 && !hideIndicators && (
        <div className="flex justify-center gap-1.5">
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => api?.scrollTo(index)}
              className={cn(
                'h-2 rounded-full transition-all',
                index === currentSlide
                  ? 'w-6 bg-primary'
                  : 'w-2 bg-muted-foreground/40 hover:bg-muted-foreground/60',
              )}
              aria-label={`Ir para mídia ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
