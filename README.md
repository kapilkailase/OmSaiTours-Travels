# OmSai Tours & Travels

Responsive Maharashtra cab-booking website with a lightweight Node.js static server.

## Requirements

- Node.js 22 or newer
- npm

## Run locally

```sh
npm ci
npm run dev
```

Open `http://localhost:5800`. Node's built-in watch mode restarts the server when source files change.

The server uses the hosting platform's `PORT` environment variable when available and otherwise listens on port `5800`. `/healthz` returns a JSON health response. Static pages and assets are served from `public/`.

## Deploy

Deploy the repository root to a Node.js hosting provider. Use `npm ci --omit=dev` as the install command and `npm start` as the start command. The application has no npm dependencies. Keep `server.js`, `package.json`, `package-lock.json`, and the `public/` directory in the deployment artifact.

The contact form validates the enquiry in the browser and prepares a WhatsApp message for **+91 93708 90277**. The visitor must continue to WhatsApp and press Send; enquiries are not stored or emailed by this site. Landmark photos are bundled locally in `public/images/`, with author and license credits displayed in the packages section. Hero and fleet photos use Unsplash, and fonts use Google Fonts, so those services must be reachable for the remote images and custom fonts to load.

Before deployment, replace the fleet placeholders by adding the owner's vehicle photos to `public/images/fleet/` with these exact filenames: `sedan.jpg`, `suv.jpg`, and `tempo-traveller.jpg`. Use landscape images around 1200 x 900 pixels. Until a local photo is supplied, its existing fallback image remains visible.

## GitHub Pages

The included GitHub Actions workflow deploys the static `public/` directory when you push to `main`. Create an empty GitHub repository, push this project to its `main` branch, then open **Settings → Pages** and choose **GitHub Actions** as the build and deployment source. The deployed URL will be `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.

To connect this existing folder to your new repository, use its HTTPS URL in place of the placeholder:

```sh
git init
git add .
git commit -m "Prepare OmSai Tours & Travels website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

After that first push, each push to `main` triggers a Pages deployment. GitHub Pages only hosts the static site; it does not run `server.js`. The site booking and WhatsApp enquiry controls work client-side on Pages.