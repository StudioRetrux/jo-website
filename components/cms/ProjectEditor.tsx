"use client";

import Link from "next/link";
import { useDeferredValue, useState, useTransition } from "react";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { createSectionTemplate, slugifyProjectTitle, type CmsSectionType } from "@/lib/projects/defaults";
import type { ProjectUpdateInput } from "@/lib/projects/schema";
import type { IntroGalleryImageSlot, Project, ProjectSection } from "@/lib/projects/types";
import { updateProjectAction } from "@/app/cms/projects/actions";
import styles from "./projectEditor.module.css";

type SaveState = {
  status: "idle" | "success" | "error";
  message: string;
};

type ProjectEditorProps = {
  project: Project;
};

const introGallerySlots: { value: IntroGalleryImageSlot; label: string }[] = [
  { value: "left", label: "Left offset" },
  { value: "right", label: "Right tall" },
  { value: "center", label: "Center" },
  { value: "wide", label: "Wide" },
];

function createProjectDraft(project: Project): ProjectUpdateInput {
  return {
    title: project.title,
    slug: project.slug,
    subtitle: project.subtitle,
    thumbnail: project.thumbnail,
    published: project.published,
    year: project.year,
    category: project.category,
    sections: project.sections,
  };
}

function newSectionId(type: CmsSectionType) {
  return `${type}-${crypto.randomUUID().slice(0, 8)}`;
}

export function ProjectEditor({ project }: ProjectEditorProps) {
  const [draft, setDraft] = useState<ProjectUpdateInput>(() => createProjectDraft(project));
  const [saveState, setSaveState] = useState<SaveState>({
    status: "idle",
    message: "",
  });
  const [isPending, startSaving] = useTransition();
  const deferredTitle = useDeferredValue(draft.title);
  const deferredSections = useDeferredValue(draft.sections);

  function setField<K extends keyof ProjectUpdateInput>(
    key: K,
    value: ProjectUpdateInput[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function updateSection(index: number, next: ProjectSection) {
    setDraft((current) => ({
      ...current,
      sections: current.sections.map((section, sectionIndex) =>
        sectionIndex === index ? next : section,
      ),
    }));
  }

  function removeSection(index: number) {
    setDraft((current) => ({
      ...current,
      sections: current.sections.filter((_, sectionIndex) => sectionIndex !== index),
    }));
  }

  function moveSection(index: number, direction: -1 | 1) {
    setDraft((current) => {
      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= current.sections.length) {
        return current;
      }

      const sections = [...current.sections];
      const [section] = sections.splice(index, 1);
      sections.splice(nextIndex, 0, section);

      return {
        ...current,
        sections,
      };
    });
  }

  function addSection(type: CmsSectionType) {
    setDraft((current) => ({
      ...current,
      sections: [...current.sections, createSectionTemplate(type, newSectionId(type))],
    }));
  }

  function syncSlugWithTitle(title: string) {
    setDraft((current) => {
      const nextSlug = slugifyProjectTitle(title) || current.slug;

      return {
        ...current,
        title,
        slug: nextSlug,
      };
    });
  }

  function saveProject() {
    setSaveState({
      status: "idle",
      message: "",
    });

    startSaving(async () => {
      const result = await updateProjectAction(project.id, draft);
      setSaveState(result);
    });
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div>
          <p>CMS / Projects / {project.id}</p>
          <h1>{draft.title}</h1>
        </div>

        <div className={styles.headerActions}>
          <Link href="/cms/projects">Back to projects</Link>
          <Link href={`/projects/${draft.slug}`} target="_blank">
            Open public page
          </Link>
          <button type="button" onClick={saveProject} disabled={isPending}>
            {isPending ? "Saving..." : "Save project"}
          </button>
        </div>
      </header>

      <div className={styles.layout}>
        <section className={styles.sidebar}>
          <div className={styles.panel}>
            <h2>Project</h2>

            <label>
              <span>Title</span>
              <input
                value={draft.title}
                onChange={(event) => syncSlugWithTitle(event.target.value)}
              />
            </label>

            <label>
              <span>Slug</span>
              <input
                value={draft.slug}
                onChange={(event) => setField("slug", event.target.value)}
              />
            </label>

            <label>
              <span>Subtitle</span>
              <textarea
                value={draft.subtitle}
                onChange={(event) => setField("subtitle", event.target.value)}
                rows={3}
              />
            </label>

            <div className={styles.row}>
              <label>
                <span>Category</span>
                <input
                  value={draft.category}
                  onChange={(event) => setField("category", event.target.value)}
                />
              </label>

              <label>
                <span>Year</span>
                <input
                  value={draft.year}
                  onChange={(event) => setField("year", event.target.value)}
                />
              </label>
            </div>

            <label>
              <span>Thumbnail URL</span>
              <input
                value={draft.thumbnail.url}
                onChange={(event) =>
                  setField("thumbnail", {
                    ...draft.thumbnail,
                    url: event.target.value,
                  })
                }
              />
            </label>

            <label>
              <span>Thumbnail alt</span>
              <input
                value={draft.thumbnail.alt}
                onChange={(event) =>
                  setField("thumbnail", {
                    ...draft.thumbnail,
                    alt: event.target.value,
                  })
                }
              />
            </label>

            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(event) => setField("published", event.target.checked)}
              />
              <span>Published</span>
            </label>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <h2>Sections</h2>
              <span>{draft.sections.length}</span>
            </div>

            <div className={styles.sectionAdd}>
              <button type="button" onClick={() => addSection("hero")}>
                + Hero
              </button>
              <button type="button" onClick={() => addSection("introGallery")}>
                + Intro Gallery
              </button>
              <button type="button" onClick={() => addSection("imageStatement")}>
                + Image Statement
              </button>
            </div>

            <div className={styles.sectionList}>
              {draft.sections.map((section, index) => (
                <article key={section.id} className={styles.sectionCard}>
                  <div className={styles.sectionCardHeader}>
                    <div>
                      <strong>{section.type}</strong>
                      <span>{section.id}</span>
                    </div>

                    <div className={styles.sectionCardActions}>
                      <button type="button" onClick={() => moveSection(index, -1)}>
                        Up
                      </button>
                      <button type="button" onClick={() => moveSection(index, 1)}>
                        Down
                      </button>
                      <button type="button" onClick={() => removeSection(index)}>
                        Remove
                      </button>
                    </div>
                  </div>

                  {section.type === "hero" ? (
                    <div className={styles.fieldGroup}>
                      <label>
                        <span>Eyebrow</span>
                        <input
                          value={section.props.eyebrow}
                          onChange={(event) =>
                            updateSection(index, {
                              ...section,
                              props: {
                                ...section.props,
                                eyebrow: event.target.value,
                              },
                            })
                          }
                        />
                      </label>
                      <label>
                        <span>Title</span>
                        <input
                          value={section.props.title}
                          onChange={(event) =>
                            updateSection(index, {
                              ...section,
                              props: {
                                ...section.props,
                                title: event.target.value,
                              },
                            })
                          }
                        />
                      </label>
                      <label>
                        <span>Subtitle</span>
                        <textarea
                          value={section.props.subtitle}
                          rows={3}
                          onChange={(event) =>
                            updateSection(index, {
                              ...section,
                              props: {
                                ...section.props,
                                subtitle: event.target.value,
                              },
                            })
                          }
                        />
                      </label>
                      <label>
                        <span>Image URL</span>
                        <input
                          value={section.props.image.url}
                          onChange={(event) =>
                            updateSection(index, {
                              ...section,
                              props: {
                                ...section.props,
                                image: {
                                  ...section.props.image,
                                  url: event.target.value,
                                },
                              },
                            })
                          }
                        />
                      </label>
                      <label>
                        <span>Image alt</span>
                        <input
                          value={section.props.image.alt}
                          onChange={(event) =>
                            updateSection(index, {
                              ...section,
                              props: {
                                ...section.props,
                                image: {
                                  ...section.props.image,
                                  alt: event.target.value,
                                },
                              },
                            })
                          }
                        />
                      </label>
                    </div>
                  ) : null}

                  {section.type === "introGallery" ? (
                    <div className={styles.fieldGroup}>
                      <label>
                        <span>Label</span>
                        <input
                          value={section.props.label}
                          onChange={(event) =>
                            updateSection(index, {
                              ...section,
                              props: {
                                ...section.props,
                                label: event.target.value,
                              },
                            })
                          }
                        />
                      </label>
                      <label>
                        <span>Heading</span>
                        <textarea
                          value={section.props.heading}
                          rows={4}
                          onChange={(event) =>
                            updateSection(index, {
                              ...section,
                              props: {
                                ...section.props,
                                heading: event.target.value,
                              },
                            })
                          }
                        />
                      </label>
                      <label>
                        <span>Body</span>
                        <textarea
                          value={section.props.body}
                          rows={4}
                          onChange={(event) =>
                            updateSection(index, {
                              ...section,
                              props: {
                                ...section.props,
                                body: event.target.value,
                              },
                            })
                          }
                        />
                      </label>

                      {section.props.images.map((image, imageIndex) => (
                        <div className={styles.imageEditor} key={`${section.id}-${imageIndex}`}>
                          <div className={styles.imageEditorHead}>
                            <strong>Image {imageIndex + 1}</strong>
                            <button
                              type="button"
                              onClick={() =>
                                updateSection(index, {
                                  ...section,
                                  props: {
                                    ...section.props,
                                    images: section.props.images.filter(
                                      (_, entryIndex) => entryIndex !== imageIndex,
                                    ),
                                  },
                                })
                              }
                              disabled={section.props.images.length === 1}
                            >
                              Remove
                            </button>
                          </div>

                          <div className={styles.row}>
                            <label>
                              <span>Position</span>
                              <select
                                value={image.slot ?? introGallerySlots[imageIndex % introGallerySlots.length].value}
                                onChange={(event) =>
                                  updateSection(index, {
                                    ...section,
                                    props: {
                                      ...section.props,
                                      images: section.props.images.map((entry, entryIndex) =>
                                        entryIndex === imageIndex
                                          ? {
                                              ...entry,
                                              slot: event.target.value as IntroGalleryImageSlot,
                                            }
                                          : entry,
                                      ),
                                    },
                                  })
                                }
                              >
                                {introGallerySlots.map((slot) => (
                                  <option value={slot.value} key={slot.value}>
                                    {slot.label}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label>
                              <span>Alt</span>
                              <input
                                value={image.alt}
                                onChange={(event) =>
                                  updateSection(index, {
                                    ...section,
                                    props: {
                                      ...section.props,
                                      images: section.props.images.map((entry, entryIndex) =>
                                        entryIndex === imageIndex
                                          ? { ...entry, alt: event.target.value }
                                          : entry,
                                      ),
                                    },
                                  })
                                }
                              />
                            </label>
                          </div>

                          <label>
                            <span>Image URL</span>
                            <input
                              value={image.url}
                              onChange={(event) =>
                                updateSection(index, {
                                  ...section,
                                  props: {
                                    ...section.props,
                                    images: section.props.images.map((entry, entryIndex) =>
                                      entryIndex === imageIndex
                                        ? { ...entry, url: event.target.value }
                                        : entry,
                                    ),
                                  },
                                })
                              }
                            />
                          </label>
                        </div>
                      ))}

                      <button
                        type="button"
                        className={styles.addInline}
                        onClick={() =>
                          updateSection(index, {
                            ...section,
                            props: {
                              ...section.props,
                              images: [
                                ...section.props.images,
                                {
                                  url: section.props.images[0]?.url ?? "",
                                  alt: "Gallery image",
                                  slot: "wide",
                                },
                              ],
                            },
                          })
                        }
                      >
                        + Add gallery image
                      </button>
                    </div>
                  ) : null}

                  {section.type === "imageStatement" ? (
                    <div className={styles.fieldGroup}>
                      <label>
                        <span>Statement</span>
                        <textarea
                          value={section.props.text}
                          rows={4}
                          onChange={(event) =>
                            updateSection(index, {
                              ...section,
                              props: {
                                ...section.props,
                                text: event.target.value,
                              },
                            })
                          }
                        />
                      </label>
                      <label>
                        <span>Image URL</span>
                        <input
                          value={section.props.image.url}
                          onChange={(event) =>
                            updateSection(index, {
                              ...section,
                              props: {
                                ...section.props,
                                image: {
                                  ...section.props.image,
                                  url: event.target.value,
                                },
                              },
                            })
                          }
                        />
                      </label>
                      <label>
                        <span>Image alt</span>
                        <input
                          value={section.props.image.alt}
                          onChange={(event) =>
                            updateSection(index, {
                              ...section,
                              props: {
                                ...section.props,
                                image: {
                                  ...section.props.image,
                                  alt: event.target.value,
                                },
                              },
                            })
                          }
                        />
                      </label>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.preview}>
          <div className={styles.previewBar}>
            <div>
              <strong>{draft.published ? "Published" : "Draft"}</strong>
              <span>/projects/{draft.slug}</span>
            </div>
            <p>{saveState.message}</p>
          </div>

          <div className={styles.previewFrame}>
            <div className={styles.previewHeader}>
              <span>Johannes Alexander</span>
              <span>{deferredTitle}</span>
            </div>
            <SectionRenderer sections={deferredSections} />
          </div>
        </section>
      </div>
    </div>
  );
}
