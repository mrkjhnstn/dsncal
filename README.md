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
| Click a complex row, or G / C / M | Show that site's holidays; click or press again to hide |
| Esc | Hide holidays |

The Today button shows an arrow pointing toward the current week when it is out of view.

## Site holidays

Click GDSCC, CDSCC or MDSCC in the header to show holidays for that site only. While a site is selected:

- Holidays are filled teal and JPL RDO shading is hidden.
- A lighter outlined cell is another day off that is not a public holiday (see table).
- Hover or click a marked day to see its name in the line at the bottom.
- The bottom line also says when the year in view has no holiday data.
- Holidays are local dates at the site and are marked on the same calendar date. They are not shifted to UTC.

| Row | Shows | Source | Lighter cells |
|---|---|---|---|
| GDSCC | JPL holidays | JPL HR 2027 schedule (2026-11-02) and FY2027 9/80 calendar; Jan-Sep 2026 computed from the JPL holiday list | Day the 9/80 RDO is observed when a holiday falls on an RDO Friday |
| CDSCC | ACT public holidays | ACT Government list, checked against the CDSCC 2027 calendar | none |
| MDSCC | Spain national, Comunidad de Madrid, Madrid city local | Comunidad de Madrid calendars; MDSCC 2027 calendar | Company/union holidays (2027 only) |

Data covers 2026 and 2027. To add a year, extend the `HOLIDAYS` table near the top of the script and update
each site's `years` range. Typical publication times: ACT list about a year ahead; Madrid regional decree in
late September or October; Madrid local days in December; JPL schedule from HR.

Not confirmed: the JPL floating holiday on 2026-12-24 and the two 2026 "RDO observed" days were read from
the FY2027 9/80 calendar, not from an HR list. MDSCC company/union days for 2026 are not included.

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
- `cellFor(dayNumber)` returns the DOM cell for a date. Holidays use it; critical events can too.
  - `HOLIDAYS` - per-site holiday lists (see Site holidays)

## Testing

Checked in Chromium: every rendered week (2016–2036) compared against Python's `isocalendar()` for week
number, day, DOY, weekend and RDO; keyboard, wheel, minute update, UTC day rollover and pop-out.
Also checked by hand in Safari, Chrome and Zen (Firefox) on macOS, 2026-11-15.

## Planned

- DSN Level 1/2/3 critical events (on hold)

If critical-event data is internal, keep it out of this repo and load it from a separate file on an internal server.

## History

`source/dsnday.html` is the original version, kept for reference. It used a launcher page that wrote the
calendar into a popup with `document.write` and loaded moment.js from a CDN.
