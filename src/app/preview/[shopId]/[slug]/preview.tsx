import type { Block, Page } from "@/lib/api"

export default function Preview({
  page,
  blocks
}: {
  page: Page
  blocks: Block[]
}) {
  return (
    <div className="h-full w-full bg-white">
      <nav className="flex items-center justify-between p-4 font-bold text-2xl text-black">
        <span className="text-center">Home</span>
        <span className="text-center">About</span>
        <span className="text-center">Contact</span>
      </nav>
      <h1>{page.title}</h1>
      {blocks.map((block) => (
        <div key={block.id}>
          {block.type} {JSON.stringify(block.content)}
        </div>
      ))}
    </div>
  )
}
