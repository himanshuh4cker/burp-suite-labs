# Pentest by HP: Burp Suite Training Labs 🛡️

Welcome to the **Pentest by HP** Burp Suite local training academy! This repository contains **11 interactive, dark-themed mini-labs** designed specifically to help students and security enthusiasts master **Burp Suite Community Edition** features hands-on.

The application features a modern glassmorphic dashboard, progress indicators, collapsible instructor guides/walkthrough drawers, and simulated security scenarios.

---

## 🚀 Mini-Labs Included

Each lab maps directly to a critical tab or functionality inside Burp Suite:

1. **Proxy Lab**: Intercept, inspect, and modify active HTTP requests.
2. **Target Lab**: Map sitemaps, analyze `robots.txt`, and find developer notes.
3. **HTTP History Lab**: Track background API requests and responses.
4. **Repeater Lab**: Tamper with parameters manually to exploit IDOR.
5. **Intruder Lab**: Automated sniper fuzzing (brute-forcing credentials and PINs).
6. **Comparer Lab**: Diff structural variations in security tokens (JWTs).
7. **Decoder Lab**: Decode and encode Hex, URL, Base64, MD5 hashes, and JWT segments.
8. **Sequencer Lab**: Analyze session token randomness and predictable cookies.
9. **Organizer Lab**: Organize, tag, and document critical requests.
10. **Logger Lab**: Filter and isolate targets in noisy telemetry request streams.
11. **Collaborator Lab**: Visualize Out-of-Band (OAST) blind SSRF callback networks.

---

## ⚡ Quick Start Guide

You can run these labs locally on your system using either Docker or Node.js.

### Method 1: Running with Docker (Recommended)
Make sure you have Docker and Docker Compose installed.
1. Open your terminal in this directory.
2. Build and start the container:
   ```bash
   docker compose up --build
   ```
3. Open your browser and navigate to:
   👉 **http://localhost:3000**

### Method 2: Running with Node.js Locally
Ensure you have Node.js (v20+) installed.
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to:
   👉 **http://localhost:3000**

---

## 🌐 Configuring Burp Suite for Localhost
By default, modern web browsers bypass proxies for `localhost` and local IP addresses. To intercept the traffic in Burp Suite, choose one of these two options:

* **Option A (Recommended)**: Use the **embedded browser** inside Burp Suite (**Proxy** > **Intercept** > **Open Browser**). It intercepts local traffic automatically.
* **Option B**: Add a custom host mapping in your hosts file (e.g., `/etc/hosts` on Linux or `C:\Windows\System32\drivers\etc\hosts` on Windows) mapping `127.0.0.1` to a domain like `hp.labs` and access `http://hp.labs:3000`.

---

## 📖 Instructor & Study Guide
An offline walkthrough guide is included in this repository. Open **[INSTRUCTOR_GUIDE.md](./INSTRUCTOR_GUIDE.md)** to see detailed walkthrough clicks, script hints, common pitfalls, and concepts for teaching these labs.
