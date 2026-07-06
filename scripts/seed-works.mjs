// One-off: seed Postgres Project rows from data/workcards.json.
// Idempotent — upserts by slug, keeps CMS edits to subtitle/sections on re-run.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import pg from "pg";

function loadEnv() {
  for (const file of [".env", ".env.local"]) {
    try {
      const lines = readFileSync(resolve(process.cwd(), file), "utf8").split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq === -1) continue;
        const key = trimmed.slice(0, eq).trim();
        const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
        process.env[key] ??= value;
      }
    } catch {
      // file missing — fine
    }
  }
}

loadEnv();

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL.");
}

const workcards = JSON.parse(
  readFileSync(resolve(process.cwd(), "data/workcards.json"), "utf8"),
);

// Home-carousel description defaults; "\n" splits the two lines.
const subtitles = {
  "home-resort-batu":
    "Redefining the stay experience through\nclarity, comfort, and spatial intention.",
  "resort-room": "A calm, well-crafted room designed\nfor comfort and ease.",
  "untitled-01": "A playful retreat tuned for focus,\nimmersion, and late-night energy.",
  "klinik-evre-manado":
    "A clinic that feels less clinical —\nwarm, intuitive, and calming.",
  "klinik-graha-interna-solo":
    "Healthcare space shaped around\nfamily comfort and quiet trust.",
  "savart-denpasar": "Everyday living elevated by warm\nmaterial and measured light.",
  "playing-room-citraland":
    "A family playing room built for\njoy, motion, and togetherness.",
};

// First 5 works become the seeded home carousel, in this order.
const homeSlugs = workcards.slice(0, 5).map((card) => card.id);

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

try {
  for (const card of workcards) {
    const sections = [
      {
        id: "hero-1",
        type: "hero",
        variant: "fullscreen",
        props: {
          eyebrow: card.category,
          title: card.title,
          subtitle: "Write project summary here.",
          image: { url: card.image, alt: card.title },
        },
      },
    ];

    await client.query(
      `INSERT INTO "Project"
        (id, title, slug, subtitle, thumbnail, "hoverImage",
         published, year, category, sections, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now(), now())
       ON CONFLICT (slug) DO UPDATE SET
         title = EXCLUDED.title,
         subtitle = EXCLUDED.subtitle,
         thumbnail = EXCLUDED.thumbnail,
         "hoverImage" = EXCLUDED."hoverImage",
         published = EXCLUDED.published,
         year = EXCLUDED.year,
         category = EXCLUDED.category,
         "updatedAt" = now()`,
      [
        randomUUID(),
        card.title,
        card.id,
        subtitles[card.id] ?? "Write project summary here.",
        { url: card.image, alt: card.title },
        { url: card.hoverImage, alt: card.title },
        true,
        String(card.year),
        card.category,
        JSON.stringify(sections),
      ],
    );

    console.log(`Seeded: ${card.id}`);
  }

  const { rows } = await client.query(
    `SELECT id, slug FROM "Project" WHERE slug = ANY($1)`,
    [homeSlugs],
  );
  const idBySlug = new Map(rows.map((row) => [row.slug, row.id]));
  const slides = homeSlugs
    .filter((slug) => idBySlug.has(slug))
    .map((slug) => ({ projectId: idBySlug.get(slug) }));

  await client.query(
    `INSERT INTO "HomeConfig" (id, slides) VALUES (1, $1)
     ON CONFLICT (id) DO UPDATE SET slides = EXCLUDED.slides`,
    [JSON.stringify(slides)],
  );

  console.log(`Seeded home config: ${slides.length} slides`);
} finally {
  await client.end();
}
