import * as fs from 'node:fs/promises'
import * as fss from 'node:fs'
import { dirname, join } from 'node:path'

export const sources = {
  easylist: 'https://easylist.to/easylist/easylist.txt',
  easylist_cookies: 'https://secure.fanboy.co.nz/fanboy-cookiemonster.txt',
  easyprivacy: 'https://easylist.to/easylist/easyprivacy.txt',
  fanboy_annoyances: 'https://secure.fanboy.co.nz/fanboy-annoyance.txt',
  fanboy_social: 'https://easylist.to/easylist/fanboy-social.txt',
  uassets_ads: 'https://ublockorigin.github.io/uAssets/filters/filters.min.txt',
  uassets_privacy: 'https://ublockorigin.github.io/uAssets/filters/privacy.min.txt',
  uassets_badware: 'https://ublockorigin.github.io/uAssets/filters/badware.txt',
  uassets_fixes: 'https://ublockorigin.github.io/uAssets/filters/quick-fixes.txt',
  uassets_unbreak: 'https://ublockorigin.github.io/uAssets/filters/unbreak.txt'
}

async function useFilter(key: string, url: string, ignoreCache: boolean) {
  if (ignoreCache === false && fss.existsSync(`./filters/${key}`) === true) {
    console.log(`Reading ${key}...`)

    return await fs.readFile(`./filters/${key}`, 'utf8')
  }

  console.log(`Fetching ${key}...`)

  const response = await fetch(url)
  const body = await response.text()

  await fs.writeFile(`./filters/${key}`, body, 'utf8')

  return body
}

async function resolveFilter(key: string, url: string, ignoreCache: boolean) {
  const seen: Set<string> = new Set()
  const queue: Array<[string, string]> = [[key, url]]
  const stack: string[] = []

  while (queue.length) {
    const [key, url] = queue.shift()!

    if (seen.has(url)) {
      continue
    } else {
      seen.add(url)
    }

    const body = await useFilter(key, url, ignoreCache)

    for (const line of body.split('\n')) {
      if (line.startsWith('!#include')) {
        const location = line.slice(line.indexOf(' ')).trim()
        const key = location.split('/').pop()!.replace(/[\W]/, '_')
        const urlObj = new URL(url)

        if (location.startsWith('/')) {
          urlObj.pathname = location
          queue.push([key, urlObj.toString()])
        } else if (location.startsWith('http://') || location.startsWith('https://')) {
          queue.push([key, location])
        } else {
          urlObj.pathname = join(dirname(urlObj.pathname), location)
          queue.push([key, urlObj.toString()])
        }
      }
    }

    stack.push(body)
  }

  return stack.join('\n\n')
}

export async function useFilters({
  ignoreCaches = false
}: {
  ignoreCaches?: boolean
} = {}) {
  console.log('====> Loading filters')

  const filters: Array<[string, string]> = []

  if (ignoreCaches === false) {
    if (fss.existsSync('./filters') === false) {
      await fs.mkdir('./filters')
    }
  }

  for (const [key, url] of Object.entries(sources)) {
    filters.push([key, await resolveFilter(key, url, ignoreCaches)])
  }

  return filters
}
