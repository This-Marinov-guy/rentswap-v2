// Search-result copy stays separate from the full article headline.
const SEARCH_TITLES: Record<string, string> = {
  "top-english-news-netherlands-housing-swap": "English News for Expats in the Netherlands (2026)",
  "studenten-bijbaan-groningen-2026": "Studentenbijbaan in Groningen (2026)",
  "student-housing-whatsapp-groups-groningen": "Student Housing WhatsApp Groups in Groningen",
  "is-this-legal-common-dutch-housing-situations-explained": "Common Dutch Housing Situations Explained",
  "shared-housing-vs-living-alone-in-the-netherlands-whats-better-for-students": "Shared Housing vs Living Alone in the Netherlands",
  "spending-the-holidays-as-an-international-student-in-the-netherlands-what-its-really-like": "Student Holidays in the Netherlands",
  "eindhoven-guide-from-deadlines-to-dinner-plans-your-5-to-9-after-the-9-to-5": "Eindhoven Guide: Things to Do After Work or Class",
  "guide-on-how-to-receive-duo-in-the-netherlands": "DUO Student Finance in the Netherlands (2026)",
  "find-rental-netherlands-without-competition-practical-playbook": "Finding a Rental in the Netherlands: A Practical Guide",
  "top-5-affordable-neighbourhoods-for-students-in-den-haag": "Affordable Student Neighbourhoods in Den Haag",
  "what-to-do-before-moving-into-a-room-in-the-netherlands": "Moving Into a Room in the Netherlands: Checklist",
  "a-complete-student-guide-to-subrenting-and-subletting-in-the-netherlands": "Student Guide to Subletting in the Netherlands",
  "top-5-affordable-neighbourhoods-for-students-in-rotterdam": "Affordable Student Neighbourhoods in Rotterdam",
  "how-to-spot-a-fake-housing-listing-in-the-netherlands-before-you-lose-money": "How to Spot Fake Housing Listings in the Netherlands",
};

const ENTITIES: Record<string, string> = {
  amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " ",
  ndash: "–", mdash: "—", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", hellip: "…",
};

export function metadataText(html: string): string {
  return html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
      if (!code.startsWith("#")) return ENTITIES[code.toLowerCase()] ?? entity;
      const point = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : Number(code.slice(1));
      return point > 0 && point <= 0x10ffff && !(point >= 0xd800 && point <= 0xdfff)
        ? String.fromCodePoint(point) : " ";
    })
    .replace(/\s+/g, " ")
    .trim();
}

export function blogSearchTitle(slug: string, title: string): string {
  const clean = metadataText(title);
  if (SEARCH_TITLES[slug]) return SEARCH_TITLES[slug];
  const housingCity = clean.match(/^(?:Student accommodation in|Housing WhatsApp groups in|WhatsApp housing group|Room hunting in) (.+?):/i)
    ?? clean.match(/^Find a student room in (.+?) using WhatsApp/i);
  if (housingCity) return `Housing WhatsApp Groups in ${housingCity[1]}`;
  const jobCity = clean.match(/^Werk zoeken in (.+?)\?/i)
    ?? clean.match(/^Parttime werken in (.+?):/i);
  return jobCity ? `Studentenbijbanen in ${jobCity[1]}` : clean;
}

export function blogDescription(excerpt: string, title: string): string {
  const text = metadataText(excerpt) || `${metadataText(title)} — RentSwap housing guide.`;
  if (text.length <= 160) return text;
  const clipped = text.slice(0, 157);
  const boundary = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, boundary > 100 ? boundary : 157).replace(/[.,;:!?—–-]+$/, "")}…`;
}

export function blogPagination(params: { page?: string; perPage?: string }) {
  const requestedPage = Number(params.page);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const requestedSize = Number(params.perPage);
  const perPage = [3, 6, 9].includes(requestedSize) ? requestedSize : 6;
  const query = new URLSearchParams();
  if (page > 1) query.set("page", String(page));
  if (perPage !== 6) query.set("perPage", String(perPage));
  return { page, perPage, path: `/blog${query.size ? `?${query}` : ""}` };
}
