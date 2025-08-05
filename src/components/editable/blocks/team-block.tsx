import { Mail, Phone, Linkedin, Twitter, Instagram } from "lucide-react"
import { Card, CardContent, CardHeader } from "../../ui/card"
import type { TeamContent } from "@/app/dashboard/shops/[id]/components/BlockForm/schemas"

import {
  BlockEditProvider,
  useBlockEdit
} from "@/components/ui/block-edit-context"
import { E } from "@/components/ui/edit-with-context"
import { EditableImage } from "@/components/ui/editable-image"

const defaultContent: TeamContent = {
  title: "Set your team title here",
  description: "Set your team description here",
  members: [],
  layout: "grid",
  columns: "3",
  showContactInfo: false,
  showSocialLinks: false,
  fullWidthPhoto: false
}

const TeamBlockContent = () => {
  const { isSaving, content } = useBlockEdit<TeamContent>()
  const {
    title,
    description,
    members,
    layout = "grid",
    columns = 3,
    showContactInfo = false,
    showSocialLinks = false,
    fullWidthPhoto = false
  } = content

  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {(title || description) && (
          <div className="mb-12 text-center">
            {title && (
              <E.h2
                fieldPath="title"
                className="mb-4 font-bold text-3xl md:text-4xl"
              >
                {title}
              </E.h2>
            )}
            {description && (
              <E.p
                fieldPath="description"
                className="text-lg text-muted-foreground"
              >
                {description}
              </E.p>
            )}
          </div>
        )}

        {layout === "grid" && (
          <div className={`grid gap-6 ${gridCols[columns]}`}>
            {members.map((member, index) => (
              <Card key={index} className="gap-2 text-center">
                <CardHeader className="gap-0">
                  <div className="mb-3 flex justify-center">
                    {fullWidthPhoto ? (
                      <div className="relative h-48 w-full overflow-hidden rounded-lg">
                        <EditableImage
                          fieldPath={`members[${index}].photo`}
                          src={member.photo}
                          alt={member.name}
                          width={400}
                          height={300}
                          className="h-full w-full"
                          aspectRatio="video"
                        />
                      </div>
                    ) : (
                      <div className="relative h-32 w-32 overflow-hidden rounded-full">
                        <EditableImage
                          fieldPath={`members[${index}].photo`}
                          src={member.photo}
                          alt={member.name}
                          width={128}
                          height={128}
                          className="h-full w-full"
                          aspectRatio="square"
                        />
                      </div>
                    )}
                  </div>

                  <E.h3
                    fieldPath={`members[${index}].name`}
                    className="mb-1 font-semibold text-xl"
                  >
                    {member.name}
                  </E.h3>
                  <E.p
                    fieldPath={`members[${index}].role`}
                    className="text-muted-foreground"
                  >
                    {member.role}
                  </E.p>
                </CardHeader>

                <CardContent className="pt-0">
                  <E.p
                    fieldPath={`members[${index}].bio`}
                    className="mb-3 text-muted-foreground"
                  >
                    {member.bio}
                  </E.p>

                  {showContactInfo && (member.email || member.phone) && (
                    <div className="mb-3 space-y-1">
                      {member.email && (
                        <div className="flex items-center justify-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`mailto:${member.email}`}
                            className="text-primary text-sm hover:underline"
                          >
                            {member.email}
                          </a>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center justify-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`tel:${member.phone}`}
                            className="text-primary text-sm hover:underline"
                          >
                            {member.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {showSocialLinks && member.socialLinks && (
                    <div className="flex justify-center gap-3">
                      {member.socialLinks.linkedin && (
                        <a
                          href={member.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {member.socialLinks.twitter && (
                        <a
                          href={member.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                      {member.socialLinks.instagram && (
                        <a
                          href={member.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Instagram className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {layout === "list" && (
          <div className="space-y-4">
            {members.map((member, index) => (
              <Card key={index}>
                <CardContent className="flex items-center gap-6 p-6">
                  <div className="flex-shrink-0">
                    {fullWidthPhoto ? (
                      <div className="relative h-24 w-32 overflow-hidden rounded-lg">
                        <EditableImage
                          fieldPath={`members[${index}].photo`}
                          src={member.photo}
                          alt={member.name}
                          width={128}
                          height={96}
                          className="h-full w-full"
                          aspectRatio="video"
                        />
                      </div>
                    ) : (
                      <div className="relative h-20 w-20 overflow-hidden rounded-full">
                        <EditableImage
                          fieldPath={`members[${index}].photo`}
                          src={member.photo}
                          alt={member.name}
                          width={80}
                          height={80}
                          className="h-full w-full"
                          aspectRatio="square"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <E.h3
                      fieldPath={`members[${index}].name`}
                      className="font-semibold text-xl"
                    >
                      {member.name}
                    </E.h3>
                    <E.p
                      fieldPath={`members[${index}].role`}
                      className="mb-1 text-muted-foreground"
                    >
                      {member.role}
                    </E.p>
                    <E.p
                      fieldPath={`members[${index}].bio`}
                      className="text-muted-foreground"
                    >
                      {member.bio}
                    </E.p>

                    {showContactInfo && (member.email || member.phone) && (
                      <div className="mt-2 flex gap-4">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="flex items-center gap-2 text-primary text-sm hover:underline"
                          >
                            <Mail className="h-4 w-4" />
                            {member.email}
                          </a>
                        )}
                        {member.phone && (
                          <a
                            href={`tel:${member.phone}`}
                            className="flex items-center gap-2 text-primary text-sm hover:underline"
                          >
                            <Phone className="h-4 w-4" />
                            {member.phone}
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {showSocialLinks && member.socialLinks && (
                    <div className="flex gap-3">
                      {member.socialLinks.linkedin && (
                        <a
                          href={member.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {member.socialLinks.twitter && (
                        <a
                          href={member.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                      {member.socialLinks.instagram && (
                        <a
                          href={member.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Instagram className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isSaving && (
          <div className="absolute top-4 right-4 rounded bg-black/50 px-2 py-1 text-sm text-white">
            Saving...
          </div>
        )}
      </div>
    </section>
  )
}

export const TeamBlock = ({
  content = defaultContent,
  blockId
}: {
  content?: TeamContent
  blockId?: string
}) => {
  return (
    <BlockEditProvider<TeamContent>
      blockId={blockId}
      initialContent={content}
      type="team"
    >
      <TeamBlockContent />
    </BlockEditProvider>
  )
}
