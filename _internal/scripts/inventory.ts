import { getCliClient } from 'sanity/cli'
const c = getCliClient({ apiVersion: '2024-01-01' })
async function run() {
  const counts = await c.fetch(`{
    "destinations": count(*[_type=="destination" && !(_id in path("drafts.**"))]),
    "cabinTypes": count(*[_type=="cabinType"]),
    "cabins": count(*[_type=="cabin"]),
    "boats": count(*[_type=="boat" && !(_id in path("drafts.**"))]),
    "destinationDefaults": count(*[_id=="destinationDefaults"]),
    "cta": count(*[_id=="cta"]),
    "blogPosts": count(*[_type=="blogPost" && !(_id in path("drafts.**"))]),
    "itineraries": count(*[_type=="itinerary"]),
    "komodoFaqs": count(*[_type=="faq" && references("destination-komodo")]),
    "crewMembers": count(*[_type=="crewMember"])
  }`)
  const komodo = await c.fetch(`*[_id=="destination-komodo"][0]{name,"tagline":defined(tagline),"body":count(overviewBody),"highlights":count(highlights)}`)
  const mari = await c.fetch(`*[_id=="boat-mari"][0]{name,"specs":count(specifications),"stats":count(stats)}`)
  console.log('COUNTS:', JSON.stringify(counts))
  console.log('KOMODO:', JSON.stringify(komodo))
  console.log('MARI BOAT:', JSON.stringify(mari))
}
run().then(()=>process.exit(0),(e)=>{console.error(e);process.exit(1)})
