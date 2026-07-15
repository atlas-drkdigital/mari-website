import { type SchemaTypeDefinition } from 'sanity'

import { seoType } from './objects/seo'
import { linkType } from './objects/link'
import { linkItemType } from './objects/linkItem'
import { navItemType } from './objects/navItem'
import { socialLinkType } from './objects/socialLink'
import { contactEmailType } from './objects/contactEmail'
import { contactPhoneType } from './objects/contactPhone'
import { htmlEmbedType } from './objects/htmlEmbed'
import { richTextBasicType } from './objects/richTextBasic'
import { richTextFullType } from './objects/richTextFull'
import { imageWithAltType } from './objects/imageWithAlt'
import { galleryImageType } from './objects/galleryImage'
import { redirectType } from './documents/redirect'
import { languageType } from './documents/language'
import { navigationType } from './documents/navigation'
import { siteSettingsType } from './documents/siteSettings'
import { announcementBarType } from './documents/announcementBar'
import { pageType } from './documents/page'
import { scheduleRatesType } from './documents/scheduleRates'
import { boatType } from './documents/boat'
import { cabinTypeType } from './documents/cabinType'
import { cabinDocType } from './documents/cabin'
import { homePageType } from './documents/homePage'
import { destinationType } from './documents/destination'
import { itineraryType } from './documents/itinerary'
import { testimonialType } from './documents/testimonial'
import { faqType } from './documents/faq'
import { blogPostType } from './documents/blogPost'
import { blogCategoryType } from './documents/blogCategory'
import { authorType } from './documents/author'
import { whyUsItemType } from './documents/whyUsItem'

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
    richTextBasicType,
    richTextFullType,
    imageWithAltType,
    galleryImageType,
    // documents
    redirectType,
    languageType,
    navigationType,
    siteSettingsType,
    announcementBarType,
    pageType,
    scheduleRatesType,
    boatType,
    cabinTypeType,
    cabinDocType,
    homePageType,
    destinationType,
    itineraryType,
    testimonialType,
    faqType,
    blogPostType,
    blogCategoryType,
    authorType,
    whyUsItemType,
  ],
}
