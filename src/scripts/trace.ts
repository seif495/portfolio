/** "Trace a question": accessible tabs that replay the pipeline log on switch. */
export function initTrace(root: HTMLElement) {
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')!)!);

  const select = (i: number, focus = false) => {
    tabs.forEach((t, j) => {
      const on = i === j;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      panels[j]!.hidden = !on;
      panels[j]!.classList.remove('is-playing');
    });
    const panel = panels[i]!;
    // Restart the staggered reveal.
    void panel.offsetWidth;
    panel.classList.add('is-playing');
    if (focus) tabs[i]!.focus();
  };

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', (e) => {
      let next = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;
      if (next < 0) return;
      e.preventDefault();
      select(next, true);
    });
  });

  root.querySelectorAll<HTMLButtonElement>('[data-code-toggle]').forEach((btn) => {
    const pre = btn.parentElement!.querySelector<HTMLElement>('pre')!;
    const collapsedLabel = btn.textContent!.trim();
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      pre.dataset.collapsed = open ? 'true' : 'false';
      btn.textContent = open ? collapsedLabel : 'Collapse query';
    });
  });
}
