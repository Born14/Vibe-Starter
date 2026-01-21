# Vibe Starter

Deploy your own full-stack web app from your phone. No coding required.

## What Is This?

Vibe Starter is a deployment wizard that helps non-technical creators launch production-ready web applications. You connect your accounts (GitHub, Vercel, Neon), choose your AI provider, and get a fully deployed app with:

- **Frontend**: Next.js 15 with React 19
- **Backend**: API routes with your chosen AI (Claude, Gemini, or OpenAI)
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Hosting**: Vercel (free tier works great)

Everything deploys to YOUR accounts. You own the code, the hosting, the database. No lock-in.

## How It Works

1. **Get a license key** from [vibestarter.net](https://vibestarter.net)
2. **Run the wizard** - connects your GitHub, Vercel, and Neon accounts
3. **Choose your AI** - Claude, Gemini, or OpenAI
4. **Deploy** - your app is live in minutes
5. **Build from anywhere** - use AI to add features from your phone

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15.2.8 |
| Frontend | React 19, Tailwind CSS 4 |
| Database | Neon PostgreSQL + Drizzle ORM |
| Hosting | Vercel |
| Auth | Clerk (optional) |
| Rate Limiting | Redis Cloud |

## Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your values in .env.local

# Push database schema
npm run db:push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

See `.env.example` for all required variables. You'll need:

- **Database**: Neon PostgreSQL connection string
- **GitHub OAuth**: For repository creation
- **Vercel OAuth**: For deployment
- **Encryption Key**: For securing stored credentials

## Project Structure

```
src/
├── app/
│   ├── api/          # API routes (deploy, auth, etc.)
│   ├── setup/        # Wizard UI
│   └── education/    # Learning resources
├── components/       # Shared UI components
└── lib/
    ├── db/           # Database schema and connection
    ├── encryption.ts # Credential encryption
    └── license.ts    # License validation
```

## Support

- **Issues**: [GitHub Issues](https://github.com/Born14/vibe-starter/issues)
- **Email**: vibestarter26@outlook.com

## License

MIT License - see [LICENSE](LICENSE) for details.

You're free to use, modify, and distribute this code. Attribution appreciated but not required.
