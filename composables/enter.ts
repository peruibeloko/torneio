export const onEnter = (fn: () => void) => (e: KeyboardEvent) => {
  if (e.key !== "Enter") return;
  fn();
};
