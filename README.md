# Cole Lee Personal Website

## Local Development

```bash
cd public
npx serve -l 3000
```

Visit http://localhost:3000

## Deploy to Vercel

### First time setup
```bash
npx vercel login
npx vercel --prod
```

### Adding new pages

When adding a new page, update `vercel.json` with a rewrite rule:

```json
{
  "rewrites": [
    { "source": "/your-page", "destination": "/your-page.html" }
  ]
}
```

Then push to GitHub or deploy manually:
```bash
git push
npx vercel --prod
```
