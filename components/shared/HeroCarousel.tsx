"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

// 🔁 Replace with your real promotional images
const promoImages = [
  {
    src: "https://placehold.co/1200x500/A64942/FFFFFF?text=Summer+Sale",
    alt: "Summer Sale",
  },
  {
    src: "https://placehold.co/1200x500/31343C/FFFFFF?text=New+Arrivals",
    alt: "New Arrivals",
  },
  {
    src: "https://placehold.co/1200x500/D6A249/FFFFFF?text=Free+Shipping",
    alt: "Free Shipping",
  },
];

export function HeroCarousel() {
  return (
    <Carousel
      className="w-full"
      plugins={[Autoplay({ delay: 5000 })]} // Auto-play every 5 seconds
      opts={{ loop: true }}
    >
      <CarouselContent>
        {promoImages.map((promo, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="relative flex aspect-[2.4/1] items-center justify-center p-0">
                  <Image
                    src={promo.src}
                    alt={promo.alt}
                    fill
                    priority
                    className="object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Navigation Buttons */}
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
    </Carousel>
  );
}