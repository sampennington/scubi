import Image from "next/image"
import { Mail, Phone, Linkedin, Twitter, Instagram } from "lucide-react"
import type { TeamBlockContent } from "./types"

export const TeamBlock = ({ content }: { content: TeamBlockContent }) => {
  const {
    title,
    description,
    members,
    layout = "grid",
    columns = 3,
    showContactInfo = false,
    showSocialLinks = false
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
          <div className={`grid gap-8 ${gridCols[columns]}`}>
            {members.map((member, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <h3 className="mb-2 text-xl font-semibold">{member.name}</h3>
                <p className="mb-4 text-muted-foreground">{member.role}</p>
                <p className="mb-4 text-muted-foreground">{member.bio}</p>

                {showContactInfo && (member.email || member.phone) && (
                  <div className="mb-4 space-y-2">
                    {member.email && (
                      <div className="flex items-center justify-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${member.email}`}
                          className="text-sm text-primary hover:underline"
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
                          className="text-sm text-primary hover:underline"
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
              </div>
            ))}
          </div>
        )}

        {layout === "list" && (
          <div className="space-y-8">
            {members.map((member, index) => (
              <div
                key={index}
                className="flex items-center gap-6 rounded-lg bg-card p-6"
              >
                <div className="flex-shrink-0">
                  <div className="relative h-20 w-20 overflow-hidden rounded-full">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="mb-2 text-muted-foreground">{member.role}</p>
                  <p className="text-muted-foreground">{member.bio}</p>

                  {showContactInfo && (member.email || member.phone) && (
                    <div className="mt-3 flex gap-4">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <Mail className="h-4 w-4" />
                          {member.email}
                        </a>
                      )}
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
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
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
