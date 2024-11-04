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
    return state + `
### \`${result.line.slice(result.line.indexOf('#'))}\`

${Object.entries(result.responses).map(([name, response]) => `${response === result.responses.ubo ? '✅' : '❌'} ${name}: \`${response}\``).join('\n')}
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
