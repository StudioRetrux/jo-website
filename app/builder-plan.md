# Project Page Builder V1

## Goal

Build a controlled CMS page builder for project detail pages under `/projects/[slug]`.

The builder edits structured project data in MongoDB. It does not allow arbitrary HTML, CSS, or canvas positioning.

## V1 Page Shape

Project detail pages are composed from these sections:

- Hero: required at top
- Intro Gallery: required content/gallery section
- Image Statement: optional bottom visual statement

Public renderer reads `projects.sections[]` and renders each section by `type` and `variant`.

## Section Data

Every section keeps this shape:

```ts
{
  id: string
  type: string
  variant: string
  props: object
}
```

### Hero

```ts
{
  type: "hero",
  variant: "fullscreen",
  props: {
    eyebrow: string,
    title: string,
    subtitle: string,
    image: { url: string, alt: string }
  }
}
```

### Intro Gallery

```ts
{
  type: "introGallery",
  variant: "asymmetric",
  props: {
    label: string,
    heading: string,
    body: string,
    images: {
      url: string,
      alt: string,
      slot?: "left" | "right" | "center" | "wide"
    }[]
  }
}
```

`slot` is controlled positioning. It maps to existing engineered layouts. It is not freeform CSS.

### Image Statement

```ts
{
  type: "imageStatement",
  variant: "fullBleed",
  props: {
    text: string,
    image: { url: string, alt: string }
  }
}
```

This section is optional. User can remove it from `sections[]`.

## CMS Behavior

- Create project from title and slug.
- Use `_id` for CMS edit route.
- Use `slug` for public route.
- Save project metadata, publish flag, and full `sections[]`.
- Reorder sections with up/down controls.
- Add/remove sections from controlled section templates.
- Add/remove Intro Gallery images.
- Select Intro Gallery image slot from controlled position options.
- Live preview uses same public section renderer.

## Validation

Use Zod as source of truth for accepted project update payloads.

- `slug` required and unique in MongoDB.
- image URLs must be valid URLs.
- Intro Gallery needs at least one image.
- Image Statement can be omitted by removing section.

## Near-Term Hardening

- Add unique MongoDB index: `{ slug: 1 }`.
- Add auth before production CMS use.
- Add ImageKit upload and asset picker.
- Add better section collapse/selection UI once custom design system exists.
