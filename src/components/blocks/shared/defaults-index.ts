// Re-export defaults from individual component folders for backward compatibility
// This maintains the centralized import pattern while defaults are co-located with components

// Layout defaults
export { defaultHeroContent } from "../legacy/layout/hero/defaults"
export { defaultMultiColumnContent } from "../legacy/layout/multi-column/defaults"
export { defaultDividerContent } from "../legacy/layout/divider/defaults"
// export { defaultTwoColumnContent } from "../layout/two-column/defaults" // TODO: create this

// Content defaults
export { defaultTextContent } from "../legacy/content/text/defaults"
export { defaultImageContent } from "../legacy/content/image/defaults"
export { defaultGalleryContent } from "../legacy/content/gallery/defaults"
export { defaultVideoContent } from "../legacy/content/video/defaults"

// Interactive defaults
export { defaultContactFormContent } from "../legacy/interactive/contact-form/defaults"
// export { defaultFAQContent } from "../legacy/interactive/faq/defaults" // TODO: create this
// export { defaultCallToActionContent } from "../legacy/interactive/call-to-action/defaults" // TODO: create this

// Social defaults
export { defaultTestimonialsContent } from "../legacy/social/testimonials/defaults"
// export { defaultTeamContent } from "../social/team/defaults" // TODO: create this
// export { defaultSocialFeedContent } from "../social/social-feed/defaults" // TODO: create this

// Specialized defaults
// export { defaultCoursesContent } from "../legacy/specialized/courses/defaults" // TODO: create this
// export { defaultMarineLifeContent } from "../legacy/specialized/marine-life/defaults" // TODO: create this
// export { defaultMapContent } from "../legacy/specialized/map/defaults" // TODO: create this

// For components that haven't been moved yet, re-export from old file
export {
  defaultTeamContent,
  defaultFAQContent,
  defaultCallToActionContent,
  defaultSocialFeedContent,
  defaultTwoColumnContent,
  defaultCoursesContent,
  defaultMarineLifeContent,
  defaultMapContent,
  defaultReviewsContent,
  defaultInstagramGalleryContent,
  defaultContent
} from "./default-data"
