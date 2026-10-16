import React, { useRef, useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarBlank,
  CaretLeft,
  CaretRight,
  Check,
  CloudSun,
  Plus,
  Sun,
  X,
} from "@phosphor-icons/react";
import "./desktop-chrome.css";
import { trapDialogKey } from "./focus";
const base = import.meta.env.BASE_URL;
function WindowPreview({ window: w, render }) {
  const ref = useRef(null);
  const [width, setWidth] = useState(300);
  useEffect(() => {
    const observer = new ResizeObserver((entries) =>
      setWidth(entries[0].contentRect.width),
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      className="overview-preview"
      ref={ref}
      style={{ height: Math.min(215, (width * w.h) / w.w) }}
    >
      <div
        inert={true}
        className={`overview-window ${w.id === "finder" ? "finder-window" : ""}`}
        style={{ width: w.w, height: w.h, transform: `scale(${width / w.w})` }}
      >
        {render(w)}
      </div>
    </div>
  );
}
export function MissionControl({
  windows,
  renderWindow,
  apps,
  spaces,
  space,
  onSpace,
  onAdd,
  onSelect,
  onClose,
}) {
  return (
    <section className="mission-overview" aria-label="Mission Control">
      <header className="spaces-bar">
        {spaces.map((n) => (
          <button
            className={space === n ? "selected" : ""}
            key={n}
            onClick={() => onSpace(n)}
          >
            <img src={`${base}assets/wallpaper-dark.png`} alt="" />
            <span>Desktop {n}</span>
          </button>
        ))}
        <button className="add-space" aria-label="Add desktop" onClick={onAdd}>
          <Plus size={26} />
        </button>
      </header>
      <div className="overview-grid">
        {windows
          .filter((w) => (w.space || 1) === space)
          .map((w) => (
            <div
              className="overview-card"
              role="button"
              tabIndex={0}
              aria-label={apps.find((a) => a[0] === w.id)?.[1] || w.id}
              key={w.id}
              onClick={() => onSelect(w.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.code === "Space") {
                  e.preventDefault();
                  onSelect(w.id);
                }
              }}
            >
              <WindowPreview window={w} render={renderWindow} />
              <span className="overview-caption">
                <img
                  src={`${base}assets/icons/${apps.find((a) => a[0] === w.id) ? w.id : "finder"}.png`}
                  alt=""
                />
                {apps.find((a) => a[0] === w.id)?.[1] || w.id}
              </span>
            </div>
          ))}
        {!windows.some((w) => (w.space || 1) === space) && (
          <div className="empty-space">
            <p>A little room to focus.</p>
            <span>Open an app from the Dock to get started.</span>
          </div>
        )}
      </div>
      <button className="exit-overview" onClick={onClose}>
        Return to Desktop <span>esc</span>
      </button>
    </section>
  );
}
export function AppSwitcher({ apps, selected, onSelect, onClose }) {
  return (
    <div className="switcher-backdrop" onClick={onClose}>
      <div
        className="app-switcher glass"
        role="dialog"
        aria-label="Application switcher"
        onClick={(e) => e.stopPropagation()}
      >
        {apps.map(([id, name], i) => (
          <button
            className={selected === i ? "selected" : ""}
            key={id}
            onClick={() => onSelect(id)}
          >
            <img src={`${base}assets/icons/${id}.png`} alt="" />
            <span>{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
export function DesktopWidgets({ widgets, onOpen, onRemove }) {
  return (
    <div className="desktop-widget-stack">
      {widgets.map((type) => (
        <div key={type} className="desktop-widget">
          <button
            className="remove-widget"
            aria-label={`Remove ${type} widget`}
            onClick={() => onRemove(type)}
          >
            <X size={11} />
          </button>
          <button
            className={`widget-face ${type === "weather" ? "weather-widget" : "calendar-widget"}`}
            aria-label={`Open ${type === "weather" ? "Weather" : "Calendar"} widget`}
            onClick={() => onOpen(type === "weather" ? "weather" : "calendar")}
          >
            {type === "weather" ? (
              <>
                <b>San Francisco</b>
                <strong>18°</strong>
                <Sun className="widget-sun" size={32} weight="fill" />
                <span>Mostly Clear</span>
                <small>H:21° L:14°</small>
              </>
            ) : (
              <>
                <span>
                  {new Date()
                    .toLocaleDateString("en-US", { weekday: "long" })
                    .toUpperCase()}
                </span>
                <strong>{new Date().getDate()}</strong>
                <small>No more events today</small>
              </>
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
export function WidgetGallery({ widgets, onAdd, onClose }) {
  return (
    <div
      className="widget-gallery glass"
      role="dialog"
      aria-label="Widget gallery"
    >
      <header>
        <h2>Widgets</h2>
        <button aria-label="Close widget gallery" onClick={onClose}>
          <X size={19} />
        </button>
      </header>
      <p>A little of what matters, right on your desktop.</p>
      {[
        ["weather", "Weather", "Sunshine, at a glance."],
        ["calendar", "Calendar", "Keep your day in view."],
      ].map(([type, name, copy]) => (
        <section key={type}>
          <div className={`widget-sample ${type}`}>
            {type === "weather" ? (
              <>
                <CloudSun size={39} weight="light" />
                <strong>18°</strong>
                <small>San Francisco</small>
              </>
            ) : (
              <>
                <CalendarBlank size={35} weight="light" />
                <strong>{new Date().getDate()}</strong>
                <small>
                  {new Date().toLocaleDateString("en-US", { month: "long" })}
                </small>
              </>
            )}
          </div>
          <div>
            <h3>{name}</h3>
            <p>{copy}</p>
            <button
              disabled={widgets.includes(type)}
              onClick={() => onAdd(type)}
            >
              {widgets.includes(type) ? (
                <Check size={15} />
              ) : (
                <Plus size={15} />
              )}{" "}
              {widgets.includes(type) ? "Added" : "Add Widget"}
            </button>
          </div>
        </section>
      ))}
      <button className="widget-done" onClick={onClose}>
        Done
      </button>
    </div>
  );
}
export function WelcomeBanner({ name, onClose, onOpen }) {
  return (
    <aside className="welcome-banner glass" aria-label="Welcome notification">
      <img src={`${base}assets/icons/tips.png`} alt="" />
      <button className="welcome-copy" onClick={onOpen}>
        <small>
          TIPS <span>now</span>
        </small>
        <b>Welcome back, {name}.</b>
        <p>Make yourself at home.</p>
      </button>
      <button
        className="welcome-dismiss"
        aria-label="Dismiss welcome notification"
        onClick={onClose}
      >
        <X size={13} />
      </button>
    </aside>
  );
}
export function ForceQuitDialog({ apps, active, onQuit, onClose }) {
  const dialog = useRef(null);
  const [selected, setSelected] = useState(
    apps.some((a) => a[0] === active) ? active : apps[0]?.[0],
  );
  useEffect(() => {
    (
      dialog.current?.querySelector(".selected") ||
      dialog.current?.querySelector("button")
    )?.focus();
    const key = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  return (
    <div className="force-quit-backdrop" onClick={onClose}>
      <section
        ref={dialog}
        className="force-quit-dialog glass"
        role="dialog"
        aria-modal="true"
        aria-label="Force Quit Applications"
        onKeyDown={trapDialogKey}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Force Quit Applications</h2>
        <p>If an app doesn’t respond, select it and click Force Quit.</p>
        <div className="force-quit-list">
          {apps.map(([id, name]) => (
            <button
              className={selected === id ? "selected" : ""}
              key={id}
              onClick={() => setSelected(id)}
            >
              <img
                src={`${base}assets/icons/${id === "info" ? "finder" : id}.png`}
                alt=""
              />
              {name}
            </button>
          ))}
        </div>
        <small>Unsaved changes in the selected app may be lost.</small>
        <footer>
          <button onClick={onClose}>Cancel</button>
          <button
            disabled={!selected}
            onClick={() => {
              onQuit(selected);
              setSelected(null);
            }}
          >
            {selected === "finder" ? "Relaunch" : "Force Quit"}
          </button>
        </footer>
      </section>
    </div>
  );
}
