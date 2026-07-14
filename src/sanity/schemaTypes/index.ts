import { type SchemaTypeDefinition } from 'sanity'

import { seoType } from './objects/seo'
import { linkType } from './objects/link'
import { linkItemType } from './objects/linkItem'
import { navItemType } from './objects/navItem'
import { socialLinkType } from './objects/socialLink'
import { contactEmailType } from './objects/contactEmail'
import { contactPhoneType } from './objects/contactPhone'
import { htmlEmbedType } from './objects/htmlEmbed'
import { redirectType } from './documents/redirect'
import { languageType } from './documents/language'
import { navigationType } from './documents/navigation'
import { siteSettingsType } from './documents/siteSettings'
import { announcementBarType } from './documents/announcementBar'
import { pageType } from './documents/page'
import { scheduleRatesType } from './documents/scheduleRates'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // objects
    seoType,
    linkType,
    linkItemType,
    navItemType,
    socialLinkType,
    contactEmailType,
    contactPhoneType,
    htmlEmbedType,
    // documents
    redirectType,
    languageType,
    navigationType,
    siteSettingsType,
    announcementBarType,
    pageType,
    scheduleRatesType,
  ],
}
