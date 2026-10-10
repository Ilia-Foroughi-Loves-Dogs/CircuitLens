"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CircuitBoard,
  FlaskConical,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { CircuitUploader } from "@/components/CircuitUploader";
import { CircuitStatus } from "@/components/CircuitStatus";
import { AnalysisPanel, type AnalysisState } from "@/components/AnalysisPanel";
import {
  mockAnalysis,
  verifiedAnalysis,
  type AnalysisResult,
} from "@/lib/mockAnalysis";

import { parseAnalysis } from "@/lib/analysis/schema";
import { toAnalysisResult } from "@/lib/analysis/types";

const demoDescription =
  "The red LED should light up when the circuit is connected to the 5V power supply. A 220Ω resistor limits the current through the LED.";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [mode, setMode] = useState<"ai" | "demo">("ai");
  const uploadedFile = useRef<File | null>(null);
  const requestController = useRef<AbortController | null>(null);
  const analysisTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetAnalysis = () => {
    requestController.current?.abort();
    requestController.current = null;
    setError(null);
    if (analysisTimer.current) clearTimeout(analysisTimer.current);
    analysisTimer.current = null;
    setAnalysisState("idle");
    setResult(null);
    setSelectedIssueId(null);
  };
  const analyze = async (rescan = false) => {
    if (!image || !description.trim() || analysisState === "analyzing") return;
    setError(null);
    setResult(null);
    setSelectedIssueId(null);
    setAnalysisState("analyzing");
    if (mode === "demo") {
      analysisTimer.current = setTimeout(() => {
        analysisTimer.current = null;
        setResult(rescan ? verifiedAnalysis : mockAnalysis);
        setAnalysisState("complete");
      }, 1400);
      return;
    }
    if (!uploadedFile.current) {
      setError("Upload a photo to use AI analysis, or select demo mode.");
      setAnalysisState("idle");
      return;
    }
    const controller = new AbortController();
    requestController.current = controller;
    try {
      const form = new FormData();
      form.append("image", uploadedFile.current);
      form.append("description", description);
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: form,
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Analysis failed. Retry or use demo mode.",
        );
      const validated = parseAnalysis(data);
      if (controller.signal.aborted) return;
      setResult(toAnalysisResult(validated));
      setAnalysisState("complete");
    } catch (error) {
      if (controller.signal.aborted) return;
      setError(
        error instanceof Error && error.name !== "ZodError"
          ? error.message
          : "Invalid analysis response. Retry or use demo mode.",
      );
      setAnalysisState("idle");
    } finally {
      if (requestController.current === controller)
        requestController.current = null;
    }
  };
  const objectUrl = useRef<string | null>(null);
  useEffect(
    () => () => {
      requestController.current?.abort();
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
      if (analysisTimer.current) clearTimeout(analysisTimer.current);
    },
    [],
  );
  const releaseImage = () => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = null;
  };
  const startNewScan = () => {
    resetAnalysis();
    releaseImage();
    uploadedFile.current = null;
    setMode("ai");
    setImage(null);
    setName(null);
    setDescription("");
    setError(null);
  };
  const upload = (file: File) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("This image is too large. Please choose a file under 10 MB.");
      return;
    }
    releaseImage();
    uploadedFile.current = file;
    const url = URL.createObjectURL(file);
    objectUrl.current = url;
    setImage(url);
    setName(file.name);
    setError(null);
    resetAnalysis();
  };
  const loadDemo = () => {
    uploadedFile.current = null;
    setMode("demo");
    resetAnalysis();
    releaseImage();
    setImage("/demo-circuit.svg");
    setName("LED starter circuit");
    setDescription(demoDescription);
    setError(null);
    setResult(mockAnalysis);
    setAnalysisState("complete");
  };
  const ready = !!image && !!description.trim();
  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="CircuitLens home">
          <span className="brand-mark">
            <CircuitBoard size={23} />
          </span>
          <span>
            Circuit<span className="mint">Lens</span>
          </span>
        </a>
        <div className="header-right">
          <span className="header-caption">
            FROM BREADBOARD TO UNDERSTANDING
          </span>
          <span className="version-badge">
            <span className="status-dot" /> v0.6 / AI + DEMO
          </span>
        </div>
      </header>
      <main>
        <section className="intro">
          <div className="eyebrow">
            <span /> A LITTLE CLARITY FOR YOUR NEXT CIRCUIT
          </div>
          <h1>
            Make sense of
            <br />
            every <span>connection.</span>
          </h1>
          <p className="subtitle">Visual debugging for physical circuits</p>
          <p className="intro-description">
            Your breadboard. Your big idea. A clearer picture of how it all
            connects.
          </p>
          <div className="intro-decoration" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit-core">
              <ScanLine size={36} strokeWidth={1} />
            </div>
            <span className="coordinate">X: 024 / Y: 018</span>
          </div>
        </section>
        <div className="workspace-bar">
          <div>
            <span className="status-dot" />
            <span>NEW CIRCUIT WORKSPACE</span>
          </div>
          <span>
            LOCAL SESSION <span className="subdued">/ 001</span>
          </span>
        </div>
        <div className="workspace-grid">
          <CircuitUploader
            image={image}
            name={name}
            onUpload={upload}
            error={error}
            annotations={result?.annotations ?? []}
            selectedIssueId={selectedIssueId}
            onSelectIssue={setSelectedIssueId}
          />
          <div className="sidebar">
            <section className="panel intent-panel">
              <div className="panel-heading">
                <div>
                  <span className="step-number">02</span>
                  <h2>What should it do?</h2>
                </div>
                <Zap size={17} className="subdued" />
              </div>
              <p className="panel-description">
                Tell us what you expect to happen when your circuit is powered
                on.
              </p>
              <label className="input-label" htmlFor="description">
                EXPECTED BEHAVIOR
              </label>
              <textarea
                id="description"
                maxLength={2000}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  resetAnalysis();
                }}
                placeholder="e.g. The LED should turn on when I press the button, and turn off when I release it."
              />
              <div className="textarea-meta">
                <span>Start simple. Details help.</span>
                <span>{description.length} / 2000</span>
              </div>
              <label className="input-label" htmlFor="analysis-mode">
                ANALYSIS MODE
              </label>
              <select
                id="analysis-mode"
                value={mode}
                onChange={(event) => {
                  resetAnalysis();
                  setMode(event.target.value as "ai" | "demo");
                }}
              >
                <option value="ai">AI image analysis</option>
                <option value="demo">Demo / simulated analysis</option>
              </select>
              <p className="panel-description">
                {mode === "ai"
                  ? "Your image and description are sent to the server and OpenAI for analysis."
                  : "Simulated findings; demo mode does not analyze your photo."}
              </p>
              {error && mode === "ai" && (
                <button
                  className="button demo-button"
                  onClick={() => {
                    resetAnalysis();
                    setMode("demo");
                  }}
                >
                  Use Demo Mode
                </button>
              )}
              {analysisState !== "complete" && (
                <button
                  className="button analyze-button"
                  disabled={!ready || analysisState === "analyzing"}
                  onClick={() => analyze()}
                >
                  <ScanLine size={17} />
                  {analysisState === "analyzing"
                    ? "Analyzing Circuit…"
                    : "Analyze Circuit"}
                  <ArrowRight size={18} />
                </button>
              )}
              <button className="button demo-button" onClick={loadDemo}>
                <FlaskConical size={16} />
                Load Demo Circuit
                <span className="demo-label">LED + RESISTOR</span>
              </button>
              <p className="panel-description">
                No photo needed. Load a complete sample, explore the highlighted
                issues, then try the simulated repair and rescan. Works locally
                without API keys.
              </p>
            </section>
            <CircuitStatus
              hasImage={!!image}
              hasDescription={!!description.trim()}
              analysisState={analysisState}
              verified={
                analysisState === "complete" &&
                result?.circuitStatus === "no_obvious_issues"
              }
            />
            <AnalysisPanel
              mode={mode}
              state={analysisState}
              result={result}
              selectedIssueId={selectedIssueId}
              onSelectIssue={setSelectedIssueId}
              onRescan={() => analyze(true)}
              onStartNewScan={startNewScan}
            />
          </div>
        </div>
        <div className="workspace-footer">
          <span>
            <ShieldCheck size={15} /> AI mode sends photos for analysis. Demo
            mode stays in this browser.
          </span>
          <span>
            <Sparkles size={14} /> Built for curious minds.
          </span>
        </div>
        <section className="how-it-works">
          <div className="how-title">
            <span className="mono mint">THE WORKFLOW</span>
            <h2>From “why?” to “aha.”</h2>
            <p>A simpler way to start understanding your circuit.</p>
          </div>
          <div className="workflow-step">
            <span>01 / CAPTURE</span>
            <h3>Show your setup</h3>
            <p>
              A top-down photo of your breadboard brings every connection into
              view.
            </p>
          </div>
          <div className="workflow-step">
            <span>02 / DESCRIBE</span>
            <h3>Share the intention</h3>
            <p>Explain the behavior you’re aiming for, in your own words.</p>
          </div>
          <div className="workflow-step">
            <span>
              03 / UNDERSTAND <b>AI + DEMO</b>
            </span>
            <h3>Find the missing link</h3>
            <p>
              Find problems on the image, apply the suggested fixes, then scan
              again to review your updated circuit.
            </p>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <span className="footer-brand">
          <CircuitBoard size={16} /> CircuitLens <span>·</span> Built to make
          things click.
        </span>
        <span className="mono">
          HACKATHON BUILD <span className="mint">/</span> 2026
        </span>
      </footer>
    </div>
  );
}
