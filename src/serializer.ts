import type { ParserResponse } from "./parsers.js";

export function stringifyParserResponse(response: ParserResponse) {
  if (response instanceof Error) {
    return stringifyError(response)
  }

  return JSON.stringify(response)
}

export function stringifyError(error: Error) {
  return error.message
}
