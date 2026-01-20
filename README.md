# BEE-IT HIVE – Gandaki University Sample Site

A modern frontend project built with **Vite**.


## Prerequisites

- Node.js (v20+ recommended, you're using v24.x — perfect)

## Getting Started

1. Clone the repository

   `git clone <repo-url.git>`

   `cd beeit`

2. Install dependencies

   This project uses `--legacy-peer-deps` to handle certain peer dependency conflicts (common in some Vite + library setups).

   `npm install --legacy-peer-deps`

3. Run in development mode

   Starts the Vite dev server with live reload.

   `npm run dev`

   → Open http://localhost:3000/ (or the port shown in terminal)

## Available Scripts

All commands should be run with `npm run <script-name>` (except plain `npm install`).

| Command                        | What it does                                      | How to run                        |
|--------------------------------|---------------------------------------------------|-----------------------------------|
| dev                            | Start development server (with HMR)               | `npm run dev`                       |
| build                          | Create production build (outputs to /dist)        | `npm run build`                     |
| preview                        | Locally preview the production build              | `npm run preview`                   |
| install --legacy-peer-deps     | Install dependencies (use this)                   | `npm install --legacy-peer-deps`    |

Important note:
Do NOT run `npm build` — that is not a valid npm command.
Always use `npm run build` to execute the "build" script defined in package.json.

## Build for Production

To create an optimized, static production version:

npm run build

→ This generates a /dist folder containing HTML, CSS, JS, and assets — ready to deploy to Netlify, Vercel, GitHub Pages, any static host, etc.

To test the production build locally:

npm run build
npm run preview

→ Opens a simple static server (usually at http://localhost:4173/)

## Troubleshooting

- "Unknown command: build"          → Use `npm run build` (not `npm build`)
- "Missing script: start"           → This project uses `dev` instead of `start` (common in Vite projects)
- Dependency issues                 → Always use `npm install --legacy-peer-deps`
- Still having problems?            → Delete `node_modules` + `package-lock.json`, then reinstall.

## Recommended package.json scripts (for reference)

Most Vite projects include these:

"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}

If yours is missing "build" or "preview", add them and commit the change.

Enjoy this sample demo and use it to build.

Happy coding! 🐝