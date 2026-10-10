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

const demoDescription =
  "The red LED should light up when the circuit is connected to the 5V power supply. A 220Ω resistor limits the current through the LED.";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [requested, setRequested] = useState(false);
  const objectUrl = useRef<string | null>(null);
  useEffect(
    () => () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    },
    [],
  );
  const releaseImage = () => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = null;
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
    const url = URL.createObjectURL(file);
    objectUrl.current = url;
    setImage(url);
    setName(file.name);
    setError(null);
    setRequested(false);
  };
  const loadDemo = () => {
    releaseImage();
    setImage("/demo-circuit.svg");
    setName("LED starter circuit");
    setDescription(demoDescription);
    setError(null);
    setRequested(false);
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
            <span className="status-dot" /> v0.1 / FOUNDATION
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
                  setRequested(false);
                }}
                placeholder="e.g. The LED should turn on when I press the button, and turn off when I release it."
              />
              <div className="textarea-meta">
                <span>Start simple. Details help.</span>
                <span>{description.length} / 2000</span>
              </div>
              <button
                className="button analyze-button"
                disabled={!ready}
                onClick={() => setRequested(true)}
              >
                <ScanLine size={17} />
                Analyze Circuit
                <ArrowRight size={18} />
              </button>
              <button className="button demo-button" onClick={loadDemo}>
                <FlaskConical size={16} />
                Load Demo Circuit
                <span className="demo-label">LED + RESISTOR</span>
              </button>
            </section>
            <CircuitStatus
              hasImage={!!image}
              hasDescription={!!description.trim()}
              requested={requested}
            />
          </div>
        </div>
        <div className="workspace-footer">
          <span>
            <ShieldCheck size={15} /> Your photos stay in this browser. No
            uploads to a server.
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
          <div className="workflow-step future">
            <span>
              03 / UNDERSTAND <b>COMING SOON</b>
            </span>
            <h3>Find the missing link</h3>
            <p>
              Visual guidance to help you spot issues and learn along the way.
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
