import {
  availableDownloadTargetIds,
  getDownloadTarget,
  getDownloadTargetLabel,
  isDownloadTargetAvailable,
  type DownloadLabelMode,
  type DownloadTargetId,
} from "@/lib/download-targets";
import { getRequestDownloadTarget } from "@/lib/request-download-target";

type BrowserAwareInstallCtaProps = {
  className: string;
  fallbackContainerClassName?: string;
  fallbackPrimaryClassName?: string;
  fallbackSecondaryClassName?: string;
  fallbackLabelMode?: DownloadLabelMode;
  fallbackTargets?: DownloadTargetId[];
  id?: string;
  includeArrowIcon?: boolean;
  rel?: string;
  resolvedLabelMode?: DownloadLabelMode;
  target?: string;
};

function LaunchArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

export async function BrowserAwareInstallCta({
  className,
  fallbackContainerClassName = "flex flex-wrap items-center gap-3",
  fallbackPrimaryClassName,
  fallbackSecondaryClassName,
  fallbackLabelMode = "browser",
  fallbackTargets = availableDownloadTargetIds,
  id,
  includeArrowIcon = false,
  rel,
  resolvedLabelMode = "cta",
  target,
}: BrowserAwareInstallCtaProps) {
  const liveFallbackTargets = fallbackTargets.filter(isDownloadTargetAvailable);
  // With a single live store there is nothing to choose between, so show it
  // as the resolved CTA rather than a one-item browser picker.
  const preferredTarget =
    (await getRequestDownloadTarget()) ??
    (liveFallbackTargets.length === 1 ? liveFallbackTargets[0] : null);

  if (preferredTarget !== null) {
    const targetDetails = getDownloadTarget(preferredTarget);

    return (
      <a
        id={id}
        href={targetDetails.url}
        className={className}
        target={target}
        rel={rel}
        data-download-target={preferredTarget}
      >
        {getDownloadTargetLabel(preferredTarget, resolvedLabelMode)}
        {includeArrowIcon ? <LaunchArrowIcon /> : null}
      </a>
    );
  }

  return (
    <div id={id} className={fallbackContainerClassName}>
      {liveFallbackTargets.map((fallbackTarget, index) => {
        const targetDetails = getDownloadTarget(fallbackTarget);
        const fallbackClassName =
          index === 0
            ? (fallbackPrimaryClassName ?? className)
            : (fallbackSecondaryClassName ?? fallbackPrimaryClassName ?? className);

        return (
          <a
            key={fallbackTarget}
            href={targetDetails.url}
            className={fallbackClassName}
            target={target}
            rel={rel}
            data-download-target={fallbackTarget}
          >
            {getDownloadTargetLabel(fallbackTarget, fallbackLabelMode)}
          </a>
        );
      })}
    </div>
  );
}
