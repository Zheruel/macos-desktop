import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  Clock,
  CloudSun,
  CloudRain,
  Command,
  Fingerprint,
  FolderSimple,
  LockSimple,
  MagnifyingGlass,
  Moon,
  Play,
  Plus,
  Snowflake,
  Stop,
  Sun,
  Terminal as TerminalIcon,
  X,
} from "@phosphor-icons/react";
import "./native-apps.css";
const base = import.meta.env.BASE_URL;

export function CalculatorApp({ isActive }) {
  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState(null);
  const [operation, setOperation] = useState(null);
  const [fresh, setFresh] = useState(false);
  const [previous, setPrevious] = useState("");
  const calculate = (a, b, op) =>
    op === "+"
      ? a + b
      : op === "−"
        ? a - b
        : op === "×"
          ? a * b
          : b === 0
            ? NaN
            : a / b;
  const press = (key) => {
    if (key === "AC") {
      setDisplay("0");
      setStored(null);
      setOperation(null);
      setFresh(false);
      setPrevious("");
      return;
    }
    if (key === "±") {
      setDisplay(String(-Number(display)));
      return;
    }
    if (key === "%") {
      setDisplay(String(Number(display) / 100));
      return;
    }
    if (key === "back") {
      setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
      return;
    }
    if (["+", "−", "×", "÷"].includes(key)) {
      const n = Number(display),
        v =
          stored !== null && operation && !fresh
            ? calculate(stored, n, operation)
            : n;
      setStored(v);
      setDisplay(String(v));
      setOperation(key);
      setFresh(true);
      setPrevious(`${v} ${key}`);
      return;
    }
    if (key === "=") {
      if (operation && stored !== null) {
        const result = calculate(stored, Number(display), operation);
        setPrevious(`${stored} ${operation} ${display} =`);
        setDisplay(
          Number.isFinite(result)
            ? String(Number(result.toPrecision(10)))
            : "Error",
        );
        setStored(null);
        setOperation(null);
        setFresh(true);
      }
      return;
    }
    if (key === ".") {
      if (fresh) {
        setDisplay("0.");
        setFresh(false);
      } else if (!display.includes(".")) setDisplay(display + ".");
      return;
    }
    setDisplay(
      fresh || display === "0" || display === "Error"
        ? key
        : (display + key).slice(0, 12),
    );
    setFresh(false);
  };
  useEffect(() => {
    if (!isActive) return;
    const key = (e) => {
      if (e.metaKey || e.ctrlKey || e.target.matches("input,textarea")) return;
      const map = {
        Enter: "=",
        Escape: "AC",
        Backspace: "back",
        "*": "×",
        "/": "÷",
        "-": "−",
      };
      const k = map[e.key] || e.key;
      if (/^[0-9.+%=]$/.test(k) || ["−", "×", "÷", "AC", "back"].includes(k)) {
        e.preventDefault();
        press(k);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [isActive, display, stored, operation, fresh]);
  return (
    <div className="calculator-app">
      <div className="calculator-display">
        <small>{previous || " "}</small>
        <output
          aria-label="Calculator result"
          style={{ fontSize: display.length > 9 ? 34 : 52 }}
        >
          {display}
        </output>
      </div>
      <div className="calculator-keys">
        {[
          "AC",
          "±",
          "%",
          "÷",
          "7",
          "8",
          "9",
          "×",
          "4",
          "5",
          "6",
          "−",
          "1",
          "2",
          "3",
          "+",
          "0",
          ".",
          "=",
        ].map((key) => (
          <button
            key={key}
            className={`${["÷", "×", "−", "+", "="].includes(key) ? "operator" : ""} ${key === "0" ? "zero" : ""} ${operation === key && fresh ? "current" : ""}`}
            onClick={() => press(key)}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TerminalApp({ user, onOpen, onLock }) {
  const [lines, setLines] = useState([
    {
      output:
        "Last login: " +
        new Date().toDateString() +
        " on ttys001\nWelcome to macOS Golden Gate. Type “help” to explore.",
    },
  ]);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState([]);
  const [position, setPosition] = useState(0);
  const end = useRef(null);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [lines]);
  const run = (e) => {
    e.preventDefault();
    const cmd = command.trim();
    if (!cmd) return;
    const [name, ...args] = cmd.split(/\s+/);
    let output = "";
    if (name === "clear") {
      setLines([]);
      setCommand("");
      return;
    }
    if (name === "help")
      output =
        "Available commands\n\n  ls            List your files\n  pwd           Show current folder\n  whoami        Your account name\n  date          The current date and time\n  open <app>    Open an application\n  echo <text>   Print something\n  neofetch      About this Mac\n  lock          Lock the screen\n  clear         Clear this window";
    else if (name === "ls")
      output =
        "Applications    Desktop    Documents    Downloads\nLibrary         Movies     Music        Pictures";
    else if (name === "pwd") output = `/Users/${user.toLowerCase()}`;
    else if (name === "whoami") output = user.toLowerCase();
    else if (name === "date") output = new Date().toString();
    else if (name === "echo") output = args.join(" ");
    else if (name === "neofetch")
      output = `${user.toLowerCase()}@macbook-pro\n────────────────────────\nOS:       macOS Golden Gate 27.0.1\nHost:     MacBook Pro\nChip:     Apple M4 Pro\nMemory:   24 GB\nShell:    zsh\nUptime:   A little while\nDesktop:  Made for the web`;
    else if (name === "open") {
      const app = args.join(" ").toLowerCase().replace(/\s+/g, "");
      const aliases = {
        systemsettings: "settings",
        appstore: "appstore",
        safari: "safari",
        finder: "finder",
        notes: "notes",
        calculator: "calculator",
        photos: "photos",
        calendar: "calendar",
        music: "music",
        terminal: "terminal",
        weather: "weather",
        clock: "clock",
      };
      if (aliases[app]) {
        onOpen(aliases[app]);
        output = `Opening ${args.join(" ")}…`;
      } else output = "Application not found. Try: open Safari";
    } else if (name === "lock") {
      onLock();
      output = "Locking your Mac…";
    } else output = `zsh: command not found: ${name}`;
    setLines((old) => [...old, { command: cmd, output }]);
    setHistory((h) => [...h, cmd]);
    setPosition(history.length + 1);
    setCommand("");
  };
  return (
    <div
      className="terminal-app"
      onClick={(e) => {
        if (e.target === e.currentTarget)
          e.currentTarget.querySelector("input")?.focus();
      }}
    >
      <div className="terminal-lines">
        {lines.map((line, i) => (
          <div key={i}>
            {line.command && (
              <p>
                <span>{user.toLowerCase()}@macbook-pro ~ % </span>
                {line.command}
              </p>
            )}
            <pre>{line.output}</pre>
          </div>
        ))}
        <form onSubmit={run}>
          <label htmlFor="terminal-command">
            {user.toLowerCase()}@macbook-pro ~ %
          </label>
          <input
            id="terminal-command"
            aria-label="Terminal command"
            value={command}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") {
                e.preventDefault();
                const p = Math.max(0, position - 1);
                setPosition(p);
                setCommand(history[p] || "");
              }
              if (e.key === "ArrowDown") {
                e.preventDefault();
                const p = Math.min(history.length, position + 1);
                setPosition(p);
                setCommand(history[p] || "");
              }
            }}
          />
        </form>
        <div ref={end} />
      </div>
      <span className="terminal-caption">
        A browser-local terminal simulation
      </span>
    </div>
  );
}

export function WeatherApp() {
  const weekdays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return i === 0
      ? "Today"
      : d.toLocaleDateString("en-US", { weekday: "short" });
  });
  return (
    <div className="weather-app">
      <div className="weather-photo" />
      <header>
        <p>San Francisco</p>
        <h1>18°</h1>
        <h3>Mostly Clear</h3>
        <span>H:21° L:14°</span>
      </header>
      <div className="weather-details">
        <section className="weather-hourly">
          <p>Clear skies for the rest of the evening.</p>
          <div>
            {["Now", "9 PM", "10 PM", "11 PM", "12 AM", "1 AM"].map((h, i) => (
              <div key={h}>
                <small>{h}</small>
                {i === 0 ? (
                  <CloudSun size={24} />
                ) : (
                  <Moon size={22} weight="fill" />
                )}
                <b>{18 - Math.floor(i / 2)}°</b>
              </div>
            ))}
          </div>
        </section>
        <section className="weather-week">
          <h4>7-DAY FORECAST</h4>
          {weekdays.map((d, i) => (
            <div key={d}>
              <span>{d}</span>
              {i === 4 ? (
                <CloudRain size={21} />
              ) : (
                <Sun size={21} weight="fill" />
              )}
              <small>{14 - (i % 3)}°</small>
              <progress value={55 + i * 4} max="100" />
              <b>{21 + (i % 3)}°</b>
            </div>
          ))}
        </section>
        <div className="weather-small">
          <section>
            <small>UV INDEX</small>
            <strong>0</strong>
            <p>Low</p>
          </section>
          <section>
            <small>SUNSET</small>
            <strong>
              6:29 <i>PM</i>
            </strong>
            <p>Sunrise: 7:19 AM</p>
          </section>
        </div>
      </div>
      <footer>Weather preview · San Francisco</footer>
    </div>
  );
}

export function ClockApp() {
  const [tab, setTab] = useState("World Clock");
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const [timer, setTimer] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const [minutes, setMinutes] = useState("5");
  useEffect(() => {
    if (!running) return;
    const start = Date.now() - elapsed;
    const interval = setInterval(() => setElapsed(Date.now() - start), 70);
    return () => clearInterval(interval);
  }, [running]);
  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(
      () =>
        setTimer((t) => {
          if (t <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return t - 1;
        }),
      1000,
    );
    return () => clearInterval(id);
  }, [timerRunning]);
  const time = (ms) =>
    `${String(Math.floor(ms / 60000)).padStart(2, "0")}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")}.${String(Math.floor(ms / 10) % 100).padStart(2, "0")}`;
  return (
    <div className="clock-app">
      <nav>
        {["World Clock", "Stopwatch", "Timer"].map((t) => (
          <button
            className={tab === t ? "selected" : ""}
            key={t}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </nav>
      {tab === "World Clock" ? (
        <div className="world-clocks">
          {[
            ["San Francisco", "America/Los_Angeles"],
            ["Zagreb", "Europe/Zagreb"],
            ["New York", "America/New_York"],
            ["Tokyo", "Asia/Tokyo"],
          ].map(([name, zone]) => (
            <section key={name}>
              <small>{name}</small>
              <strong>
                {new Date().toLocaleTimeString("en-GB", {
                  timeZone: zone,
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </strong>
              <span>
                {new Date().toLocaleDateString("en-US", {
                  timeZone: zone,
                  weekday: "long",
                })}
              </span>
            </section>
          ))}
        </div>
      ) : tab === "Stopwatch" ? (
        <div className="stopwatch">
          <output>{time(elapsed)}</output>
          <div>
            <button
              onClick={() =>
                running
                  ? setLaps((l) => [elapsed, ...l])
                  : (setElapsed(0), setLaps([]))
              }
            >
              {running ? "Lap" : "Reset"}
            </button>
            <button
              className={running ? "stop" : "start"}
              onClick={() => setRunning(!running)}
            >
              {running ? "Stop" : "Start"}
            </button>
          </div>
          <ul>
            {laps.map((lap, i) => (
              <li key={i}>
                <span>Lap {laps.length - i}</span>
                <span>{time(lap)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="timer-app">
          <output>
            {String(Math.floor(timer / 60)).padStart(2, "0")}:
            {String(timer % 60).padStart(2, "0")}
          </output>
          {!timerRunning && (
            <label>
              Minutes
              <input
                aria-label="Timer minutes"
                type="number"
                min="1"
                max="120"
                value={minutes}
                onChange={(e) => {
                  setMinutes(e.target.value);
                  setTimer(Math.max(0, Number(e.target.value)) * 60);
                }}
              />
            </label>
          )}
          <button
            className={timerRunning ? "stop" : "start"}
            onClick={() => {
              if (!timerRunning && timer === 0)
                setTimer((Number(minutes) || 5) * 60);
              setTimerRunning(!timerRunning);
            }}
          >
            {timerRunning ? "Pause" : "Start Timer"}
          </button>
          {timer === 0 && <p>Time’s up.</p>}
        </div>
      )}
    </div>
  );
}

export function TipsApp({ onOpen, onLock, onMission, onWidgets }) {
  return (
    <div className="tips-app">
      <header>
        <img src={`${base}assets/icons/tips.png`} alt="" />
        <div>
          <small>MAKE YOURSELF AT HOME</small>
          <h1>Your Mac. A little more familiar.</h1>
          <p>A few little things to make the most of your desktop.</p>
        </div>
      </header>
      <div className="tips-grid">
        {[
          [
            LockSimple,
            "Take a moment",
            "Lock your screen, then pick up right where you left off.",
            "Lock Screen",
            onLock,
          ],
          [
            MagnifyingGlass,
            "Find your flow",
            "Search apps and files with Spotlight. Press ⌘K.",
            "Open Spotlight",
            () => onOpen("spotlight"),
          ],
          [
            FolderSimple,
            "A closer look",
            "Select a file in Finder, then press Space to preview it.",
            "Open Finder",
            () => onOpen("finder"),
          ],
          [
            Command,
            "See the bigger picture",
            "Bring all your open windows into view. Press F3.",
            "Mission Control",
            onMission,
          ],
          [
            Plus,
            "Make it yours",
            "Add a weather or calendar widget to your desktop.",
            "Edit Widgets",
            onWidgets,
          ],
          [
            TerminalIcon,
            "A little command line",
            "Try help, ls, neofetch, or open Safari.",
            "Open Terminal",
            () => onOpen("terminal"),
          ],
        ].map(([I, title, copy, label, action]) => (
          <section key={title}>
            <I size={29} weight="light" />
            <h3>{title}</h3>
            <p>{copy}</p>
            <button onClick={action}>
              {label}
              <ArrowUpRight size={14} />
            </button>
          </section>
        ))}
      </div>
    </div>
  );
}

export class AppBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="app-recovery">
        <img src={`${base}assets/icons/settings.png`} alt="" />
        <h2>{this.props.title} needs a moment.</h2>
        <p>Your desktop is still here.</p>
        <button
          className="native-button"
          onClick={() => this.setState({ failed: false })}
        >
          Try Again
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
