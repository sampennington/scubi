import type { ContentStickyContent } from "./content-sticky.schema"

export const defaultContentStickyContent: ContentStickyContent = {
  eyebrow: "Deploy faster",
  title: "A better workflow",
  subtitle:
    "Aliquet nec orci mattis amet quisque ullamcorper neque, nibh sem. At arcu, sit dui mi, nibh dui, diam eget aliquam. Quisque id at vitae feugiat egestas.",
  image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  imageAlt: "App Screenshot",
  content:
    "Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed amet vitae sed turpis id. Id dolor praesent donec est. Odio penatibus risus viverra tellus varius sit neque erat velit. Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed amet vitae sed turpis id.",
  features: [
    {
      icon: "cloud-arrow-up",
      title: "Push to deploy",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione."
    },
    {
      icon: "lock-closed",
      title: "SSL certificates",
      description:
        "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo."
    },
    {
      icon: "server",
      title: "Database backups",
      description:
        "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis."
    }
  ],
  bottomTitle: "No server? No problem.",
  bottomContent:
    "Id orci tellus laoreet id ac. Dolor, aenean leo, ac etiam consequat in. Convallis arcu ipsum urna nibh. Pharetra, euismod vitae interdum mauris enim, consequat vulputate nibh. Maecenas pellentesque id sed tellus mauris, ultrices mauris. Tincidunt enim cursus ridiculus mi. Pellentesque nam sed nullam sed diam turpis ipsum eu a sed convallis diam."
}
