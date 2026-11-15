# dsncal

**DSNDay** — a single-file DSN time and calendar page.

Open `dsnday.html` in a browser. Nothing to install, no network access needed.

## What it shows

- Current UTC date/time, ISO week and day of year (DOY)
- Local time at each DSN complex (GDSCC, CDSCC, MDSCC) with zone abbreviation and UTC offset
- A scrollable calendar of ISO weeks (Monday first): week number, month, day of month and DOY
- Weekends (grey), JPL RDO Fridays (red), today in UTC (yellow)
- A line above each week 01 marks the year boundary; the year next to "Wk" is the ISO week-year of the top row

The clock updates every minute. The calendar is not redrawn on update, so the view stays where you left it.
If you are on the starting view when the UTC week rolls over, the view follows to the new week.

## Controls

| Input | Action |
|---|---|
| Wheel / trackpad / touch | Free scroll; settles on a whole week |
| Up / Left, Down / Right | 1 week back / forward |
| Shift + arrow, PageUp / PageDown | 4 weeks back / forward |
| Home, T, or the Today button | Return to the current week |
| Pop out | Open in a small separate window, starting at the week in view |

The Today button shows an arrow pointing toward the current week when it is out of view.

## Tab or pop-out

The page opens with the calendar centred in the tab. **Pop out** opens the same file in a small window
(`dsnday.html#popout`), sized to show 20 weeks or the screen height, whichever is smaller. Each window
scrolls independently. Notes:

- A page cannot open a popup without a click (browser rule), so there is no auto-popup.
- The original tab cannot close itself; close it by hand if you only want the pop-out.
- Browsers always show a minimal address bar in popups, and a popup cannot be made always-on-top.
- Firefox/Zen open popups as tabs if configured that way (`browser.link.open_newwindow.restriction`).
- For a chromeless window with no click: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --app="file:///path/to/dsnday.html#popout" --window-size=426,870`

## Hosting

Works from `file://` or from any static web server (copy the one file). No build step.

## Implementation notes

- No dependencies. Time zones use the browser's built-in `Intl.DateTimeFormat`; moment.js is no longer used.
- All calendar math uses UTC day numbers (days since 1970-01-01). "Today" is the UTC date.
- Settings are constants at the top of the script:
  - `ROW_H` — row height in px; must match `--row` in the CSS
  - `SPAN_WEEKS` — weeks rendered each side of the load date (522, about 10 years); reload to re-centre
  - `POPOUT_WEEKS` — weeks visible in the pop-out window (20)
  - `PAGE_WEEKS` — Shift/Page step (4)
  - `RDO_ANCHOR` — a known RDO Friday (2016-09-16); RDOs repeat every 14 days. Change this if the RDO cycle shifts.
  - `COMPLEXES` — complex names, IANA zones and abbreviations keyed by UTC offset in minutes
- CDSCC uses zone `Australia/Sydney` (same rules as Canberra).
- The banner image is embedded as a base64 data URL, which is why the file is about 170 kB with one very long line.
- `cellFor(dayNumber)` returns the DOM cell for a date. It is the intended hook for per-day markers.

## Testing

Checked in Chromium: every rendered week (2016–2036) compared against Python's `isocalendar()` for week
number, day, DOY, weekend and RDO; keyboard, wheel, minute update, UTC day rollover and pop-out.
Also checked by hand in Safari, Chrome and Zen (Firefox) on macOS, 2026-11-15.

## Planned

- Complex-specific items such as local holidays
- DSN Level 1/2/3 critical events

If critical-event data is internal, keep it out of this repo and load it from a separate file on an internal server.

## History

`source/dsnday.html` is the original version, kept for reference. It used a launcher page that wrote the
calendar into a popup with `document.write` and loaded moment.js from a CDN.
