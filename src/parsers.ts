// @ts-expect-error npm prefix is not supported by default
import { CosmeticFilter } from 'npm:@ghostery/adblocker'
// @ts-expect-error url import is not supported by default
import { AstFilterParser } from 'https://github.com/gorhill/uBlock/raw/refs/heads/master/src/js/static-filtering-parser.js'

export type ParserResponse = string[] | Error

export function parseWithGhostery(line: string): ParserResponse {
  try {
    const filter = CosmeticFilter.parse(line)
    const { name, args } = filter.parseScript()

    return [name, ...args]
  } catch (error) {
    return error
  }
}

export function parseWithUblockOrigin(line: string): ParserResponse {
  try {
    const parser = new AstFilterParser()
    parser.parse(line)

    return parser.getScriptletArgs()
  } catch (error) {
    return error
  }
}
