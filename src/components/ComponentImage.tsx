import React from "react";
import { LucideIcon } from "lucide-react";
import { IllustrativeImage } from "./IllustrativeImage";

export function ComponentImage({ type, icon: Icon, className, isIllustrative }: { type: string, icon: LucideIcon, className?: string, isIllustrative?: boolean }) {
  if (isIllustrative) {
    const illustrative = IllustrativeImage({ type, className });
    if (illustrative) return illustrative;
  }

  // Return an SVG based on the type
  if (type === "resistor") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h4l2-5 4 10 4-10 4 10 2-5h2" />
      </svg>
    );
  }
  if (type === "capacitor" || type === "capacitor_elec") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h8m4 0h8M10 6v12M14 6v12" />
      </svg>
    );
  }
  if (type === "battery" || type === "powersupply" || type === "ac_source") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h6m8 0h6M8 6v12M12 8v8M16 4v16" />
      </svg>
    );
  }
  if (type === "ground") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v10M6 12h12M8 16h8M10 20h4" />
      </svg>
    );
  }
  if (type === "diode" || type === "led") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h6m8 0h6M8 6l8 6-8 6V6zM16 6v12" />
        {type === "led" && <path d="M18 4l2-2m-3 1l2-2" />}
      </svg>
    );
  }
  if (type === "transistor" || type === "mosfet" || type === "transistor_pnp" || type === "mosfet_p") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h6m0-6v12m0-8l8-4v6m-8 6l8 4v-6M16 4v16" />
      </svg>
    );
  }
  if (type.includes("arduino") || type.includes("esp32") || type.includes("raspberry") || type.includes("timer") || type.includes("ic") || type.includes("opamp") || type.includes("logic")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="6" width="12" height="12" rx="2" />
        <path d="M4 8h2m-2 4h2m-2 4h2M18 8h2m-2 4h2m-2 4h2" />
        <path d="M8 4v2m4-2v2m4-2v2M8 18v2m4-2v2m4-2v2" />
      </svg>
    );
  }
  if (type === "switch") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h6m8 0h6M8 12l8-6" />
      </svg>
    );
  }
  if (type === "motor" || type === "buzzer" || type === "relay") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v8m-4-4h8" />
      </svg>
    );
  }
  
  if (type === "trace") {
     return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l8 8 8-4" /></svg>
  }
  if (type === "board") {
     return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
  }

  // PCB components
  if (type === "pad" || type === "via") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    );
  }

  return <Icon className={className} />;
}
