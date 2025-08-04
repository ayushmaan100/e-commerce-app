"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

type ProductImageGalleryProps = {
  images: string[];
  productName: string;
};

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Go to the selected image when thumbnail is clicked
  const onThumbClick = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  // Sync main image with carousel
  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Fallback if no images provided
  if (images.length === 0) {
    images.push("https://placehold.co/600x600/EEE/31343C?text=Photo");
  }

  return (
    <div className="space-y-4">
      {/* Main image carousel */}
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent className="relative aspect-square">
                  <Image
                    src={src}
                    alt={`${productName} - image ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                    priority={index === 0}
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Thumbnail row */}
      <div className="grid grid-cols-5 gap-4">
        {images.map((src, index) => (
          <button
            key={index}
            onClick={() => onThumbClick(index)}
            className={`relative aspect-square rounded-lg overflow-hidden outline-none ring-offset-2 focus:ring-2 ${
              index === current ? "ring-2 ring-primary" : ""
            }`}
          >
            <Image
              src={src}
              alt={`${productName} - thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}