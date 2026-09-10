import assert from "node:assert/strict";
import { blogDescription, blogPagination, blogSearchTitle, metadataText } from "../src/lib/blog-seo";
import { createPageMetadata } from "../src/lib/seo";

assert.equal(metadataText("<p>Don&#8217;t miss &amp; share &#x1f6b2;</p>"), "Don’t miss & share 🚲");
assert.equal(metadataText("<script>hidden()</script><p>Visible &#99999999; text</p>"), "Visible text");
assert.equal(blogSearchTitle("unexpected-slug", "Housing WhatsApp groups in Leiden: how students find rooms faster"), "Housing WhatsApp Groups in Leiden");
// The rendered content, rather than an old/misleading slug, determines the city.
assert.equal(blogSearchTitle("student-housing-whatsapp-groups-nijmegen-2", "Student accommodation in Rotterdam: WhatsApp groups, tips, and safety checks"), "Housing WhatsApp Groups in Rotterdam");
assert.equal(blogSearchTitle("plain", "A useful short title"), "A useful short title");
const longDescription = blogDescription("<p>Don&#8217;t miss these practical housing tips. </p>".repeat(10), "Housing guide");
assert.ok(longDescription.length <= 160);
assert.ok(!longDescription.includes("&#"));
assert.ok(longDescription.endsWith("…"));
assert.equal(blogDescription("", "Housing &amp; moving"), "Housing & moving — RentSwap housing guide.");
assert.deepEqual(blogPagination({ page: "2", perPage: "9" }), { page: 2, perPage: 9, path: "/blog?page=2&perPage=9" });
for (const page of ["0", "-1", "2.5", "2oops", "Infinity", "9007199254740993"]) {
  assert.equal(blogPagination({ page, perPage: "999" }).path, "/blog");
}
const pageTwo = createPageMetadata({title:"Housing Guides — Page 2",description:"Page two",path:blogPagination({page:"2"}).path});
assert.equal(pageTwo.alternates?.canonical, "https://www.rentswap.nl/blog?page=2");
console.log("SEO metadata self-test passed: readable entities, city preservation, whole-word summaries, canonical pagination.");
