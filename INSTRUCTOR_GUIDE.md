# Burp Suite Community Edition Academy - Complete Instructor & Student Guide

This repository contains **11 interactive local mini-challenges** specifically designed for teaching and learning Burp Suite Community Edition. This document serves as a complete step-by-step walkthrough, speaking script, and troubleshooting guide for all 11 labs.

---

## Table of Contents
1. [Lab 1: Intercept Requests (Proxy)](#lab-1-intercept-requests-proxy)
2. [Lab 2: Explore the Website (Target)](#lab-2-explore-the-website-target)
3. [Lab 3: Track Requests (HTTP History)](#lab-3-track-requests-http-history)
4. [Lab 4: Modify and Replay (Repeater)](#lab-4-modify-and-replay-repeater)
5. [Lab 5: Fuzz the Secret (Intruder)](#lab-5-fuzz-the-secret-intruder)
6. [Lab 6: Compare Responses (Comparer)](#lab-6-compare-responses-comparer)
7. [Lab 7: Decode Everything (Decoder)](#lab-7-decode-everything-decoder)
8. [Lab 8: Weak Session Tokens (Sequencer)](#lab-8-weak-session-tokens-sequencer)
9. [Lab 9: Save Interesting Requests (Organizer)](#lab-9-save-interesting-requests-organizer)
10. [Lab 10: Traffic Monitoring (Logger)](#lab-10-traffic-monitoring-logger)
11. [Lab 11: Out-of-Band Attacks (Collaborator Theory)](#lab-11-out-of-band-attacks-collaborator-theory)

---

## Lab 1: Intercept Requests (Proxy)

### 🎯 Core Objective
Intercept a login request and modify its body parameters, cookies, or HTTP headers inside Burp Suite Proxy to bypass verification gates and log in as an administrator.

### 🛠️ Burp Suite Workflow
1. Open Burp Suite. Navigate to **Proxy** > **Intercept** and ensure **Intercept is on** is active.
2. In Burp's browser (or proxy-configured browser), go to the Proxy Lab page (`http://localhost:3000/proxy`).
3. Enter username `guest` and password `guest123` into the login form, then click **Login**. The browser will hang.
4. Go to Burp Suite. In the Intercept tab, observe the pending `POST /proxy/submit` request.
5. Solve using **one** of these three bypasses:
   * **Method A (Body Tampering)**: Scroll to the bottom and change `username=guest&password=guest123` to `username=admin&password=admin_override`.
   * **Method B (Header Bypass)**: Add a new header line `X-Admin-Bypass: true` below the Host header.
   * **Method C (Cookie Tampering)**: Modify the Cookie line to include `admin_session=true` (e.g. `Cookie: admin_session=true`).
6. Click **Forward** in Burp.
7. Return to your browser to view the success flag.

### 🗣️ YouTube Script (What to Say)
> *"Alright guys, welcome to Lab 1. We are looking at Burp Proxy. Think of the Proxy as a security guard standing in the middle of the road. It stops the HTTP request in mid-air, allowing us to inspect it and change the values before the server ever gets to read them. By changing our credentials or injecting a custom bypass header directly in the raw request, we easily bypass client-side limitations!"*

### ⚠️ Common Student Pitfalls
* Forgetting to turn **Intercept OFF** after completing the lab, causing subsequent browser tabs to hang indefinitely.
* Adding the custom header line with a typo, or leaving a blank line in the middle of the headers, which breaks HTTP syntax.

### 💡 Concepts Taught
* Request-Response Lifecycle
* Client-side bypasses
* Request body parameter and cookie tampering

**Flag**: `FLAG{PROXY_INTERCEPT_OK}`

---

## Lab 2: Explore the Website (Target)

### 🎯 Core Objective
Use Burp Target to passively map the website's directories, discover backup archives, read hidden Javascript files, and locate a developer backdoor.

### 🛠️ Burp Suite Workflow
1. Go to Burp Suite's **Target** > **Site map** tab.
2. Visit `http://localhost:3000/target` and click through the public menu buttons (Home, About Us, Contact, FAQ) to populate the Sitemap.
3. Look at the Site map tree. Locate `/robots.txt` and inspect its content in the Response window. Note the disallowed entries.
4. Select the `analytics.js` script under the `/js` node.
5. Read the comments in the file: you will see references to a backup file (`/backup.zip`) and a backend debug API (`/debug-api-v2`).
6. Visit `http://localhost:3000/debug-api-v2` in your browser.
7. Copy the flag from the JSON response.

### 🗣️ YouTube Script (What to Say)
> *"In this challenge, we explore how Burp maps the target site. As we browse, Burp passively parses the HTML, finds scripts, and checks standard paths like robots.txt. Look at this javascript file: developers often leave comments referencing testing backups or backend APIs. By analyzing these scripts in Burp's Sitemap, we discover an undocumented debug API containing the flag!"*

### ⚠️ Common Student Pitfalls
* Manually guessing directories instead of using the Site map to see the nested structure.
* Forgetting to check the **Response** tab in Burp when clicking on script nodes in the Site map.

### 💡 Concepts Taught
* Active/Passive mapping
* Robots.txt parsing
* Developer comment leaks

**Flag**: `FLAG{DEVELOPER_BACKDOOR_FOUND}`

---

## Lab 3: Track Requests (HTTP History)

### 🎯 Core Objective
Analyze background API queries (Fetch/XHR) inside Burp HTTP History to view background parameters and retrieve a flag hidden inside a POST response body.

### 🛠️ Burp Suite Workflow
1. Open Burp Suite. Navigate to **Proxy** > **HTTP history**.
2. Go to the HTTP History Lab page (`http://localhost:3000/history`).
3. Type `laptop` in the live product search box.
4. Write a sentence in the Profile Bio input and click **Save Bio**.
5. Go to Burp Suite's HTTP History table.
6. Scroll down to locate the `POST /history/update-bio` request.
7. Click on this row, go to the **Response** tab, and read the JSON response body.
8. Copy the flag.

### 🗣️ YouTube Script (What to Say)
> *"Modern websites use AJAX to talk to backend servers without refreshing the page. In this lab, we inspect background calls. When we search or edit our bio, the browser pings API routes. Regular users won't see this, but Burp logs every request. Let's select the bio update request and look at the response: the server responds with a JSON object containing our flag!"*

### ⚠️ Common Student Pitfalls
* Applying filter rules in Burp History that inadvertently hide JSON/API endpoints.
* Looking only at the request payload instead of checking the response body.

### 💡 Concepts Taught
* AJAX and XHR tracing
* REST API request tracking
* JSON response inspection

**Flag**: `FLAG{HTTP_HISTORY_BIO_SAVED}`

---

## Lab 4: Modify and Replay (Repeater)

### 🎯 Core Objective
Manipulate parameters and test for Insecure Direct Object References (IDOR) by sending a product request to Burp Repeater and tampering with the item ID.

### 🛠️ Burp Suite Workflow
1. Browse to the Repeater Lab page (`http://localhost:3000/product?id=1`).
2. Go to Burp Suite's **Proxy** > **HTTP history** and locate the GET request to `/product?id=1`.
3. Right-click the request row and select **Send to Repeater** (or press `Ctrl + R`).
4. Switch to the **Repeater** tab.
5. In the Request window, edit the URL query parameter: change `?id=1` to `?id=1337`.
6. Click the **Send** button.
7. In the Response pane, inspect the HTML code to find the system flag.

### 🗣️ YouTube Script (What to Say)
> *"If you want to edit and replay requests manually, Burp Repeater is your best friend. Instead of going back to the browser, clicking links, and re-proxying, we send the request to Repeater. Now we can manipulate variables infinitely. We'll change the product ID to 1337—a hidden record—and re-send it. The server processes our request and leaks the flag!"*

### ⚠️ Common Student Pitfalls
* Modifying headers incorrectly (e.g. omitting the space after headers), which causes 400 Bad Request responses.
* Forgetting to inspect the response body in the Repeater tab.

### 💡 Concepts Taught
* Burp Repeater flow
* Parameter tampering
* IDOR vulnerability testing

**Flag**: `FLAG{REPEATER_TAMPERING_SUCCESS}`

---

## Lab 5: Fuzz the Secret (Intruder)

### 🎯 Core Objective
Execute automated sniper attacks in Burp Intruder to brute-force a guessing game (1-20), crack a 4-digit security PIN, and perform username enumeration.

### 🛠️ Burp Suite Workflow
* **Scenario 1 (Guessing 1–20)**:
  1. Submit a guess in the form. Locate the `POST /intruder/guess` request in HTTP History.
  2. Send it to **Intruder** (`Ctrl + I`).
  3. In **Positions**: click *Clear §*. Highlight the guess number (e.g., `guess=§1§`) and click *Add §*.
  4. In **Payloads**: set type to *Numbers*, range *1 to 20*, step *1*.
  5. Run the attack. Look for the response with a different length/status: guess **17** reveals the flag.
* **Scenario 2 (PIN Brute-Force)**:
  1. Submit a PIN. Send `POST /intruder/pin` to Intruder.
  2. In **Positions**: Highlight the PIN parameter value: `pin=§0000§`.
  3. In **Payloads**: set type to *Numbers*, range *0000 to 0500*, format to **4 minimum integer digits** (e.g., `0000`).
  4. Run attack. PIN **0074** (or `0420` depending on configuration) returns `200 OK` (with the flag) instead of `403 Forbidden`.
* **Scenario 3 (Username Enumeration)**:
  1. Submit a login request. Send `POST /intruder/login` to Intruder.
  2. Mark only the username parameter: `username=§test§`.
  3. Set Payload type to *Simple List* and enter: `admin, guest, security, test, support`.
  4. Run attack. Sort by length. Existing usernames return a different length response than non-existent accounts.

### 🗣️ YouTube Script (What to Say)
> *"Burp Intruder allows us to fuzz inputs automatically. We identify input variables, place markers around them, and load wordlists. In the PIN cracking challenge, we generate numbers from 0000 to 0500. Look at the attack results: all queries return a 403 Forbidden status, except one! That is our correct PIN, and the response body contains the flag."*

### ⚠️ Common Student Pitfalls
* Forgetting to clear the automatic markers Burp places on headers, which corrupts the fuzzing target.
* Forgetting to pad the PIN generator with leading zeros, causing Intruder to send `74` instead of `0074`.

### 💡 Concepts Taught
* Intruder Sniper configurations
* Payload lists and generators
* Response length analysis

**Flag**: `FLAG{INTRUDER_PIN_CRACKED}`

---

## Lab 6: Compare Responses (Comparer)

### 🎯 Core Objective
Use Burp Comparer to perform a word/byte diff analysis between two API responses (User vs. Admin dashboard) to find access-control variables.

### 🛠️ Burp Suite Workflow
1. Go to the Comparer Lab page and click **Generate JWT Tokens**.
2. Paste the **User JWT** into the sandbox console and click **Test User Token**.
3. Copy the raw JSON response shown in the output terminal.
4. Go to Burp Suite. Select the **Comparer** tab.
5. Paste the User response JSON in the top window.
6. Return to the browser. Paste the **Admin JWT** into the sandbox console and click **Test Admin Token**.
7. Copy the raw JSON response, and paste it into the second panel in Burp Comparer.
8. Highlight both items in Comparer and click **Compare words**.
9. Analyze the highlighted structural differences to find the administrator flag.

### 🗣️ YouTube Script (What to Say)
> *"When testing permissions, we often compare what a low-privilege user sees versus a high-privilege admin. Instead of staring at hundreds of lines of code, we paste both outputs into Burp Comparer. Comparing by words highlights the exact differences—such as roles, permissions lists, and the administrator flag."*

### ⚠️ Common Student Pitfalls
* Attempting to compare the encoded JWT tokens themselves. Focus on comparing the *API JSON response body* instead!
* Selecting "Compare bytes" for JSON, which is harder to read than "Compare words".

### 💡 Concepts Taught
* Privilege diffing
* Comparer operations
* Access control analysis

**Flag**: `FLAG{JWT_COMPARER_SUCCESS}`

---

## Lab 7: Decode Everything (Decoder)

### 🎯 Core Objective
Utilize Burp Decoder to decode Base64, URL-encoding, Hex values, split JWT structures, and identify MD5 hashes.

### 🛠️ Burp Suite Workflow
1. Open Burp Suite. Navigate to the **Decoder** tab.
2. **URL Encode**: Copy `%46%4C%41%47%7B%55%52%4C%5F%44%65%63%6F%64%65%5F%4F%4B%7D`, paste it into Decoder, and select **Decode as...** > **URL**. Result: `FLAG{URL_Decode_OK}`.
3. **Base64**: Copy `YnVycF9zdWl0ZV9pc19hd2Vzb21l`, select **Decode as...** > **Base64**. Result: `burp_suite_is_awesome`.
4. **Hex**: Copy `464c41477b4865785f4465636f64655f46756e7d`, select **Decode as...** > **ASCII Hex**. Result: `FLAG{Hex_Decode_Fun}`.
5. **JWT Payload**: Paste the JWT block. Copy only the middle section (between the two dots). Paste it into Decoder and decode as Base64 to reveal the flag: `FLAG{JWT_DECODED_SECRET}`.
6. **MD5 Hash**: Decrypt the hash `21232f297a57a5a743894a0e4a801fc3` to reveal the word: `admin`.

### 🗣️ YouTube Script (What to Say)
> *"Burp Decoder is our quick-conversion translator. Browsers encode variables to send them over the wire safely. Here, we decode hex, url, and base64 strings easily. For JWTs, remember: they consist of three sections divided by dots. We copy the middle payload section and decode it as Base64 to reveal the flag!"*

### ⚠️ Common Student Pitfalls
* Attempting to decode the entire JWT string at once rather than splitting and decoding the payload section individually.
* Expecting Decoder to decrypt MD5 hashes directly (Decoder only generates hashes; use an online database/tool to crack them).

### 💡 Concepts Taught
* Encoding vs. Encryption
* JWT token components
* Base64, Hex, and URL codecs

**Flag**: `FLAG{URL_Decode_OK}`

---

## Lab 8: Weak Session Tokens (Sequencer)

### 🎯 Core Objective
Test the cryptographic randomness of session cookies using Burp Sequencer to identify predictable sequential generation patterns.

### 🛠️ Burp Suite Workflow
1. Go to the Sequencer Lab page (`http://localhost:3000/sequencer`).
2. Click **Generate Session Cookie**.
3. In Burp Suite, open **Proxy** > **HTTP history** and locate the request to `/sequencer/generate`.
4. Right-click the request and choose **Send to Sequencer**.
5. Switch to the **Sequencer** tab.
6. In **Token Location**: choose the radio button for **Cookie: SESSION-TOKEN**.
7. Click **Start live capture**.
8. Let the analyzer collect at least 150-200 tokens. The predictability graph will show extremely low entropy.
9. Locate the flag in the response body of the `/sequencer/generate` API call.

### 🗣️ YouTube Script (What to Say)
> *"If session cookies are predictable, an attacker can guess a active session ID and hijack accounts. Burp Sequencer runs mathematical tests on token collections to evaluate their randomness. Here, the server issues linear tokens: SESSION-1001, 1002, etc. Sequencer immediately detects this zero-entropy sequence, proving the session configuration is vulnerable."*

### ⚠️ Common Student Pitfalls
* Testing the HTTP response length instead of the cookie header string.
* Terminating the live capture before it collects enough tokens to compute initial statistical trends.

### 💡 Concepts Taught
* Cryptographic randomness (entropy)
* Session prediction risks
* Sequencer configuration

**Flag**: `FLAG{SEQUENCER_PREDICTABLE_TOKENS}`

---

## Lab 9: Save Interesting Requests (Organizer)

### 🎯 Core Objective
Use Burp Organizer to save, document, categorize, and tag sensitive requests (e.g., containing API keys or configuration files) found during a pentest.

### 🛠️ Burp Suite Workflow
1. Visit the Organizer Lab page (`http://localhost:3000/organizer`).
2. Click **Trigger Diagnostics**, **Trigger Staff Auth Log**, and **Trigger Developer Secrets Config** to generate background history traces.
3. In Burp Suite, open **Proxy** > **HTTP history**.
4. Identify the requests to:
   * `GET /api/admin/system-diagnostics`
   * `POST /api/auth/login`
   * `GET /api/debug/config`
5. Right-click each request and select **Send to Organizer**.
6. Switch to the **Organizer** tab.
7. Select the requests. Double-click the **Tags** or **Notes** columns to assign labels (e.g., 'Staging Creds', 'API Key Leaks') and write documentation notes.
8. Read the configuration request response in Organizer to extract the flag.

### 🗣️ YouTube Script (What to Say)
> *"Organizer is your central notebook in Burp Suite. During a pentest, you'll find hundreds of endpoints. Keeping track of them in external text documents is messy. By sending important API requests to Organizer, you can rate them, tag them, and write notes. Let's look at the config query: we can document the API key and find our flag right here!"*

### ⚠️ Common Student Pitfalls
* Confusing Organizer with Repeater (Repeater active replays requests; Organizer serves as a static documentation notepad).

### 💡 Concepts Taught
* Evidence collection and organization
* Request categorization and tagging
* API key leakage identification

**Flag**: `FLAG{ORGANIZER_KEYS_SAVED}`

---

## Lab 10: Traffic Monitoring (Logger)

### 🎯 Core Objective
Filter and search heavy telemetry noise streams inside Burp Logger to isolate a single request containing a custom debug header.

### 🛠️ Burp Suite Workflow
1. Open Burp Suite and navigate to the **Logger** tab.
2. Go to the Logger Lab page (`http://localhost:3000/logger`). The telemetry log terminal will start spawning constant background requests.
3. Click the **Send Debug Report** button.
4. Go to Burp Logger. Click the **Filter** bar at the top of the interface.
5. In the search box, search for: `/api/admin/debug-flag` or search for the header value `teach-burp`.
6. Press enter. Double-click the isolated request row.
7. Open the **Response** tab and copy the flag.

### 🗣️ YouTube Script (What to Say)
> *"Modern websites generate massive traffic noise through telemetry, ads, and health checks. Finding a specific request in HTTP History can feel like finding a needle in a haystack. That's where Burp Logger shines. Logger records all traffic and lets us search and filter. By searching for our debug API target, we filter out the noise instantly and retrieve our flag!"*

### ⚠️ Common Student Pitfalls
* Trying to scroll manually through the rapid telemetry logs instead of using the search filter.
* Forgetting to click the 'Send Debug Report' button to generate the request before searching.

### 💡 Concepts Taught
* Real-time traffic logging
* Advanced search filters
* Isolating target requests

**Flag**: `FLAG{LOGGER_SECRET}`

---

## Lab 11: Out-of-Band Attacks (Collaborator Theory)

### 🎯 Core Objective
Understand the mechanics of Out-of-Band Application Security Testing (OAST) and visualize a blind SSRF callback loop.

### 🛠️ Burp Suite Workflow
1. Go to the Collaborator Lab page (`http://localhost:3000/collaborator`).
2. Input a payload address (e.g., `test.oastify.com`) in the Collaborator input field.
3. Click the **Test SSRF Vulnerability** button.
4. Watch the animated timeline on the page:
   * Review how the server processes the payload.
   * Observe the DNS query lookup.
   * Observe the HTTP callback trigger.
5. Copy the flag released at the final step of the callback visualization.

### 🗣️ YouTube Script (What to Say)
> *"If an application is vulnerable to blind SSRF or blind XXE, the server processes our input but doesn't return any response. To confirm the bug, we use Out-of-Band attacks (OAST). We tell the server to query a domain we control (Burp Collaborator). When the server makes a DNS or HTTP lookup, Collaborator logs it, verifying the vulnerability. This simulation shows you exactly how this back-and-forth callback works step-by-step!"*

### ⚠️ Common Student Pitfalls
* Expecting Burp Suite Community Edition to have the native 'Burp Collaborator client' tab (this is a Professional-only feature, which is why this visual simulation is so valuable for learning the theory!).

### 💡 Concepts Taught
* Out-of-Band Application Security Testing (OAST)
* Blind SSRF vulnerabilities
* DNS and HTTP network callback verification

**Flag**: `FLAG{OUT_OF_BAND_SIMULATION}`
