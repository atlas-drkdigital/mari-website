import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

// Which content images are missing alt? (drk-seo pass finding, 2026-07-22)
client
  .fetch(
    `{
      "heroAlt": *[_id=="destination-komodo"][0].coverImage.alt,
      "highlights": *[_id=="destination-komodo"][0].highlights[]{ title, "alt": image.alt, "asset": image.asset._ref },
      "posts": *[_type=="blogPost"]{ title, "alt": coverImage.alt, "asset": coverImage.asset._ref },
      "ctaCards": *[_id=="cta"][0].cards[]{ heading, "alt": image.alt, "asset": image.asset._ref }
    }`,
  )
  .then((r) => {
    console.log(JSON.stringify(r, null, 1))
    process.exit(0)
  })
