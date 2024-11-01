This project compares scriptlet parsing capability in ghostery and ublock origin.

```
% deno install
% deno src/index.ts
```

The above commands will install dependencies and generate a report to `result.md`.

Configurations:

You can configure filter to use in `src/lists.ts` by modifying `sources`.
`!#include` syntax (limitations apply) is supported and the caches will be saved in `filters` directory under current working directory.

We don't guarantee of parsing `!#include` properly.
For entries with `http:` or `https:` prefix, they'll be treated as absolute urls.
For entries with `/` prefix, they'll be treated as absolute pathnames (retaining host).
For other entries, they'll be treated as relative pathnames.

You can configure the script always to pull filters from internet.
Open `src/lists.txt` and set the default value of `ignoreCaches` in `useFilters` function to `true`.

Distribution:

This project doesn't include any assets or dependencies, and the source code is distributed under MIT license.
