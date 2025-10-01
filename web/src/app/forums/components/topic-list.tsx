import { ForumTopic } from "../topics";

function formatReplies(replies: number): string {
  return replies.toLocaleString("en-GB");
}

type ForumTopicListProps = {
  topics: ForumTopic[];
};

export function ForumTopicList({ topics }: ForumTopicListProps) {
  return (
    <div className="space-y-4">
      {topics.map((topic) => (
        <article
          key={`${topic.title}-${topic.lastActivity}`}
          className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md"
        >
          <div className="flex flex-wrap items-start gap-2">
            {topic.pinned && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                Pinned
              </span>
            )}
            {topic.tags?.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-3 space-y-2">
            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600">{topic.title}</h3>
            <p className="text-sm text-slate-600">{topic.excerpt}</p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span>{formatReplies(topic.replies)} replies</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:inline" />
            <span>Last activity {topic.lastActivity}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
