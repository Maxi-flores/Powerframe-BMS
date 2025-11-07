// src/pages/DashboardPage.tsx
import { useState, useRef, useEffect, forwardRef, createContext, useContext, StrictMode } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import WidgetRenderer from "@/components/widgets/WidgetRenderer";
import "./DashboardPage.css";

// WIDGET CATALOG
const widgetCatalog = [
  { id: "calendar", type: "calendar", name: "Calendar", size: "1x1" },
  { id: "revenue", type: "large-chart", name: "Revenue Chart", size: "2x2" },
  { id: "tasks", type: "metric", name: "Tasks Today", size: "1x1" },
  { id: "deals", type: "deals", name: "Active Deals", size: "1x1" },
  { id: "kanban", type: "kanban", name: "Kanban Board", size: "2x1" },
  { id: "activity", type: "table", name: "Recent Activity", size: "2x1" },
];

// GRID CONFIG
const GRID_ROWS = 3;
const GRID_COLS = 4;
const SLOT_SIZE = 280;
const STORAGE_KEY = "powerframe-dashboard-layout";

type Widget = {
  id: string;
  type: string;
  gridX: number;
  gridY: number;
  width: number;
  height: number;
};

export default function DashboardPage() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);

  // PERSISTENCE: Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setWidgets(JSON.parse(saved));
      } catch (e) {
        console.warn("Failed to load dashboard layout");
      }
    }
  }, []);

  // Save on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
  }, [widgets]);

  // Check if position is valid and not overlapping
  const isPositionValid = (x: number, y: number, width: number, height: number, excludeId?: string): boolean => {
    if (x < 0 || y < 0 || x + width > GRID_COLS || y + height > GRID_ROWS) return false;

    return !widgets.some(w => {
      if (excludeId && w.id === excludeId) return false;
      return (
        x < w.gridX + w.width &&
        x + width > w.gridX &&
        y < w.gridY + w.height &&
        y + height > w.gridY
      );
    });
  };

  const addWidget = (widgetType: any, x: number, y: number) => {
    const [w, h] = widgetType.size.split("x").map(Number);
    if (!isPositionValid(x, y, w, h)) {
      // Find first valid spot
      for (let ty = 0; ty < GRID_ROWS; ty++) {
        for (let tx = 0; tx < GRID_COLS; tx++) {
          if (isPositionValid(tx, ty, w, h)) {
            x = tx; y = ty;
            break;
          }
        }
      }
    }

    const newWidget: Widget = {
      id: `${widgetType.id}-${Date.now()}`,
      type: widgetType.type,
      gridX: x,
      gridY: y,
      width: w,
      height: h,
    };

    setWidgets(prev => [...prev, newWidget]);
    setShowAddMenu(false);
  };

  const moveWidget = (id: string, x: number, y: number) => {
    setWidgets(prev => prev.map(w => {
      if (w.id === id) {
        const validX = Math.max(0, Math.min(x, GRID_COLS - w.width));
        const validY = Math.max(0, Math.min(y, GRID_ROWS - w.height));
        return isPositionValid(validX, validY, w.width, w.height, id)
          ? { ...w, gridX: validX, gridY: validY }
          : w;
      }
      return w;
    }));
  };

  const removeWidget = (id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="dashboard-page">
        <Header pageName="Dashboard" />
        <Sidebar />

        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1 className="page-title">Analytics Overview</h1>
            <button
              className="add-widget-btn"
              onClick={() => setShowAddMenu(true)}
            >
              <span className="plus-icon">+</span>
              Add Widget
            </button>
          </div>

          <WidgetGrid
            widgets={widgets}
            onMoveWidget={moveWidget}
            onDropNew={addWidget}
            onRemoveWidget={removeWidget}
          />
        </main>

        {showAddMenu && (
          <AddWidgetMenu
            catalog={widgetCatalog}
            onClose={() => setShowAddMenu(false)}
            onSelect={(wt) => {
              const empty = findFirstValidSlot(wt);
              if (empty) addWidget(wt, empty.x, empty.y);
            }}
          />
        )}
      </div>
    </DndProvider>
  );
}

// GRID COMPONENT
const WidgetGrid = ({ widgets, onMoveWidget, onDropNew, onRemoveWidget }: any) => {
  const [, drop] = useDrop(() => ({
    accept: ["widget", ...widgetCatalog.map(w => w.type)],
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return;

      const gridRect = document.querySelector(".widget-grid")!.getBoundingClientRect();
      const relX = offset.x - gridRect.left + 20; // drag offset fix
      const relY = offset.y - gridRect.top + 20;

      const x = Math.max(0, Math.floor(relX / SLOT_SIZE));
      const y = Math.max(0, Math.floor(relY / SLOT_SIZE));

      if (item.isNew) {
        onDropNew(item.widgetType, x, y);
      } else {
        onMoveWidget(item.id, x, y);
      }
    },
  }));

  return (
    <div className="widget-grid" ref={drop}>
      {/* Drop slots */}
      {Array.from({ length: GRID_ROWS * GRID_COLS }, (_, i) => {
        const x = i % GRID_COLS;
        const y = Math.floor(i / GRID_COLS);
        const occupied = widgets.some((w: Widget) =>
          x >= w.gridX && x < w.gridX + w.width &&
          y >= w.gridY && y < w.gridY + w.height
        );
        return <DropSlot key={`slot-${i}`} x={x} y={y} occupied={occupied} />;
      })}

      {/* Widgets */}
      {widgets.map((w: Widget) => (
        <DraggableWidget
          key={w.id}
          widget={w}
          onRemove={onRemoveWidget}
        />
      ))}
    </div>
  );
};

const DropSlot = ({ x, y }: { x: number; y: number }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: widgetCatalog.map(w => w.type),
    collect: mon => ({ isOver: mon.isOver() }),
  }));

  return (
    <div
      ref={drop}
      className={`drop-slot ${isOver ? "drag-over" : ""}`}
      style={{
        gridColumn: x + 1,
        gridRow: y + 1,
      }}
    />
  );
};

const DraggableWidget = ({ widget, onRemove }: { widget: Widget; onRemove: (id: string) => void }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "widget",
    item: { id: widget.id },
    collect: mon => ({ isDragging: mon.isDragging() }),
  }));

  return (
    <div
      ref={drag}
      className="widget-container"
      style={{
        gridColumn: `${widget.gridX + 1} / span ${widget.width}`,
        gridRow: `${widget.gridY + 1} / span ${widget.height}`,
        opacity: isDragging ? 0.4 : 1,
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      <button
        className="remove-btn"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(widget.id);
        }}
        title="Remove widget"
      >
        ×
      </button>
      <WidgetRenderer type={widget.type} />
    </div>
  );
};

// MENU
const AddWidgetMenu = ({ catalog, onClose, onSelect }: any) => (
  <div className="add-menu-overlay" onClick={onClose}>
    <div className="add-menu" onClick={e => e.stopPropagation()}>
      <div className="menu-header">
        <h3>Add Widget</h3>
        <button onClick={onClose}>×</button>
      </div>
      <div className="widget-list">
        {catalog.map((wt: any) => (
          <DraggableNewWidget key={wt.id} widgetType={wt} onSelect={onSelect} />
        ))}
      </div>
    </div>
  </div>
);

const DraggableNewWidget = ({ widgetType, onSelect }: any) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: widgetType.type,
    item: { isNew: true, widgetType },
    end: (item, mon) => {
      if (mon.didDrop()) onSelect(item.widgetType);
    },
    collect: mon => ({ isDragging: mon.isDragging() }),
  }));

  return (
    <div
      ref={drag}
      className="new-widget-item"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div>
        <strong>{widgetType.name}</strong>
        <span className="size-tag">{widgetType.size}</span>
      </div>
      <span className="drag-hint">Drag to grid</span>
    </div>
  );
};

// Find first valid slot for new widget
const findFirstValidSlot = (widgetType: any) => {
  const [w, h] = widgetType.size.split("x").map(Number);
  for (let y = 0; y < GRID_ROWS; y++) {
    for (let x = 0; x < GRID_COLS; x++) {
      // Simulate temp check
      const tempValid = true; // In real: check against current widgets
      if (x + w <= GRID_COLS && y + h <= GRID_ROWS) {
        return { x, y };
      }
    }
  }
  return { x: 0, y: 0 };
};