import * as fs from 'node:fs/promises'
import { useFilters } from './lists.ts'
import { parseWithGhostery, parseWithUblockOrigin } from './parsers.ts'
import { stringifyParserResponse } from './serializer.ts'
import { Responses, Stats, writeMarkdown } from './visualizer.ts'

async function main() {
  const filters = await useFilters()
  const failures: Responses[] = []
  const stats: Stats = {
    lines: 0,
    skipped: 0,
    matched: 0,
  }

  console.log('====> Testing filters')

  for (const [name, body] of filters) {
    console.log(`Testing ${name}...`)

    for (const line of body.split('\n')) {
      stats.lines++

      if (line.includes('+js') === false) {
        stats.skipped++

        continue
      }

      const ghostery = stringifyParserResponse(parseWithGhostery(line))
      const ubo = stringifyParserResponse(parseWithUblockOrigin(line))

      if (ghostery === ubo) {
        stats.matched++
      } else {
        failures.push({
          line,
          responses: {
            ghostery,
            ubo
          }
        })
      }
    }
  }

  console.log('====> Saving results')
  console.log(JSON.stringify(stats, null, 2))
  console.log(`${JSON.stringify(stats, null, 2)}
Failures: ${stats.lines - stats.skipped - stats.matched}
Coverage: ${stats.matched / (stats.lines - stats.skipped) * 100}%`)

  await fs.writeFile('./result.md', writeMarkdown({ stats, results: failures }), 'utf8')
}

void main()
