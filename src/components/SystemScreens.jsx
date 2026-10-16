import React, { useEffect, useRef, useState } from "react";
import {
  AppleLogo,
  ArrowRight,
  ArrowUUpLeft,
  ArrowsClockwise,
  BatteryFull,
  CaretLeft,
  CaretRight,
  Check,
  CircleNotch,
  Fingerprint,
  Globe,
  Moon,
  Power,
  Question,
  UserCircle,
  Users,
  WifiHigh,
  Wheelchair,
  X,
} from "@phosphor-icons/react";
import "./system.css";
import { trapDialogKey } from "./focus";
const base = import.meta.env.BASE_URL;
export const profiles = {
  Tin: { name: "Tin", image: `${base}assets/photos/6.jpg` },
  Guest: { name: "Guest User", image: `${base}assets/photos/7.jpg` },
};

export function SystemScreen({
  phase,
  clock,
  user,
  light,
  onUnlock,
  onWake,
  onPower,
  onUser,
}) {
  const [password, setPassword] = useState("");
  const [showUsers, setShowUsers] = useState(false);
  const [hint, setHint] = useState(false);
  const [language, setLanguage] = useState(false);
  const [powerMenu, setPowerMenu] = useState(false);
  const [accessibility, setAccessibility] = useState(false);
  const input = useRef(null);
  const profile = profiles[user];
  const login =
    phase === "login" || phase === "locked" || phase === "unlocking";
  useEffect(() => {
    setPassword("");
    setShowUsers(false);
    setHint(false);
    setPowerMenu(false);
  }, [phase, user]);
  useEffect(() => {
    if (!login || phase === "unlocking") return;
    const timer = setTimeout(
      () => input.current?.focus({ preventScroll: true }),
      180,
    );
    return () => clearTimeout(timer);
  }, [login, phase, user, showUsers]);
  useEffect(() => {
    if (phase !== "sleep") return;
    const wake = (e) => {
      e.preventDefault();
      onWake();
    };
    window.addEventListener("keydown", wake);
    return () => window.removeEventListener("keydown", wake);
  }, [phase, onWake]);
  if (phase === "desktop") return null;
  if (phase === "boot")
    return (
      <section className="boot-screen" aria-label="Starting macOS">
        <AppleLogo size={77} weight="fill" />
        <div className="boot-progress">
          <span />
        </div>
        <span className="screen-reader-only">Starting up…</span>
      </section>
    );
  if (phase === "sleep")
    return (
      <button className="sleep-screen" aria-label="Wake Mac" onClick={onWake}>
        <span>Click or press any key to wake</span>
      </button>
    );
  if (phase === "off")
    return (
      <section className="off-screen" aria-label="Mac is shut down">
        <button onClick={() => onPower("start")} aria-label="Start Mac">
          <Power size={28} />
          <span>Click to start</span>
        </button>
      </section>
    );
  return (
    <section
      className={`system-login ${phase === "unlocking" ? "unlocking" : ""}`}
      aria-label={phase === "locked" ? "Lock screen" : "Login screen"}
    >
      <div className={`login-wallpaper ${light ? "is-light" : ""}`} />
      <div className="login-shade" />
      <div className="login-status">
        <button
          aria-label="Input language"
          onClick={() => setLanguage(!language)}
        >
          ABC <Globe size={14} />
        </button>
        <BatteryFull size={23} />
        <WifiHigh size={19} />
        <button
          aria-label="Power options"
          onClick={() => setPowerMenu(!powerMenu)}
        >
          <Power size={17} />
        </button>
      </div>
      {powerMenu && (
        <div className="login-power-menu glass">
          {[
            [Moon, "Sleep", "sleep"],
            [ArrowsClockwise, "Restart", "restart"],
            [Power, "Shut Down", "shutdown"],
          ].map(([I, label, action]) => (
            <button
              key={action}
              onClick={() => {
                setPowerMenu(false);
                onPower(action);
              }}
            >
              <span>
                <I size={20} />
              </span>
              {label}
            </button>
          ))}
        </div>
      )}

      {language && (
        <div className="login-language glass">
          <b>Input Sources</b>
          <button onClick={() => setLanguage(false)}>
            <Check size={15} />
            ABC — English
          </button>
          <button onClick={() => setLanguage(false)}>
            <Globe size={15} />
            Croatian
          </button>
        </div>
      )}
      <div className="login-clock">
        <p>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1>{clock}</h1>
      </div>
      <div className="login-identity">
        {showUsers ? (
          <div className="login-users" aria-label="Choose a user">
            {Object.entries(profiles).map(([key, p]) => (
              <button
                key={key}
                onClick={() => {
                  onUser(key);
                  setShowUsers(false);
                }}
              >
                <img src={p.image} alt="" />
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <>
            <button
              className="login-avatar"
              aria-label="Switch user"
              onClick={() => setShowUsers(true)}
            >
              <img src={profile.image} alt={`${profile.name} account`} />
            </button>
            <h2>{profile.name}</h2>
            {phase === "unlocking" ? (
              <CircleNotch className="login-spinner" size={24} />
            ) : (
              <form
                className="login-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setPassword("");
                  onUnlock();
                }}
              >
                <div className="login-password">
                  <input
                    ref={input}
                    type="password"
                    autoComplete="off"
                    aria-label="Demo password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="submit" aria-label="Log in">
                    <ArrowRight size={17} weight="bold" />
                  </button>
                </div>
                <button
                  className="password-help"
                  type="button"
                  aria-label="Password hint"
                  onClick={() => setHint(!hint)}
                >
                  <Question size={18} />
                </button>
                <p className="login-hint">
                  {hint
                    ? "This is a demo. Any password works."
                    : "Press Return to enter. No password needed."}
                </p>
                {phase === "locked" && (
                  <button className="touch-id" type="button" onClick={onUnlock}>
                    <Fingerprint size={18} />
                    <span>
                      {phase === "locked"
                        ? "Unlock with Touch ID"
                        : "Log in with Touch ID"}
                    </span>
                  </button>
                )}
              </form>
            )}
          </>
        )}
      </div>
      <div className="login-footer">
        <button
          className="login-accessibility"
          aria-label="Accessibility options"
          onClick={() => setAccessibility(!accessibility)}
        >
          <Wheelchair size={20} />
        </button>
        <button
          className="login-switch"
          onClick={() => setShowUsers(!showUsers)}
        >
          <Users size={17} />
          <span>{showUsers ? "Back" : "Switch User"}</span>
        </button>
        <small className="demo-caption">macOS browser demo</small>
      </div>
      {accessibility && (
        <div className="login-a11y glass">
          <b>Accessibility</b>
          <label>
            <input
              type="checkbox"
              onChange={(e) =>
                document.documentElement.classList.toggle(
                  "high-contrast",
                  e.target.checked,
                )
              }
            />
            Increase contrast
          </label>
          <label>
            <input
              type="checkbox"
              onChange={(e) =>
                document.documentElement.classList.toggle(
                  "reduced-motion",
                  e.target.checked,
                )
              }
            />
            Reduce motion
          </label>
          <button onClick={() => setAccessibility(false)}>Done</button>
        </div>
      )}
    </section>
  );
}

export function PowerDialog({ action, onCancel, onConfirm }) {
  const [reopen, setReopen] = useState(true);
  const cancel = useRef(null);
  useEffect(() => {
    cancel.current?.focus();
    const key = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCancel();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  const label =
    action === "logout"
      ? "Log Out"
      : action === "restart"
        ? "Restart"
        : "Shut Down";
  return (
    <div className="power-backdrop" onClick={onCancel}>
      <section
        className="power-dialog glass"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="power-title"
        onKeyDown={trapDialogKey}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={`${base}assets/icons/finder.png`} alt="" />
        <h2 id="power-title">
          {action === "logout"
            ? "Are you sure you want to log out?"
            : `Are you sure you want to ${label.toLowerCase()} your computer now?`}
        </h2>
        <p>
          {action === "logout"
            ? "You can log back in whenever you like."
            : "Your desktop will be ready when you come back."}
        </p>
        <label>
          <input
            type="checkbox"
            checked={reopen}
            onChange={(e) => setReopen(e.target.checked)}
          />
          Reopen windows when logging back in
        </label>
        <div>
          <button ref={cancel} onClick={onCancel}>
            Cancel
          </button>
          <button
            className="power-confirm"
            onClick={() => onConfirm(action, reopen)}
          >
            {label}
          </button>
        </div>
      </section>
    </div>
  );
}

export function QuickLook({ file, onClose, onNext, onPrevious }) {
  useEffect(() => {
    const key = (e) => {
      if (e.key === "Escape" || e.code === "Space") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrevious();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [file, onClose, onNext, onPrevious]);
  return (
    <div className="quicklook-backdrop" onClick={onClose}>
      <section
        className="quicklook glass"
        role="dialog"
        aria-modal="true"
        aria-label="Quick Look"
        onKeyDown={trapDialogKey}
        onClick={(e) => e.stopPropagation()}
      >
        <header>
          <button autoFocus aria-label="Close Quick Look" onClick={onClose}>
            <X size={16} />
          </button>
          <b>{file.name}</b>
          <div>
            <button aria-label="Previous item" onClick={onPrevious}>
              <CaretLeft size={18} />
            </button>
            <button aria-label="Next item" onClick={onNext}>
              <CaretRight size={18} />
            </button>
          </div>
        </header>
        <div className="quicklook-content">
          {file.photo !== undefined ? (
            <img
              src={`${base}assets/photos/${file.photo}.jpg`}
              alt={file.name}
            />
          ) : file.folder ? (
            <>
              <img
                className="quicklook-folder"
                src={`${base}assets/icons/folder.png`}
                alt=""
              />
              <h2>{file.name}</h2>
              <p>Folder · Macintosh HD</p>
            </>
          ) : (
            <article>
              <h1>A few things to remember</h1>
              <p>Make something beautiful.</p>
              <p>Enjoy the process.</p>
              <p>Save a little time to explore.</p>
            </article>
          )}
        </div>
        <footer>
          {file.kind || "Folder"}
          <span>{file.size || "3 items"}</span>
        </footer>
      </section>
    </div>
  );
}
