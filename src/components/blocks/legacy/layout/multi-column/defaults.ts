import type { MultiColumnContent } from "@/components/blocks/shared/schemas"

export const defaultMultiColumnContent: MultiColumnContent = {
  title: "Our Services",
  description: "Set your multi column description here",
  columns: [
    {
      heading: "Service 1",
      body: "Description of service 1"
    },
    {
      heading: "Service 2",
      body: "Description of service 2"
    },
    {
      heading: "Service 3",
      body: "Description of service 3"
    }
  ],
  columnsPerRow: "3",
  alignment: "center",
  showIcons: true
}
