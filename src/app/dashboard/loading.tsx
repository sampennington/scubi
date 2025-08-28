import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function DashboardLoading() {
  return (
    <LoadingSpinner 
      message="Loading dashboard..." 
      className="bg-gray-50"
    />
  )
}