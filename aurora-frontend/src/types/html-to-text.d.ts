declare module "html-to-text" {
  export function convert(
    html: string,
    options?: {
      wordwrap?: number | false;
      selectors?: {
        selector: string;
        format: string;
        options?: unknown;
      }[];
    },
  ): string;
}
