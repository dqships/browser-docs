import type { ComponentType } from "react";

export type SlideComponentProps = {
  className?: string;
};

export type SlideDefinition = {
  slug: string;
  name: string;
  headline: string;
  Component: ComponentType<SlideComponentProps>;
};

export type StoreSize = {
  label: string;
  width: number;
  height: number;
};

export type SlideSetDefinition = {
  id: string;
  label: string;
  summary: string;
  description: string;
  storeTargets: readonly StoreSize[];
  slides: readonly SlideDefinition[];
};
