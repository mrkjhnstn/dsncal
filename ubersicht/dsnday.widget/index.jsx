// DSNDay for Übersicht.
// Shows dsnday.html in widget mode inside a frame that sizes itself to the card.
// Install or update with ubersicht/install.sh from the dsncal repo.

// Page source. The local copy works offline; the hosted copy updates itself.
const SRC = 'dsnday.widget/dsnday.html';
// const SRC = 'https://mrkjhnstn.github.io/dsncal/dsnday.html';

// Widget options (see README "Widget mode"). weeks is required here so the frame can size itself.
//   weeks=20  week rows shown       bg=0.6   card background opacity, 0 to 1
//   s=CDSCC   start with a site's holidays shown
const OPTIONS = 'weeks=20&bg=0.6';

// Screen position of the widget.
export const className = `
  top: 40px;
  left: 40px;
`;

// The page keeps its own clock, so Übersicht never needs to re-render it.
export const refreshFrequency = false;

const FRAME_ID = 'dsnday-frame';

// The page posts its card size once loaded; fit the frame to it.
if (!window.__dsndaySizeListener) {
  window.__dsndaySizeListener = true;
  window.addEventListener('message', (e) => {
    const d = e.data;
    if (!d || d.dsnday !== 'size') return;
    const frame = document.getElementById(FRAME_ID);
    if (!frame || e.source !== frame.contentWindow) return;
    frame.style.width = d.w + 'px';
    frame.style.height = d.h + 'px';
  });
}

export const render = () => (
  <iframe
    id={FRAME_ID}
    title="DSNDay"
    src={`${SRC}#widget&${OPTIONS}`}
    style={{
      display: 'block',
      border: 0,
      width: '410px',
      height: '760px',
      background: 'transparent',
      colorScheme: 'normal',
    }}
  />
);
