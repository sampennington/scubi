import { Trash2, Plus, Move } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  BlockSettingsPanel,
  SettingsSection,
  SettingItem
} from "@/components/editable/settings-panel"
import { useBlockEdit } from "@/components/editable/context"
import type { MultiColumnContent } from "@/components/blocks/schemas"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"

export const MultiColumnSettingsPanel = () => {
  const { content, handleEdit } = useBlockEdit<MultiColumnContent>()

  const {
    title = "",
    description = "",
    columns = [],
    columnsPerRow = "3",
    alignment = "center",
    showIcons = true
  } = content

  const removeColumn = (index: number) => {
    const updatedColumns = columns.filter((_, i) => i !== index)
    handleEdit("columns", updatedColumns)
  }

  const addNewColumn = () => {
    const newColumn = {
      icon: "",
      heading: "New Column",
      body: "Column content goes here"
    }
    const updatedColumns = [...columns, newColumn]
    handleEdit("columns", updatedColumns)
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(columns)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    handleEdit("columns", items)
  }

  return (
    <BlockSettingsPanel title="Multi-Column Block Settings">
      <SettingsSection title="Content">
        <SettingItem label="Title" description="Section title">
          <input
            type="text"
            value={title}
            onChange={(e) => handleEdit("title", e.target.value, true)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            placeholder="Enter section title"
          />
        </SettingItem>

        <SettingItem label="Description" description="Section description">
          <textarea
            value={description}
            onChange={(e) => handleEdit("description", e.target.value, true)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            placeholder="Enter section description"
            rows={3}
          />
        </SettingItem>
      </SettingsSection>

      <Separator />

      <SettingsSection title="Layout">
        <SettingItem label="Columns Per Row" description="Number of columns displayed in each row">
          <Select
            value={columnsPerRow}
            onValueChange={(value) => handleEdit("columnsPerRow", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Column</SelectItem>
              <SelectItem value="2">2 Columns</SelectItem>
              <SelectItem value="3">3 Columns</SelectItem>
              <SelectItem value="4">4 Columns</SelectItem>
            </SelectContent>
          </Select>
        </SettingItem>

        <SettingItem label="Alignment" description="Text alignment for column content">
          <Select value={alignment} onValueChange={(value) => handleEdit("alignment", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </SettingItem>
      </SettingsSection>

      <Separator />

      <SettingsSection title="Display Options">
        <SettingItem label="Show Icons" description="Display column icons">
          <Switch
            checked={showIcons}
            onCheckedChange={(checked) => handleEdit("showIcons", checked)}
          />
        </SettingItem>
      </SettingsSection>

      <Separator />

      <SettingsSection title="Columns">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">Columns ({columns.length})</span>
          <Button onClick={addNewColumn} size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Column
          </Button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="columns">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="max-h-64 space-y-3 overflow-y-auto"
              >
                {columns.map((column, index) => (
                  <Draggable
                    key={`${column.heading}-${index}`}
                    draggableId={`${column.heading}-${index}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-center justify-between rounded-lg border bg-muted/50 p-3 transition-colors ${
                          snapshot.isDragging ? "bg-muted/80 shadow-lg" : ""
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium text-sm">
                            {column.heading || "Untitled Column"}
                          </div>
                          <div className="truncate text-muted-foreground text-xs">
                            {column.body}
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
                            onClick={() => removeColumn(index)}
                            title="Remove column"
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
