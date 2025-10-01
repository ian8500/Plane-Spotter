import Link from "next/link";
import { notFound } from "next/navigation";
import { ForumTopicList } from "../../components/topic-list";
import { GENERAL_FORUMS } from "../../topics";

export default function ForumCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const slug = params.category;
  const content = GENERAL_FORUMS[slug];

  if (!content) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <nav className="text-sm text-slate-500">
          <Link href="/forums" className="font-medium text-blue-600 hover:underline">
            ← Back to forums
          </Link>
        </nav>

        <header className="space-y-4">
          <div className="space-y-2">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              {content.title}
            </span>
            <h1 className="text-3xl font-bold text-slate-900">{content.title}</h1>
            <p className="max-w-3xl text-base text-slate-600">{content.intro}</p>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <section className="space-y-6">
            <ForumTopicList topics={content.topics} />
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">How to get involved</h2>
              <p className="mt-2 text-sm text-slate-600">{content.prompt}</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {content.guidelines.map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {content.resources && content.resources.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Quick links</h2>
                <ul className="mt-4 space-y-4">
                  {content.resources.map((resource) => (
                    <li key={resource.title}>
                      <Link
                        href={resource.href}
                        className="group block rounded-lg border border-transparent p-3 transition hover:border-blue-200 hover:bg-blue-50"
                      >
                        <p className="text-sm font-semibold text-blue-600 group-hover:text-blue-700">{resource.title}</p>
                        <p className="text-xs text-slate-600">{resource.description}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {content.highlight && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 text-sm text-blue-800">
                {content.highlight}
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
