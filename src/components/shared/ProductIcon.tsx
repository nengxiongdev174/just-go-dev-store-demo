"use client";

import React from "react";
import {
  Headphones,
  Keyboard,
  Watch,
  Briefcase,
  Coffee,
  Shirt,
  BatteryCharging,
  Mouse,
  Wind,
  Footprints,
  Speaker,
  CupSoda,
  Laptop,
  Home,
  LayoutGrid,
  Package,
  type LucideProps,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Headphones,
  Keyboard,
  Watch,
  Briefcase,
  Coffee,
  Shirt,
  BatteryCharging,
  Mouse,
  Wind,
  Footprints,
  Speaker,
  CupSoda,
  Laptop,
  Home,
  LayoutGrid,
  Package,
};

export function ProductIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const IconComp = ICON_MAP[name] ?? Package;
  return <IconComp className={className} />;
}

