import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

client
  .fetch(
    `*[_type=="itinerary"]{_id, title, duration, route, summary, highlights, "dest": destination->name}`,
  )
  .then((r) => {
    console.log(JSON.stringify(r, null, 1))
    process.exit(0)
  })
