"use client";

import { Icon } from "../lib/icons";
import { TERMS } from "../lib/config";

export function TermsSection() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {TERMS.map((term, index) => (
        <div
          key={term.number}
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-surface-container/50 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-surface-container/80"
          style={{ transitionDelay: `${index * 50}ms` }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none select-none absolute -left-3 -top-8 text-[7rem] font-black leading-none text-white/[0.03] transition-colors duration-300 group-hover:text-primary/10"
          >
            {term.number}
          </span>

          <div className="relative">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5 text-secondary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              <Icon name={term.icon} className="h-6 w-6" />
            </span>

            <h3 className="mt-5 flex items-center gap-2.5 text-base font-bold text-on-surface">
              <span className="text-sm font-mono font-extrabold text-primary">
                {term.number}
              </span>
              {term.title}
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
              {term.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
