// DSNDay for Übersicht.
// Loads dsnday.html and draws the calendar directly in the widget (no frame), inside a
// shadow root so its styles don't mix with other widgets. Drawing it directly is what
// lets Übersicht pass clicks and scrolling to it.
// Install or update with ubersicht/install.sh from the dsncal repo.

// Page source: the local copy (works offline) or the hosted copy (always current).
const SRC = 'dsnday.widget/dsnday.html';
// const SRC = 'https://mrkjhnstn.github.io/dsncal/dsnday.html';

// Widget options (see README "Widget mode").
const OPTIONS = {
  weeks: 20,      // week rows shown
  bg: 0.6,        // card background opacity, 0 to 1
  banner: true,   // DSN Service Scheduling banner
  s: null,        // start with a site's holidays shown: 'GDSCC', 'CDSCC' or 'MDSCC'
};

// Screen position of the widget.
export const className = `
  top: 40px;
  left: 40px;
`;

// The calendar keeps its own clock, so Übersicht never needs to re-render it.
export const refreshFrequency = false;

// --- mount start
let instance = null;

async function mountDSNDay(host) {
  if (host.shadowRoot) return;
  const shadow = host.attachShadow({ mode: 'open' });
  try {
    const res = await fetch(SRC, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    const style = doc.querySelector('style');
    const app = doc.getElementById('app');
    const script = doc.querySelector('script');
    if (!style || !app || !script) throw new Error('unexpected page layout');
    shadow.innerHTML = '<style>' + style.textContent + '</style>' + app.outerHTML;
    // Defining DSNDAY_EMBED stops the page's own start-up code; we call DSNDay instead.
    const DSNDay = new Function('DSNDAY_EMBED', script.textContent + '\nreturn DSNDay;')(true);
    if (instance) instance.destroy();
    instance = DSNDay(shadow, shadow.getElementById('app'), { ...OPTIONS, widget: true, embedded: true });
  } catch (err) {
    shadow.innerHTML = '<div style="color:#fff;background:#900;padding:6px 10px;border-radius:6px;font:13px Arial">' +
      'DSNDay: could not load ' + SRC + ' (' + err.message + ')</div>';
  }
}

function unmountDSNDay() {
  if (instance) { instance.destroy(); instance = null; }
}
// --- mount end

export const render = () => (
  <div ref={(el) => (el ? mountDSNDay(el) : unmountDSNDay())} />
);
