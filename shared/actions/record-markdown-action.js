import { recordCopyHistory } from "../history/record-copy-history.js";
import { advancePromptsAfterSuccess } from "../engagement/advance-prompts-after-success.js";

// Every successful copy or download, from the popup, the context menu, or the
// keyboard shortcut, ends here. Features that react to a finished action
// (copy history, review and share prompts) are called from this function.
// Each feature call must catch its own errors: a failure here must never turn
// a successful copy or download into an error for the user.
//
// kind:   "copy" | "download"
// source: "popup" | "context-menu" | "shortcut"
// result: the extraction result ({ markdown, meta, stats })
export async function recordMarkdownAction({ kind, source, result }) {
  try {
    await recordCopyHistory({ kind, result });
  } catch {
    /* Copy history is a convenience; never fail the copy because of it. */
  }

  try {
    await advancePromptsAfterSuccess({ source });
  } catch {
    /* The review and share prompts are optional. */
  }
}
