import type { StatsContent } from "./stats.schema"

export const defaultStatsContent: StatsContent = {
  title: "Our Achievements",
  description: "Discover the numbers that showcase our expertise and commitment to quality",
  stats: [
    {
      label: "Successful Dives Guided",
      value: "2,500+"
    },
    {
      label: "Certified Divers Trained",
      value: "850"
    },
    {
      label: "Years of Experience",
      value: "15"
    }
  ],
  layout: "grid",
  columns: "3",
  backgroundColor: "#111827",
  textColor: "#ffffff",
  alignment: "center"
}
