export type Stats = {
  lines: number;
  skipped: number;
  matched: number;
}

export type Responses = {
  line: string;
  responses: Record<string, string>;
}

export function writeMarkdown({
  stats,
  results
}: {
  stats: Stats,
  results: Responses[]
}) {
  return results.reduce((state, result) => {
    if (result.responses.ghostery === result.responses.ubo) {
      return ''
    }

    return state + `
### \`${result.line.slice(result.line.indexOf('#'))}\`

Ghostery response: \`${result.responses.ghostery}\`
uBlock Origin response: \`${result.responses.ubo}\`
`
  }, `# Ghostery adblocker library comparison

## Stats

- Total lines: ${stats.lines}
- Skipped lines: ${stats.skipped}
- Matched lines: ${stats.matched}
- Failed lines: ${stats.lines - stats.skipped - stats.matched}

## Failures
`)
}
