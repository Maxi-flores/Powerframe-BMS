import { create } from 'zustand';
import { Widget, WidgetType } from '../types';

interface LayoutState {
  layout: Record<string, Widget>;
  addWidget: (type: WidgetType, slotId: string, size?: { w: number; h: number }) => void;
  moveWidget: (id: string, slotId: string, size?: { w: number; h: number }) => void;
  removeWidget: (slotId: string) => void;
}

export const useLayoutStore = create<LayoutState>(((set)) => ({
  layout: {},

  addWidget: (type, slotId, size = { w: 1, h: 1 }) => set((state) => {
    const newWidget: Widget = {
      type,
      id: `${type}-${Date.now()}`,
      gridSize: size,
    };
    return { layout: { ...state.layout, [slotId]: newWidget } };
  }),

  moveWidget: (id, slotId, size) => set((state) => {
    const widget = Object.values(state.layout).find(w => w.id === id);
    if (!widget) return state;
    const newLayout = { ...state.layout };
    // Remove from old slot
    Object.keys(newLayout).forEach(key => {
      if (newLayout[key].id === id) delete newLayout[key];
    });
    // Add to new
    newLayout[slotId] = { ...widget, gridSize: size || widget.gridSize };
    return { layout: newLayout };
  }),

  removeWidget: (slotId) => set((state) => {
    const newLayout = { ...state.layout };
    delete newLayout[slotId];
    return { layout: newLayout };
  }),
}));
