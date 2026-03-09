# Self-Hosting Guide

This guide explains how to self-host this portfolio website on your own infrastructure.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- A Supabase project (for backend features)

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <your-repo-name>
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### 4. Run in Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 5. Build for Production

```bash
npm run build
```

This generates a `dist/` folder with static files ready for deployment.

## Deployment Options

### Option A: Static Hosting (Recommended)

Since this is a Vite + React SPA, the `dist/` folder can be deployed to any static hosting provider:

| Provider | Command / Notes |
|---|---|
| **Nginx** | Serve `dist/` with `try_files $uri /index.html;` for SPA routing |
| **Apache** | Use `.htaccess` with `FallbackResource /index.html` |
| **Vercel** | `vercel --prod` |
| **Netlify** | Drag & drop `dist/` or connect repo |
| **Cloudflare Pages** | Connect repo, build command: `npm run build`, output: `dist` |

### Option B: Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Build and run:

```bash
docker build -t portfolio .
docker run -p 80:80 portfolio
```

### Option C: Nginx (Manual)

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/portfolio/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Supabase Backend Setup

This project uses Supabase for backend features (contact form, gallery management, admin dashboard).

### 1. Create a Supabase Project

Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Run Database Migrations

Apply the migrations from the `supabase/migrations/` directory to your Supabase project:

```bash
npx supabase db push --linked
```

Or manually run the SQL files in the Supabase SQL Editor.

### 3. Deploy Edge Functions

```bash
npx supabase functions deploy
```

### 4. Configure Secrets

Set the required secrets in your Supabase project for edge functions (e.g., email service credentials).

## SSL / HTTPS

For production, always serve over HTTPS:

- **Let's Encrypt** with Certbot for Nginx/Apache
- **Cloudflare** proxy for automatic SSL
- Most cloud providers (Vercel, Netlify, Cloudflare Pages) handle SSL automatically

## Troubleshooting

| Issue | Solution |
|---|---|
| Blank page after deploy | Ensure SPA routing is configured (`try_files $uri /index.html;`) |
| API calls failing | Verify `.env` variables point to your Supabase project |
| 404 on page refresh | SPA routing not configured on your web server |
| CORS errors | Check Supabase project URL matches your domain |

## License

This project is for personal use. Please contact the owner for licensing inquiries.
