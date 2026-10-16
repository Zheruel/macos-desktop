export function trapDialogKey(event) {
  if (event.key !== "Tab") return;
  const controls = [
    ...event.currentTarget.querySelectorAll(
      'button:not(:disabled), input:not(:disabled), [tabindex="0"]',
    ),
  ];
  const first = controls[0];
  const last = controls.at(-1);
  if (!first) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
