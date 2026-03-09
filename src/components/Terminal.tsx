import { useState, useRef, useEffect, KeyboardEvent } from "react";

const HELP_TEXT = `Available commands:
  help      - Show this help message
  get cv    - Download CV / Resume
  email     - Send an email to hello@kasunlive.com
  about     - Quick intro
  clear     - Clear terminal`;

const ABOUT_TEXT = `Kasun Rajapaksha — Linux Expert | Mobile Photographer | Web Designer | Infrastructure Specialist | Musicophile & Audiophile
Visit https://kasunlive.com for more.`;

const Terminal = () => {
  const [lines, setLines] = useState<{ text: string; type: "input" | "output" }[]>([
    { text: "Welcome to kasunlive.com — Type 'help' to get started.", type: "output" },
  ]);
  const [input, setInput] = useState("");
  const [emailStep, setEmailStep] = useState<null | "from" | "message">(null);
  const [emailFrom, setEmailFrom] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const addLine = (text: string, type: "input" | "output") =>
    setLines((prev) => [...prev, { text, type }]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();

    if (emailStep === "from") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cmd.trim())) {
        addLine(cmd, "input");
        addLine("Invalid email. Please enter a valid email address:", "output");
        return;
      }
      setEmailFrom(cmd.trim());
      addLine(cmd, "input");
      addLine("Enter your message:", "output");
      setEmailStep("message");
      return;
    }

    if (emailStep === "message") {
      addLine(cmd, "input");
      const subject = encodeURIComponent("Contact from Portfolio Terminal");
      const body = encodeURIComponent(`From: ${emailFrom}\n\n${cmd.trim()}`);
      window.open(`mailto:hello@kasunlive.com?subject=${subject}&body=${body}`, "_blank");
      addLine("Opening email client... Message prepared!", "output");
      setEmailStep(null);
      setEmailFrom("");
      return;
    }

    addLine(cmd, "input");

    switch (trimmed) {
      case "help":
        addLine(HELP_TEXT, "output");
        break;
      case "get cv":
        addLine("Downloading CV...", "output");
        // Trigger CV download — replace with actual CV URL
        window.open("/Kasun_Rajapaksha_CV.pdf", "_blank");
        break;
      case "email":
        addLine("Enter your email address:", "output");
        setEmailStep("from");
        break;
      case "about":
        addLine(ABOUT_TEXT, "output");
        break;
      case "clear":
        setLines([]);
        break;
      case "sudo login":
        addLine("Authenticating... Redirecting to admin panel.", "output");
        window.open("/admin/login", "_blank");
        break;
      default:
        addLine(`Command not found: ${trimmed}. Type 'help' for available commands.`, "output");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      handleCommand(input);
      setInput("");
    }
  };

  return (
    <div
      className="mx-auto mt-10 w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border bg-muted px-4 py-2">
        <span className="h-3 w-3 rounded-full bg-destructive" />
        <span className="h-3 w-3 rounded-full bg-secondary" />
        <span className="h-3 w-3 rounded-full bg-primary" />
        <span className="ml-3 font-display text-xs text-muted-foreground">
          kasun@live:~$
        </span>
      </div>

      {/* Terminal body */}
      <div className="max-h-64 overflow-y-auto p-4 font-display text-sm">
        {lines.map((line, i) => (
          <div key={i} className="mb-1">
            {line.type === "input" ? (
              <span>
                <span className="text-primary">❯ </span>
                <span className="text-foreground">{line.text}</span>
              </span>
            ) : (
              <pre className="whitespace-pre-wrap text-muted-foreground">{line.text}</pre>
            )}
          </div>
        ))}

        {/* Input line */}
        <div className="flex items-center">
          <span className="text-primary">❯ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
            placeholder={emailStep === "from" ? "your@email.com" : emailStep === "message" ? "Type your message..." : "Type a command..."}
            autoFocus
          />
        </div>
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default Terminal;
