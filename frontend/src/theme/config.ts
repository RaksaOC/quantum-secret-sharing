/* Internal theme switch. Each look is one CSS file in this folder, keyed by data-look on
   <html>. There is deliberately no theme picker in the UI: change THEME here to switch.
   Light/dark is separate and stays user-controlled (the sun/moon button). */
export const THEMES = ["deep-lab", "gallery"] as const;
export type ThemeId = (typeof THEMES)[number];

export const THEME: ThemeId = "deep-lab";
