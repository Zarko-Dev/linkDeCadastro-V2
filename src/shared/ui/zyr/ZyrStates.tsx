'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';

import zyr404 from '../../../../assets/zyr_404.png';
import zyrConfused from '../../../../assets/zyr_confused.png';
import zyrTips from '../../../../assets/zyr_tips.png';

type ZyrTone = 'hint' | 'empty' | 'error';

type BaseZyrCardProps = {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
};

type ZyrHintProps = BaseZyrCardProps & {
  tips?: string[];
};

type ZyrEmptyStateProps = BaseZyrCardProps & {
  action?: ReactNode;
};

type ZyrErrorStateProps = BaseZyrCardProps & {
  action?: ReactNode;
};

const toneMap = {
  hint: {
    className: 'zyr-card zyr-card-hint',
    image: zyrTips,
    alt: 'Zyr oferecendo uma dica',
  },
  empty: {
    className: 'zyr-card zyr-card-empty',
    image: zyrConfused,
    alt: 'Zyr em estado de vazio ou configuracao pendente',
  },
  error: {
    className: 'zyr-card zyr-card-error',
    image: zyr404,
    alt: 'Zyr em estado de erro',
  },
} satisfies Record<
  ZyrTone,
  {
    className: string;
    image: typeof zyrTips;
    alt: string;
  }
>;

function ZyrCard({
  tone,
  title,
  description,
  children,
  className,
}: BaseZyrCardProps & { tone: ZyrTone }) {
  const toneData = toneMap[tone];

  return (
    <article className={`${toneData.className}${className ? ` ${className}` : ''}`}>
      <div className="zyr-card-media">
        <Image
          src={toneData.image}
          alt={toneData.alt}
          className="zyr-card-image"
          sizes="(max-width: 640px) 120px, 160px"
          priority={false}
        />
      </div>
      <div className="zyr-card-copy">
        <strong>{title}</strong>
        <p>{description}</p>
        {children}
      </div>
    </article>
  );
}

export function ZyrHint({ title, description, tips, children, className }: ZyrHintProps) {
  return (
    <ZyrCard tone="hint" title={title} description={description} className={className}>
      {tips?.length ? (
        <ul className="zyr-card-list">
          {tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      ) : null}
      {children}
    </ZyrCard>
  );
}

export function ZyrEmptyState({
  title,
  description,
  action,
  children,
  className,
}: ZyrEmptyStateProps) {
  return (
    <ZyrCard tone="empty" title={title} description={description} className={className}>
      {action ? <div className="zyr-card-actions">{action}</div> : null}
      {children}
    </ZyrCard>
  );
}

export function ZyrErrorState({
  title,
  description,
  action,
  children,
  className,
}: ZyrErrorStateProps) {
  return (
    <ZyrCard tone="error" title={title} description={description} className={className}>
      {action ? <div className="zyr-card-actions">{action}</div> : null}
      {children}
    </ZyrCard>
  );
}
