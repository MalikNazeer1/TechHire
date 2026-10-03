"use client";

import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";

interface PageHeroProps {
  title: string;
  description: string;
}

export function PageHero({ title, description }: PageHeroProps) {
  return (
    <div className="bg-gradient-to-r from-blue-500/90 via-green-400/90 to-blue-500/90 py-20">
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{title}</h1>
          <Text className="text-xl text-white/90">
            {description}
          </Text>
        </div>
      </Container>
    </div>
  );
}