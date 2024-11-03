import { CosmeticFilter } from '@ghostery/adblocker'
// @ts-expect-error url import is not supported by default
import { AstFilterParser } from '../externs/ublock/src/js/static-filtering-parser.js'

export type ParserResponse = string[] | Error

export function parseWithGhostery(line: string): ParserResponse {
  try {
    const filter = CosmeticFilter.parse(line.trim())!
    const { name, args } = filter.parseScript()!

    return [name, ...args]
  } catch (error) {
    return error as Error
  }
}

export function parseWithUblockOrigin(line: string): ParserResponse {
  try {
    const parser = new AstFilterParser()
    parser.parse(line)

    return parser.getScriptletArgs()
  } catch (error) {
    return error as Error
  }
}
