'use client';

import type { ReactElement } from "react";
import Image from "next/image";

// Technologies with working logos - for marquee animation
const technologies = [
  { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg' },
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
  { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
  { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
  { name: 'Supabase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg' },
  { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' },
  { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
  { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg' },
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
  { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
  { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
  { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg' },
  { name: 'Redis', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg' },
  { name: 'GraphQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/graphql/graphql-plain.svg' },
  { name: 'Prisma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg' },
  { name: 'Linux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg' },
  { name: 'Nginx', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nginx/nginx-original.svg' },
  { name: 'Jest', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jest/jest-plain.svg' },
] as const;

type TechnologiesMarqueeProps = {
  readonly direction?: 'left' | 'right';
};

export function TechnologiesMarquee({ direction = 'left' }: TechnologiesMarqueeProps): ReactElement {
  const animationClass = direction === 'right' ? 'animate-marquee-reverse' : 'animate-marquee';
  const flexDirection = direction === 'right' ? 'flex-row-reverse' : 'flex-row';
  
  return (
    <div className="relative w-full overflow-hidden py-6 border-t border-border/60">
      <div className={`flex ${flexDirection} ${animationClass} gap-8 w-fit`}>
        {/* First set */}
        {technologies.map((tech, i) => (
          <div
            key={`first-${i}`}
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface/80 px-6 py-4 shadow-soft flex-shrink-0"
          >
            <div className="relative w-6 h-6 flex-shrink-0 flex items-center justify-center">
              <Image
                src={tech.icon}
                alt={`${tech.name} logo`}
                width={24}
                height={24}
                className="object-contain"
                loading="lazy"
              />
            </div>
            <span className="text-sm font-medium text-foreground whitespace-nowrap">
              {tech.name}
            </span>
          </div>
        ))}
        {/* Second set for seamless loop */}
        {technologies.map((tech, i) => (
          <div
            key={`second-${i}`}
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface/80 px-6 py-4 shadow-soft flex-shrink-0"
          >
            <div className="relative w-6 h-6 flex-shrink-0 flex items-center justify-center">
              <Image
                src={tech.icon}
                alt={`${tech.name} logo`}
                width={24}
                height={24}
                className="object-contain"
                loading="lazy"
              />
            </div>
            <span className="text-sm font-medium text-foreground whitespace-nowrap">
              {tech.name}
            </span>
          </div>
        ))}
        {/* Third set for extra smooth continuous flow */}
        {technologies.map((tech, i) => (
          <div
            key={`third-${i}`}
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface/80 px-6 py-4 shadow-soft flex-shrink-0"
          >
            <div className="relative w-6 h-6 flex-shrink-0 flex items-center justify-center">
              <Image
                src={tech.icon}
                alt={`${tech.name} logo`}
                width={24}
                height={24}
                className="object-contain"
                loading="lazy"
              />
            </div>
            <span className="text-sm font-medium text-foreground whitespace-nowrap">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

