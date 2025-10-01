import { PageWrapper } from "@/app/components/page-wrapper";

const SKELETON_CARD_CLASSES =
  "animate-pulse rounded-2xl border border-white/10 bg-white/5";

export default function LoadingAirportsPage() {
  return (
    <PageWrapper className="space-y-10">
      <header className="space-y-4">
        <div className="space-y-3">
          <div className={`${SKELETON_CARD_CLASSES} h-7 w-44`} />
          <div className={`${SKELETON_CARD_CLASSES} h-4 max-w-xl`} />
          <div className={`${SKELETON_CARD_CLASSES} h-4 max-w-lg`} />
        </div>
      </header>

      <div className="grid gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl shadow-cyan-500/5">
        <div className={`${SKELETON_CARD_CLASSES} h-12 w-full`} />
        <div className={`${SKELETON_CARD_CLASSES} h-12 w-full`} />
        <div className={`${SKELETON_CARD_CLASSES} h-12 w-32`} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className={`${SKELETON_CARD_CLASSES} h-28`} />
        ))}
      </div>

      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <li key={index} className={`${SKELETON_CARD_CLASSES} h-48`} />
        ))}
      </ul>
    </PageWrapper>
  );
}

