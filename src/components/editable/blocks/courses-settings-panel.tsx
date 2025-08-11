import { Trash2, Plus, Move } from "lucide-react"
import { Button } from "../../ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../ui/select"
import { Separator } from "../../ui/separator"
import {
  BlockSettingsPanel,
  SettingsSection,
  SettingItem
} from "../block-settings-panel"
import { useBlockEdit } from "../block-edit-context"
import type { CoursesContent } from "@/app/dashboard/shops/[id]/components/BlockForm/schemas"
import { Switch } from "@/components/ui/switch"

export const CoursesSettingsPanel = () => {
  const { content, handleEdit } = useBlockEdit<CoursesContent>()

  const {
    layout = "grid",
    columns = "2",
    showPricing = true,
    showLevels = true,
    courses = []
  } = content

  const removeCourse = (index: number) => {
    const updatedCourses = courses.filter((_, i) => i !== index)
    handleEdit("courses", updatedCourses)
  }

  const addNewCourse = () => {
    const newCourse = {
      title: "New Course",
      description: "Course description",
      duration: "2 hours",
      level: "beginner" as const,
      price: 99,
      currency: "USD"
    }
    const updatedCourses = [...courses, newCourse]
    handleEdit("courses", updatedCourses)
  }

  return (
    <BlockSettingsPanel title="Courses Block Settings">
      <SettingsSection title="Layout">
        <SettingItem
          label="Display Style"
          description="Choose how courses are displayed"
        >
          <Select
            value={layout}
            onValueChange={(value) => handleEdit("layout", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid Layout</SelectItem>
              <SelectItem value="list">List Layout</SelectItem>
            </SelectContent>
          </Select>
        </SettingItem>

        <SettingItem
          label="Columns"
          description="Number of columns in grid layout"
        >
          <Select
            value={columns}
            onValueChange={(value) => handleEdit("columns", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 Columns</SelectItem>
              <SelectItem value="3">3 Columns</SelectItem>
              <SelectItem value="4">4 Columns</SelectItem>
            </SelectContent>
          </Select>
        </SettingItem>
      </SettingsSection>

      <Separator />

      <SettingsSection title="Display Options">
        <SettingItem label="Show Pricing" description="Display course prices">
          <Switch
            checked={showPricing}
            onCheckedChange={(checked) => handleEdit("showPricing", checked)}
          />
        </SettingItem>

        <SettingItem
          label="Show Levels"
          description="Display difficulty levels"
        >
          <Switch
            checked={showLevels}
            onCheckedChange={(checked) => handleEdit("showLevels", checked)}
          />
        </SettingItem>
      </SettingsSection>

      <Separator />

      <SettingsSection title="Course Management">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            Courses ({courses.length})
          </span>
          <Button
            onClick={addNewCourse}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        </div>

        <div className="max-h-64 space-y-3 overflow-y-auto">
          {courses.map((course, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border bg-muted/50 p-3"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-sm">
                  {course.title}
                </div>
                <div className="truncate text-muted-foreground text-xs">
                  {course.duration} • {course.level}
                </div>
              </div>
              <div className="ml-2 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                  title="Drag to reorder"
                >
                  <Move className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  onClick={() => removeCourse(index)}
                  title="Remove course"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SettingsSection>
    </BlockSettingsPanel>
  )
}
