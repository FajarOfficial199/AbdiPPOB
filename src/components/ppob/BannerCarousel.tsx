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

export function BannerCarousel() {
  const [mounted, setMounted] = React.useState(false);
  
  const autoplayPlugin = React.useMemo(
    () => Autoplay({ delay: 4000, stopOnInteraction: true }),
    []
  );

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const banners = PlaceHolderImages.filter(img => img.id.startsWith('banner-'));

  if (!mounted) {
    return (
      <div className="w-full px-4 py-6 md:py-10">
        <div className="mx-auto max-w-6xl aspect-[3/1] bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6 md:py-10">
      <Carousel
        plugins={[autoplayPlugin]}
        className="mx-auto max-w-6xl overflow-hidden rounded-2xl shadow-xl border"
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className="relative aspect-[3/1] w-full overflow-hidden">
                <Image
                  src={banner.imageUrl}
                  alt={banner.description}
                  fill
                  priority
                  className="object-cover"
                  data-ai-hint={banner.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-10 md:px-20 text-white">
                  <h2 className="text-2xl md:text-4xl font-bold mb-2">{banner.description}</h2>
                  <p className="text-sm md:text-lg opacity-90">Dapatkan harga termurah dan proses tercepat hanya di Abdi Pratama PPOB.</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
