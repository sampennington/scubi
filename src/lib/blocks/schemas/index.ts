// Re-export all schemas and types from new individual files
export * from './hero.schema'
export * from './text.schema'
export * from './image.schema'
export * from './gallery.schema'
export * from './multi-column.schema'
export * from './testimonials.schema'

// Re-export remaining schemas from old file for backwards compatibility
// TODO: Move these to individual schema files
export {
  TeamContentSchema,
  FAQContentSchema,
  ContactFormContentSchema,
  CallToActionContentSchema,
  VideoContentSchema,
  MapContentSchema,
  SocialFeedContentSchema,
  DividerContentSchema,
  TwoColumnContentSchema,
  CoursesContentSchema,
  MarineLifeContentSchema,
  ReviewsContentSchema,
  type TeamContent,
  type FAQContent,
  type ContactFormContent,
  type CallToActionContent,
  type VideoContent,
  type MapContent,
  type SocialFeedContent,
  type DividerContent,
  type TwoColumnContent,
  type CoursesContent,
  type MarineLifeContent,
  type ReviewsContent,
  isTeamContent,
  isFAQContent,
  isContactFormContent,
  isCallToActionContent,
  isVideoContent,
  isMapContent,
  isSocialFeedContent,
  isDividerContent,
  isTwoColumnContent,
  isCoursesContent,
  isMarineLifeContent,
  isReviewsContent,
  BlockSchemas,
  typeGuardMap
} from '../../../components/blocks/shared/schemas'