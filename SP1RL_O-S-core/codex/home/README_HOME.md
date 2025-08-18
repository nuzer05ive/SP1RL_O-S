SP1RL Home Base Portal
----------------------
Purpose:
  • One URL to load any branch’s app without rebuilds.
  • Works with a static branch list or the GitHub API (optional token).
  • URL Template defaults to rawcdn.githack.com; edit to match your host or Netlify sub-site.

Use:
  1) Open /SP1RL_O-S-core/codex/home/index.html
  2) Set Repo user+name (defaults filled)
  3) (Optional) Paste a GitHub token and click "Fetch Branches" to enumerate all branches
  4) Pick a branch and an app path (captain_mints by default)
  5) Click "Open" to load it in the iframe

Notes:
  • Registry/Loader hot-swap continues to work inside the loaded app.
  • If your deploy platform gives each branch a site, set URL Template to that.
  • Keep branches.json updated if you don’t use the GitHub API.
