import { Trash2, Plus, Move } from "lucide-react"
import { Button } from "../../ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../ui/select"
import { Switch } from "../../ui/switch"
import { Separator } from "../../ui/separator"
import {
  BlockSettingsPanel,
  SettingsSection,
  SettingItem
} from "../block-settings-panel"
import { useBlockEdit } from "../block-edit-context"
import type { TeamContent } from "@/app/dashboard/shops/[id]/components/BlockForm/schemas"
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult
} from "@hello-pangea/dnd"

export const TeamSettingsPanel = () => {
  const { content, handleEdit } = useBlockEdit<TeamContent>()

  const {
    title = "",
    description = "",
    members = [],
    layout = "grid",
    columns = "3",
    showContactInfo = false,
    showSocialLinks = false,
  } = content

  const removeMember = (index: number) => {
    const updatedMembers = members.filter((_, i) => i !== index)
    handleEdit("members", updatedMembers)
  }

  const addNewMember = () => {
    const newMember = {
      name: "New Team Member",
      role: "Team Member",
      bio: "Team member bio",
      photo: "",
      email: "",
      phone: "",
      socialLinks: {
        linkedin: "",
        twitter: "",
        instagram: ""
      }
    }
    const updatedMembers = [...members, newMember]
    handleEdit("members", updatedMembers)
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(members)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    handleEdit("members", items)
  }

  return (
    <BlockSettingsPanel title="Team Block Settings">
      <SettingsSection title="Content">
        <SettingItem label="Title" description="Section title">
          <input
            type="text"
            value={title}
            onChange={(e) => handleEdit("title", e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            placeholder="Enter team section title"
          />
        </SettingItem>

        <SettingItem label="Description" description="Section description">
          <textarea
            value={description}
            onChange={(e) => handleEdit("description", e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            placeholder="Enter team section description"
            rows={3}
          />
        </SettingItem>
      </SettingsSection>

      <Separator />

      <SettingsSection title="Layout">
        <SettingItem
          label="Display Style"
          description="Choose how team members are displayed"
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
        <SettingItem
          label="Show Photos"
          description="Display team member photos"
        >
          <Switch
            checked={showContactInfo}
            onCheckedChange={(checked) =>
              handleEdit("showContactInfo", checked)
            }
          />
        </SettingItem>

        <SettingItem
          label="Show Social Links"
          description="Display social media links"
        >
          <Switch
            checked={showSocialLinks}
            onCheckedChange={(checked) =>
              handleEdit("showSocialLinks", checked)
            }
          />
        </SettingItem>
      </SettingsSection>

      <Separator />

      <SettingsSection title="Team Members">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">
            Members ({members.length})
          </span>
          <Button
            onClick={addNewMember}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Member
          </Button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="team-members">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="max-h-64 space-y-3 overflow-y-auto"
              >
                {members.map((member, index) => (
                  <Draggable
                    key={`${member.name}-${index}`}
                    draggableId={`${member.name}-${index}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-center justify-between rounded-lg border bg-muted/50 p-3 transition-colors ${snapshot.isDragging ? "bg-muted/80 shadow-lg" : ""
                          }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium text-sm">
                            {member.name}
                          </div>
                          <div className="truncate text-muted-foreground text-xs">
                            {member.role}
                          </div>
                        </div>
                        <div className="ml-2 flex items-center gap-2">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing"
                            title="Drag to reorder"
                          >
                            <Move className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            onClick={() => removeMember(index)}
                            title="Remove member"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </SettingsSection>
    </BlockSettingsPanel>
  )
}
