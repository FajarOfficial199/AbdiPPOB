"use client"
import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import { PlaceHolderImages } from "@/lib/placeholder-images"

export function PromoSlider() {
  const autoplayPlugin = React.useMemo(
    () => Autoplay({ delay: 5000, stopOnInteraction: true }),
    []
  );

  const banners = PlaceHolderImages.filter(img => img.id.startsWith('banner-'));

  return (
    <div className="w-full">
      <Carousel
        plugins={[autoplayPlugin]}
        className="w-full overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl"
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className="relative aspect-[21/9] md:aspect-[3/1] w-full group">
                <Image
                  src={banner.imageUrl}
                  alt={banner.description}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  data-ai-hint={banner.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12">
                  <div className="max-w-2xl space-y-2 translate-y-2 group-hover:translate-y-0 transition-transform">
                    <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white drop-shadow-lg">
                      {banner.description}
                    </h2>
                    <p className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-[0.3em]">
                      PROMO TERBATAS HARI INI
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
