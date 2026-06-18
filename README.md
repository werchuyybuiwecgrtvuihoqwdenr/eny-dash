# Sales Dashboard

A static React + Vite dashboard for tracking chat agency sales, built to deploy on GitHub Pages.

## Local development

```bash
npm install
npm run dev
```

## Before deploying — set your repo name

Open `vite.config.js` and make sure `base` matches your GitHub repo name exactly:

```js
base: '/your-repo-name/',
```

If your repo is `github.com/yourname/sales-dashboard`, this should be `/sales-dashboard/`.
If you're deploying to a user/org page (`yourname.github.io`), set it to `'/'` instead.

## Deploy via GitHub Actions (recommended)

1. Push this project to a GitHub repo.
2. In the repo, go to **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**.
3. Push to `main` — the included workflow (`.github/workflows/deploy.yml`) will build and deploy automatically.
4. Your site will be live at `https://yourname.github.io/your-repo-name/`.

## Deploy manually (no Actions)

```bash
npm run build
npx gh-pages -d dist
```

Then in repo settings → Pages → Source: branch `gh-pages`.

## Project structure

```
├── public/              # favicon + icons (served as-is)
├── src/
│   ├── Dashboard.jsx    # main dashboard component
│   └── main.jsx         # React entry point
├── index.html
├── vite.config.js
└── .github/workflows/deploy.yml
```
