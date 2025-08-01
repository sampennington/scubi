export const SettingsSection = ({
  children,
  title
}: {
  children: React.ReactNode
  title: string
}) => {
  return (
    <div className="mt-4 flex flex-col gap-3">
      <h3 className="font-semibold text-lg">{title}</h3>
      {children}
    </div>
  )
}
