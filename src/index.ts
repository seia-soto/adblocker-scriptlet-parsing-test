import * as fs from 'node:fs/promises'
import { useFilters } from './lists.js'
import { parseWithGhostery, parseWithGhosteryNext, parseWithUblockOrigin } from './parsers.js'
import { stringifyParserResponse } from './serializer.js'
import { Responses, Stats, writeMarkdown } from './visualizer.js'

function tryParsers(line: string): {
  success: boolean;
  responses: Responses;
} {
  const ubo = stringifyParserResponse(parseWithUblockOrigin(line))
  const ghostery = stringifyParserResponse(parseWithGhostery(line))
  const ghosteryNext = stringifyParserResponse(parseWithGhosteryNext(line))

  const responses: Responses = {
    line,
    responses: {
      ghostery,
      ghosteryNext,
      ubo
    }
  }

  for (const response of [ghostery, ghosteryNext]) {
    if (response !== ubo) {
      return {
        success: false,
        responses
      }
    }
  }

  return {
    success: true,
    responses
  }
}

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

      if (
        line.startsWith('!') ||
        line.includes('+js') === false
      ) {
        stats.skipped++

        continue
      }

      const { success, responses } = tryParsers(line)

      if (success === true) {
        stats.matched++
      } else {
        failures.push(responses)
      }
    }
  }

  console.log('====> Saving results')
  console.log(`${JSON.stringify(stats, null, 2)}
Failures: ${stats.lines - stats.skipped - stats.matched}
Coverage: ${stats.matched / (stats.lines - stats.skipped) * 100}%`)

  await fs.writeFile('./result.md', writeMarkdown({ stats, results: failures }), 'utf8')
}

void main()
