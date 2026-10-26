import path from "node:path";
import { createBuilder } from "@content-collections/core";

const configurationPath = path.resolve(process.cwd(), "content-collections.ts");
const builder = await createBuilder(configurationPath);

// content-collections skips a document that fails to read, validate, or
// transform, and the build still succeeds. Fail instead, so a bad post never
// disappears from production without a trace.
const errorEvents = [
  "collector:read-error",
  "collector:parse-error",
  "transformer:validation-error",
  "transformer:result-error",
  "transformer:error",
];
const errors = [];
for (const event of errorEvents) {
  builder.on(event, ({ error }) => errors.push(error));
}

await builder.build();

if (errors.length > 0) {
  for (const error of errors) console.error(error?.message ?? error);
  process.exit(1);
}
