export type ForumTopic = {
  title: string;
  excerpt: string;
  replies: number;
  lastActivity: string;
  tags?: string[];
  pinned?: boolean;
};

export type ForumResource = {
  title: string;
  href: string;
  description: string;
};

export type ForumCategoryContent = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  prompt: string;
  topics: ForumTopic[];
  guidelines: string[];
  resources?: ForumResource[];
  highlight?: string;
};

export const GENERAL_FORUMS: Record<string, ForumCategoryContent> = {
  general: {
    slug: "general",
    title: "General Discussion",
    description: "Announcements, feature ideas, and the latest news from the Plane Spotter team.",
    intro:
      "Chat with fellow aviation fans about community news, platform updates, trip reports, and anything that keeps the spotting community buzzing.",
    prompt:
      "Kick off a discussion about your latest project, share feedback for the team, or ask the community for travel tips.",
    topics: [
      {
        title: "Welcome to the Plane Spotter community!",
        excerpt:
          "New around here? Introduce yourself, share your home airport, and let us know what you are most excited to spot this season.",
        replies: 87,
        lastActivity: "1 hour ago",
        tags: ["introductions", "community"],
        pinned: true,
      },
      {
        title: "April platform roadmap and feedback thread",
        excerpt:
          "We have shipped live sector filtering and refreshed airport guides. Tell us what is working well and what you would like to see next.",
        replies: 142,
        lastActivity: "3 hours ago",
        tags: ["roadmap", "feedback"],
      },
      {
        title: "Favourite aviation podcasts right now?",
        excerpt:
          "Looking for new listening material for spotting trips. Drop your favourite ATC or airline podcasts and why you rate them.",
        replies: 36,
        lastActivity: "yesterday",
        tags: ["media", "recommendations"],
      },
    ],
    guidelines: [
      "Be welcoming—reply to at least one new member every week to help them feel at home.",
      "Keep feedback constructive and provide as much context as possible when suggesting improvements.",
      "Use descriptive titles so other spotters can find useful discussions later on.",
    ],
    resources: [
      {
        title: "Product changelog",
        href: "/docs/changelog",
        description: "See the latest features and fixes as they ship.",
      },
      {
        title: "Community code of conduct",
        href: "/docs/community",
        description: "Refresh the guidelines that keep our forums friendly and helpful.",
      },
    ],
  },
  sightings: {
    slug: "sightings",
    title: "Sightings & Alerts",
    description: "Share rare visitors, daily movement logs, and heads-up alerts for your fellow spotters.",
    intro:
      "Log the movements you are catching, coordinate runs to the fence line, and help others keep track of special visitors in your region.",
    prompt:
      "Post your latest photo set, build collaborative movement logs, or give the community a heads-up about diversions.",
    topics: [
      {
        title: "UK wide rare movement tracker",
        excerpt:
          "A rolling thread to capture one-off freighters, mil flights, and unusual bizjet activity across the UK.",
        replies: 213,
        lastActivity: "28 minutes ago",
        tags: ["rare", "movements"],
        pinned: true,
      },
      {
        title: "Weekend cargo surge expected at EMA",
        excerpt:
          "Heads-up for the DHL A330F swap and an Emirates SkyCargo 777 positioning in on Saturday night.",
        replies: 54,
        lastActivity: "2 hours ago",
        tags: ["cargo", "alerts"],
      },
      {
        title: "Share your March military catches",
        excerpt:
          "From Voyagers to visiting NATO heavies—drop photos or logs of the movements you caught this month.",
        replies: 91,
        lastActivity: "yesterday",
        tags: ["military", "photos"],
      },
    ],
    guidelines: [
      "Include timestamps, runway, and direction so others can triangulate the sighting.",
      "Blur or redact sensitive callsigns if a movement should remain discreet.",
      "Tag the airport or region in brackets at the start of your title for clarity.",
    ],
    resources: [
      {
        title: "Live map",
        href: "/live",
        description: "Track aircraft in real-time to confirm callsigns and routes.",
      },
      {
        title: "Spotting logbook",
        href: "/logbook",
        description: "Record the movements you have captured and build your history.",
      },
    ],
  },
  "atc-chat": {
    slug: "atc-chat",
    title: "ATC Chat",
    description: "Discuss phraseology, frequency changes, and real-world ops with fellow aviation communicators.",
    intro:
      "Swap techniques for catching clear audio, decode tricky transmissions, and keep track of recent procedure updates.",
    prompt:
      "Share your scanner setup, ask for help identifying callsigns, or post notes from recent ATC facility visits.",
    topics: [
      {
        title: "Best handheld setup for busy multi-runway fields",
        excerpt:
          "Comparing antenna choices and filters when trying to cover Heathrow and Gatwick from the same location.",
        replies: 68,
        lastActivity: "45 minutes ago",
        tags: ["equipment", "scanner"],
      },
      {
        title: "Understanding London Control sector boundaries",
        excerpt:
          "Looking for a clear breakdown of the TC North sectors and when hand-offs typically occur for northbound departures.",
        replies: 32,
        lastActivity: "today",
        tags: ["procedures", "london-control"],
      },
      {
        title: "Phraseology changes coming with UK Phraseology Guide 2024",
        excerpt:
          "CAA draft guidance suggests updates to read-back requirements—anyone seen implementation timelines?",
        replies: 21,
        lastActivity: "2 days ago",
        tags: ["regulations", "uk"],
      },
    ],
    guidelines: [
      "Keep discussions unclassified—do not share restricted or confidential recordings.",
      "When quoting comms, include the frequency and approximate timestamp for context.",
      "Link to primary sources (AIP updates, NOTAMs) wherever possible.",
    ],
    resources: [
      {
        title: "UK frequency directory",
        href: "/frequencies",
        description: "Browse verified tower, ground, and approach frequencies across the network.",
      },
      {
        title: "ATC equipment discussions",
        href: "/forums/sightings",
        description: "Join the tech talk around antennas and receivers in the sightings community.",
      },
    ],
    highlight: "Controllers and experienced monitors drop in regularly—tag them with @ATC to get insights on complex procedures.",
  },
  other: {
    slug: "other",
    title: "Off-Topic Lounge",
    description: "Everything else—travel stories, photography kit, and the odd off-topic chat after a long day at the fence.",
    intro:
      "Relax with the community after the movements slow down. From trip planning to gear talk, keep things light-hearted and respectful.",
    prompt:
      "Start a casual thread about your latest adventure, organise meetups, or compare camera setups for low-light shooting.",
    topics: [
      {
        title: "2024 spotting trip bucket list",
        excerpt:
          "Share the airports you are hoping to visit this year and tips for making the most of limited travel days.",
        replies: 59,
        lastActivity: "4 hours ago",
        tags: ["travel", "planning"],
      },
      {
        title: "Camera body upgrade advice for night shots",
        excerpt:
          "Looking to move on from a D750—what bodies are you loving for low-light departures?",
        replies: 47,
        lastActivity: "today",
        tags: ["photography", "equipment"],
      },
      {
        title: "Show us your aviation art",
        excerpt:
          "Whether it is models, prints, or digital art, post your favourite aviation-inspired creations.",
        replies: 25,
        lastActivity: "3 days ago",
        tags: ["creative", "community"],
      },
    ],
    guidelines: [
      "Label non-aviation topics clearly so readers know what to expect.",
      "Keep debate respectful—remember we gather here to unwind together.",
      "Use the spoiler tag for large photo dumps to keep threads scroll-friendly.",
    ],
    resources: [
      {
        title: "Photography gear discussion",
        href: "/forums/other",
        description: "Share tips on lenses, backpacks, and editing workflows with fellow spotters.",
      },
      {
        title: "Community meetups",
        href: "/maps",
        description: "Coordinate in-person trips using the shared spotting map and meet fellow members.",
      },
    ],
  },
};

export const GENERAL_FORUM_LIST = Object.values(GENERAL_FORUMS);
