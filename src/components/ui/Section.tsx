import React from 'react';

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <section className={`container mx-auto px-4 py-8 ${className}`}>
      {title && (
        <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      )}
      {children}
    </section>
  );
};

export default Section;
