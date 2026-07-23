import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })
async function run() {
  const komodo = await client.fetch(`*[_id=="destination-komodo"][0]{name,pageTitle,"slug":slug.current,"stats":count(stats),"highlights":count(highlights),"overviewBlocks":count(overviewBody)}`)
  const defaults = await client.fetch(`*[_id=="destinationDefaults"][0]{faqHeading,boatsEyebrow,upcomingTripsHeading}`)
  const cta = await client.fetch(`*[_id=="cta"][0]{"cards":count(cards)}`)
  const faqs = await client.fetch(`count(*[_type=="faq" && scope=="destination" && references("destination-komodo")])`)
  const itins = await client.fetch(`count(*[_type=="itinerary" && references("destination-komodo")])`)
  const posts = await client.fetch(`*[_type=="blogPost"]{title,"author":author->name,"cat":category->name}`)
  console.log('komodo:', JSON.stringify(komodo))
  console.log('defaults:', JSON.stringify(defaults))
  console.log('cta:', JSON.stringify(cta))
  console.log('komodo FAQ items:', faqs, '| komodo itineraries:', itins)
  console.log('blog posts:', JSON.stringify(posts, null, 0))
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
