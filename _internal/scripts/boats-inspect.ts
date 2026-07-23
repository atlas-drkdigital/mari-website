import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

client
  .fetch(
    `{
      "mariStats": *[_id=="boat-mari"][0].stats,
      "mariOverviewLen": count(*[_id=="boat-mari"][0].overviewBody),
      "defaults": *[_id=="destinationDefaults"][0]{ boatsEyebrow, boatsHeading, boatsHeadingSingular, boatsCtaText }
    }`,
  )
  .then((r) => {
    console.log(JSON.stringify(r, null, 1))
    process.exit(0)
  })
