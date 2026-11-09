import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// On GitHub Pages, a project site lives at /<repository-name>/.
// The repository name is detected during the GitHub Actions build, so the
// site works even if you rename the repository. Local dev uses '/'.
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isUserOrOrganizationSite = repositoryName?.toLowerCase().endsWith('.github.io');
const base = process.env.VITE_BASE_PATH || (
  process.env.GITHUB_ACTIONS === 'true' && repositoryName && !isUserOrOrganizationSite
    ? `/${repositoryName}/`
    : '/'
);

export default defineConfig({
  plugins: [react()],
  base,
});
