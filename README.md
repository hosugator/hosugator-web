# Hosugator Portfolio

A modern, responsive portfolio website built with Next.js, featuring bilingual support (Korean/English) and interactive knowledge graph visualization.

## 🌟 Features

- **Bilingual Support**: Seamless switching between Korean and English
- **Interactive Knowledge Graph**: Explore technical expertise through an interactive node-based visualization
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Static Export**: Deployable to any static hosting service (AWS S3, Vercel, etc.)
- **Modern UI**: Clean, professional design with smooth animations

## 🚀 Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🌍 Internationalization

The website supports both Korean and English languages:

- **Korean (Default)**: Primary language for local market
- **English**: For global opportunities and international companies

Language switching is handled client-side and persists across sessions using localStorage.

### Adding New Languages

1. Create new data files in the `data/` directory with the language suffix (e.g., `heroData.fr.ts`)
2. Update the `useTranslation` hook in `hooks/useTranslation.ts`
3. Add the new locale to the `LanguageContext`

## 📁 Project Structure

```
├── app/                    # Next.js app directory
├── components/            
│   ├── layout/            # Layout components (Sidebar, Footer, etc.)
│   ├── sections/          # Page sections (Hero, About, Projects, etc.)
│   └── ui/                # Reusable UI components
├── contexts/              # React contexts (Language)
├── data/                  # Content data files
│   ├── *.ts              # Korean content (default)
│   └── *.en.ts           # English content
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
└── public/               # Static assets
    └── projects/         # Project assets and PDFs
```

## 🛠 Technologies Used

- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React Force Graph**: Interactive graph visualization
- **Lucide React**: Modern icon library

## 📱 Responsive Design

The website is fully responsive with:
- Desktop: Full sidebar navigation with hover effects
- Mobile: Collapsible navigation with language toggle
- Tablet: Optimized layouts for medium screens

## 🚀 Deployment

The project is configured for static export:

```bash
npm run build
```

This generates a `out/` directory that can be deployed to any static hosting service.

### AWS S3 + CloudFront Deployment

The project is optimized for AWS deployment with:
- S3 static website hosting
- CloudFront CDN distribution
- Route 53 custom domain
- GitHub Actions CI/CD pipeline

## 📄 Content Management

Content is managed through TypeScript files in the `data/` directory:

- `heroData.ts` / `heroData.en.ts`: Hero section content
- `aboutData.tsx` / `aboutData.en.tsx`: About section content
- `experienceData.ts` / `experienceData.en.ts`: Work experience
- `projectsData.ts` / `projectsData.en.ts`: Project showcases
- `contactData.ts` / `contactData.en.ts`: Contact information

## 🎨 Customization

### Colors
The primary accent color is defined as `#13ecda` (turquoise). Update this in:
- Tailwind config for the `primary` color
- Component styles using `text-[#13ecda]` classes

### Fonts
The project uses Inter font family. Change in `app/layout.tsx`:

```typescript
const inter = Inter({ subsets: ["latin"] });
```

## 📊 Knowledge Graph

The interactive knowledge graph is built from markdown files in the `content/notes/` directory. The graph visualizes:
- Technical expertise areas
- Project relationships
- Skill connections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is for portfolio purposes. Please respect the content and design.

---

Built with ❤️ for the AI-first era.
