/**
 * @file useIDEKeyboard.ts
 * @description IDE global keyboard shortcuts — extracted from IDEMode
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v4.8.4
 * @created 2026-03-19
 * @updated 2026-05-22
 * @status stable
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags ide,hook,keyboard,react
 * @license MIT
 */

import { useEffect } from "react";
import { fileStore as fileStoreActions } from "../../store/file-store";
import { ideStore as ideStoreDirect } from "../../store/ide-store";
import { usePreviewStore } from "../../store/preview-store";

export interface UseIDEKeyboardOptions {
  onSwitchMode: () => void;
  fullscreenPreview: boolean;
  setFullscreenPreview: (v: boolean) => void;
  setViewMode: (m: "edit" | "preview") => void;
  setTerminalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setTerminalExpanded: (v: boolean) => void;
  onOpenGlobalSearch?: () => void;
}

/**
 * Check if the modifier key (Cmd on Mac, Ctrl on others) is pressed.
 * On Mac, `metaKey` (Cmd) is the primary modifier; on other platforms, `ctrlKey`.
 */
function isModPressed(e: KeyboardEvent): boolean {
  const isMac = typeof navigator !== "undefined" && /mac/i.test(navigator.platform);
  return isMac ? e.metaKey : e.ctrlKey;
}

/**
 * Check if the event matches a "mod+key" pattern (Cmd on Mac, Ctrl on others).
 */
function matchModKey(e: KeyboardEvent, key: string): boolean {
  return isModPressed(e) && e.key.toLowerCase() === key.toLowerCase();
}

/**
 * Check if the event matches "mod+shift+key".
 */
function matchModShiftKey(e: KeyboardEvent, key: string): boolean {
  return isModPressed(e) && e.shiftKey && e.key.toLowerCase() === key.toLowerCase();
}

/**
 * Registers all IDE-level keyboard shortcuts.
 * Returns nothing — purely side-effect based.
 *
 * NOTE: Uses `e.stopImmediatePropagation()` to prevent the App-level
 * `useKeyboardShortcuts` handler from also processing the same event.
 */
export function useIDEKeyboard(opts: UseIDEKeyboardOptions): void {
  const previewState = usePreviewStore();
  const {
    onSwitchMode,
    fullscreenPreview,
    setFullscreenPreview,
    setViewMode,
    setTerminalVisible,
    setTerminalExpanded,
    onOpenGlobalSearch,
  } = opts;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape — exit fullscreen preview only (App-level handler closes panels)
      if (e.key === "Escape") {
        if (fullscreenPreview) {
          e.preventDefault();
          e.stopImmediatePropagation();
          setFullscreenPreview(false);
        }
        return;
      }
      // Mod+1 — preview mode (was Ctrl+1, now uses mod semantic)
      if (matchModKey(e, "1")) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setViewMode("preview");
        return;
      }
      // Mod+2 — edit mode
      if (matchModKey(e, "2")) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setViewMode("edit");
        return;
      }
      // Mod+Shift+F — global search
      if (matchModShiftKey(e, "f")) {
        e.preventDefault();
        e.stopImmediatePropagation();
        onOpenGlobalSearch?.();
        return;
      }
      // Mod+\ — toggle split
      if (matchModKey(e, "\\")) {
        e.preventDefault();
        e.stopImmediatePropagation();
        ideStoreDirect.toggleSplit();
        return;
      }
      // Mod+W — close active tab
      if (matchModKey(e, "w")) {
        e.preventDefault();
        e.stopImmediatePropagation();
        ideStoreDirect.closeTab(ideStoreDirect.getState().activeTabId);
        return;
      }
      // Mod+Shift+P — toggle inline preview
      if (matchModShiftKey(e, "p")) {
        e.preventDefault();
        e.stopImmediatePropagation();
        previewState.toggleInlinePreview();
        return;
      }
      // Mod+B — toggle left sidebar
      if (matchModKey(e, "b")) {
        e.preventDefault();
        e.stopImmediatePropagation();
        ideStoreDirect.toggleLeftCollapsed();
        return;
      }
      // Mod+J or Mod+` — toggle terminal
      if (matchModKey(e, "j") || matchModKey(e, "`")) {
        e.preventDefault();
        e.stopImmediatePropagation();
        ideStoreDirect.toggleTerminal();
        setTerminalVisible((v) => {
          if (!v) setTerminalExpanded(false);
          return !v;
        });
        return;
      }
      // Mod+3..9 — switch to tab by index
      if (isModPressed(e) && e.key >= "3" && e.key <= "9") {
        e.preventDefault();
        e.stopImmediatePropagation();
        const tabs = ideStoreDirect.getState().openTabs;
        const tabIdx = parseInt(e.key) - 1;
        if (tabIdx < tabs.length) ideStoreDirect.activateTab(tabs[tabIdx].id);
        return;
      }
      // Mod+E — recent files
      if (matchModKey(e, "e")) {
        e.preventDefault();
        e.stopImmediatePropagation();
        fileStoreActions.toggleRecentPanel();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSwitchMode, fullscreenPreview, setFullscreenPreview, setViewMode, setTerminalVisible, setTerminalExpanded, onOpenGlobalSearch, previewState]);
}
