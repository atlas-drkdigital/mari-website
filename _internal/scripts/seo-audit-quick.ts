import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Quick audit (2026-07-22): which seo descriptions exceed the 160-char warning, what siteTitle
// holds, and what blog posts/categories exist (for the destination Articles section seed).

async function run() {
  const docs = await client.fetch(
    `*[defined(seo.description)]{ _id, "t": seo.title, "tLen": length(seo.title), "dLen": length(seo.description) }`,
  )
  for (const d of docs) console.log(`${d._id}: title ${d.tLen} chars ("${d.t}"), desc ${d.dLen} chars`)
  const site = await client.fetch(`*[_id == 'siteSettings'][0]{ siteTitle }`)
  console.log('siteSettings.siteTitle:', JSON.stringify(site))
  const posts = await client.fetch(
    `*[_type == 'blogPost']{ _id, title, postDate, "cat": category->name, "dest": relatedDestination->name, "hasCover": defined(coverImage) }`,
  )
  console.log('posts:', JSON.stringify(posts, null, 2))
  const cats = await client.fetch(`*[_type == 'blogCategory']{ _id, name }`)
  console.log('categories:', JSON.stringify(cats))
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
