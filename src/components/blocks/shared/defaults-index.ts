// Re-export defaults from individual component folders for backward compatibility
// This maintains the centralized import pattern while defaults are co-located with components

// Layout defaults
export { defaultHeroContent } from "../layout/hero/defaults"
export { defaultMultiColumnContent } from "../layout/multi-column/defaults"
export { defaultDividerContent } from "../layout/divider/defaults"
// export { defaultTwoColumnContent } from "../layout/two-column/defaults" // TODO: create this

// Content defaults  
export { defaultTextContent } from "../content/text/defaults"
export { defaultImageContent } from "../content/image/defaults"
export { defaultGalleryContent } from "../content/gallery/defaults"
export { defaultVideoContent } from "../content/video/defaults"

// Interactive defaults
export { defaultContactFormContent } from "../interactive/contact-form/defaults"
// export { defaultFAQContent } from "../interactive/faq/defaults" // TODO: create this
// export { defaultCallToActionContent } from "../interactive/call-to-action/defaults" // TODO: create this

// Social defaults
export { defaultTestimonialsContent } from "../social/testimonials/defaults"
// export { defaultTeamContent } from "../social/team/defaults" // TODO: create this
// export { defaultSocialFeedContent } from "../social/social-feed/defaults" // TODO: create this

// Specialized defaults  
// export { defaultCoursesContent } from "../specialized/courses/defaults" // TODO: create this
// export { defaultMarineLifeContent } from "../specialized/marine-life/defaults" // TODO: create this
// export { defaultMapContent } from "../specialized/map/defaults" // TODO: create this

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
  defaultContent
} from "./default-data"