import Image from "next/image"
import { Mail, Phone, Linkedin, Twitter, Instagram } from "lucide-react"
import { Card, CardContent, CardHeader } from "../ui/card"
import type { TeamBlockContent } from "./types"

export const TeamBlock = ({ content }: { content: TeamBlockContent }) => {
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
              <h2 className="mb-4 font-bold text-3xl md:text-4xl">{title}</h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground">{description}</p>
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
                        <Image
                          src={member.photo}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="relative h-32 w-32 overflow-hidden rounded-full">
                        <Image
                          src={member.photo}
                          alt={member.name}
                          width={128}
                          height={128}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <h3 className="mb-1 font-semibold text-xl">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="mb-3 text-muted-foreground">{member.bio}</p>

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
                        <Image
                          src={member.photo}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="relative h-20 w-20 overflow-hidden rounded-full">
                        <Image
                          src={member.photo}
                          alt={member.name}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-xl">{member.name}</h3>
                    <p className="mb-1 text-muted-foreground">{member.role}</p>
                    <p className="text-muted-foreground">{member.bio}</p>

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
      </div>
    </section>
  )
}
