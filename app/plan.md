# Portfolio CMS Architecture

## Overview

This project is a cinematic creative portfolio website with:

- custom frontend experience
- custom CMS
- dynamic project/case study builder
- MongoDB document-based architecture
- ImageKit asset management
- Vercel deployment

The frontend experience is fully engineered and cinematic.

The CMS only controls:
- content
- assets
- section composition
- project structure

NOT arbitrary HTML/CSS editing.

---

# Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js |
| Hosting | Vercel |
| Database | MongoDB Atlas |
| Assets | ImageKit |
| Motion | Framer Motion |
| Smooth Scroll | Lenis |
| Styling | SCSS Modules |

---

# Public Routes

## Homepage

```txt
/
```

Cinematic landing page.

Fully custom engineered frontend.

---

## Projects Listing

```txt
/projects
```

Displays all published projects.

---

## Dynamic Project Page

```txt
/projects/[slug]
```

Dynamic case study rendering.

Data fetched from MongoDB.

Rendered using section registry system.

---

# CMS Routes

## Login

```txt
/cms/login
```

Admin authentication page.

---

## CMS Dashboard

```txt
/cms
```

Displays:
- project list
- create project button

---

## Projects Management

```txt
/cms/projects
```

Displays all projects.

---

## Create Project

```txt
/cms/projects/new
```

Create new project.

---

## Edit Project

```txt
/cms/projects/[id]
```

Project editor and section builder.

---

# CMS Architecture

The CMS is NOT a fully freeform website builder.

It is a structured composition system.

Users can:
- add sections
- reorder sections
- configure sections
- upload assets
- change variants

Users CANNOT:
- write arbitrary HTML
- write arbitrary CSS
- freely position elements on a canvas

---

# Builder Structure

Each project contains an ordered list of sections.

Example:

```json
{
  "title": "Nike Campaign",

  "slug": "nike-campaign",

  "sections": []
}
```

---

# Section Architecture

Every section MUST follow this structure:

```json
{
  "id": "hero-1",

  "type": "hero",

  "variant": "fullscreen",

  "props": {}
}
```

---

# Section Rules

## type

Defines the section component.

Examples:
- hero
- gallery
- video
- richText

---

## variant

Defines presentation/layout style.

Examples:
- fullscreen
- carousel
- masonry
- split

---

## props

Contains section-specific data.

Examples:
- text
- images
- video ids
- spacing
- alignment

---

# Initial Section Types

V1 section list:

- Hero
- RichText
- Gallery
- Video
- Spacer

Future sections:
- Metrics
- Marquee
- CTA
- Quote
- Sticky Gallery
- Horizontal Scroll
- Testimonial
- Credits

---

# MongoDB Structure

## Collection

```txt
projects
```

---

## Example Document

```json
{
  "_id": "...",

  "title": "Nike Campaign",

  "slug": "nike-campaign",

  "thumbnail": "...",

  "published": true,

  "sections": [
    {
      "id": "hero-1",

      "type": "hero",

      "variant": "fullscreen",

      "props": {
        "title": "Nike Air",
        "subtitle": "Campaign 2026",
        "image": "https://..."
      }
    }
  ],

  "createdAt": "...",

  "updatedAt": "..."
}
```

---

# Rendering Architecture

## Flow

```txt
MongoDB
→ Fetch project
→ Iterate sections
→ Render React components
```

---

# Section Registry

Example:

```ts
export const sectionRegistry = {
  hero: HeroSection,
  gallery: GallerySection,
  video: VideoSection,
  richText: RichTextSection
}
```

---

# Dynamic Renderer

Example:

```tsx
const Component = sectionRegistry[section.type]

return (
  <Component
    variant={section.variant}
    {...section.props}
  />
)
```

---

# Asset Management

Assets are uploaded to ImageKit.

MongoDB only stores:
- asset URLs
- metadata
- references

Assets are NEVER stored directly inside MongoDB.

---

# Upload Flow

```txt
CMS Upload
→ API Route
→ ImageKit
→ Returns URL
→ Save URL in MongoDB
```

---

# CMS Layout Structure

## Project Editor Layout

```txt
┌────────────┬────────────────────┬─────────────┐
│ Sections   │ Preview            │ Settings    │
│ Sidebar    │ Area               │ Panel       │
└────────────┴────────────────────┴─────────────┘
```

---

# Left Sidebar

Contains:
- section list
- add section button
- drag reorder

---

# Center Area

Displays:
- live preview
- rendered sections

---

# Right Panel

Displays:
- section settings
- props editor
- variant selector
- asset selection

---

# V1 Development Goals

## Infrastructure

- [x] MongoDB Atlas
- [x] Vercel deployment
- [x] ImageKit setup

---

## Frontend

- [ ] Dynamic `/projects/[slug]`
- [ ] Section renderer
- [ ] Section registry
- [ ] Initial section components

---

## CMS

- [ ] Login page
- [ ] Dashboard
- [ ] Create project
- [ ] Edit project
- [ ] Add sections
- [ ] Reorder sections
- [ ] Upload assets

---

# Future Features

Potential future additions:

- drafts
- version history
- multi-user support
- live preview
- nested sections
- responsive variants
- animation presets
- reusable section templates

---

# Important Engineering Rules

## DO

- keep sections structured
- keep variants controlled
- keep frontend engineered
- separate content from presentation

---

## DO NOT

- allow arbitrary HTML
- allow arbitrary CSS
- build freeform canvas positioning
- over-engineer V1

---

# Core Philosophy

This project is:

```txt
A cinematic structured composition system
```

NOT:

```txt
A generic freeform website builder
```
