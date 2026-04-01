export function onEnter(fn: () => void) {
  return (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    fn();
  };
}
