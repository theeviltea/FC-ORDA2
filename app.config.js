// Base URL: /FC-ORDA2 for GitHub Pages; empty for the single-file preview artifact (ORDA_BASE_URL="").
module.exports = ({ config }) => ({
  ...config,
  experiments: { ...config.experiments, baseUrl: process.env.ORDA_BASE_URL ?? '/FC-ORDA2' },
});
