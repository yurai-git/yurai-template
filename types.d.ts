export type PackageManagers = 'npm' | 'yarn' | 'pnpm' | 'bun';
export type PackageContent = {
  scripts?: Record<string, string>;
  packageManager?: string;
  [key: string]: unknown;
};
