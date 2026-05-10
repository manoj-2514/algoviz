# AlgoViz — Interactive DSA Learning Platform

> Learn Data Structures and Algorithms through step-by-step animations, color-coded visualizations, quizzes, and live explanations.

🌐 **Live Demo**: [https://manoj-2514.github.io/algoviz/](https://manoj-2514.github.io/algoviz/)

---

## 📸 Screenshots

| Sorting Visualizer | Graph Algorithms |
|---|---|
| Step-by-step bar animations with live explanation | BFS/DFS/Dijkstra with traversal path display |

---

## ✨ Features

### 🎯 Core Visualizations
- **15+ Algorithm Animations** — step-by-step with pause, resume, and reset
- **Live Explanation Panel** — color-coded explanations updating at every step
- **Real-world Analogies** — every step explained using everyday comparisons
- **Traversal Path Display** — shows visited node order for all graph algorithms
- **Multi-language Code** — implementations in C++, Python, Java, JavaScript, C

### 🌙 User Experience
- **Dark Mode** — system preference detected, toggle persists across all pages
- **Progress Tracker** — green ✓ badge on every algorithm card you've visited
- **Shareable URL** — share any visualization state via a single link
- **Quiz System** — 4 questions per algorithm with explanations and algorithm context
- **Star Ratings** — quiz scores saved and displayed on algorithm cards

### 📊 Algorithm Categories

#### 🔀 Sorting (sorting.html)
| Algorithm | Best | Average | Worst | Space |
|---|---|---|---|---|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) |

#### 🔍 Searching (searching.html)
| Algorithm | Best | Average | Worst | Space |
|---|---|---|---|---|
| Linear Search | O(1) | O(n) | O(n) | O(1) |
| Binary Search | O(1) | O(log n) | O(log n) | O(1) |

#### 🕸️ Graph Algorithms (graph.html)
| Algorithm | Time | Space |
|---|---|---|
| BFS | O(V + E) | O(V) |
| DFS | O(V + E) | O(V) |
| Dijkstra's | O((V + E) log V) | O(V) |
| Prim's | O(E log V) | O(V) |
| Kruskal's | O(E log E) | O(V) |

#### 🧮 Other Algorithms (other.html)
| Algorithm | Time | Space |
|---|---|---|
| Kadane's | O(n) | O(1) |
| Floyd Warshall | O(n³) | O(n²) |
| Warshall's | O(n³) | O(n²) |
| KMP String Matching | O(n + m) | O(m) |
| Rabin Karp | O(n + m) avg | O(1) |

---

## 🎮 How to Use

### Visualizer Controls
```
Generate New Array  → creates a fresh random dataset
Array Size slider   → adjust number of elements (5–50)
Speed slider        → control animation speed (1–5)
Start               → begin the animation
Pause / Resume      → pause at any step
Reset               → go back to initial state
Custom Input        → type your own array values
Share 🔗            → copy a shareable link of current state
```

### Quiz System
```
1. Click "🧠 Take Quiz" on any algorithm card
2. Answer 4 questions — conceptual, trace-based, scenario, edge case
3. See immediate feedback — green ✓ correct, red ✗ wrong
4. Read the explanation (why the answer is correct)
5. Read the algorithm context (the concept behind the question)
6. Your best score is saved and shown as ⭐ stars on the card
```

### Progress Tracking
```
Every algorithm you visualize gets a green ✓ badge on its card.
Progress is saved in localStorage — persists across page reloads.
Open in a new tab? Start fresh (sessionStorage is tab-scoped).
```

### Shareable URL
```
Click the 🔗 Share button inside any visualizer modal.
The URL encodes: algorithm + array + speed + (search target for searching).
Paste the link anywhere — it restores the exact visualization state.
```

---

## 🛠️ Tech Stack

```
HTML5        → semantic structure, all 5 pages
CSS3         → custom properties, CSS Grid, Flexbox, animations
JavaScript   → vanilla JS only, no frameworks, no build tools
localStorage → progress tracking, quiz scores, dark mode preference
URLSearchParams → shareable URL state encoding
GitHub Pages → static hosting, free, auto-deploys on push
```

**Zero dependencies. No npm. No bundler. No backend.**

---

## 📁 Project Structure

```
algoviz/
├── index.html              # Homepage — categories, learn DSA, about
├── sorting.html            # 6 sorting algorithm visualizers
├── searching.html          # 2 searching algorithm visualizers
├── graph.html              # 5 graph algorithm visualizers
├── other.html              # 5 other algorithm visualizers
├── favicon.svg             # SVG favicon
├── css/
│   └── styles.css          # All styles — dark mode vars, animations, quiz
├── js/
│   ├── sorting.js          # Sorting animations and logic
│   ├── searching.js        # Searching animations and logic
│   ├── graph.js            # Graph animations and logic
│   ├── other.js            # Other algorithm animations
│   ├── themeManager.js     # Dark mode toggle + persistence
│   ├── progressTracker.js  # localStorage progress badges
│   ├── quizData.js         # 64 questions (4 per algorithm)
│   ├── quizModal.js        # Quiz UI — modal, scoring, star badges
│   ├── shareURL.js         # Shareable URL for sorting page
│   ├── shareURLSearch.js   # Shareable URL for searching page
│   ├── shareURLGraph.js    # Shareable URL for graph page
│   └── shareURLOther.js    # Shareable URL for other page
└── README.md
```

---

## 🚀 Getting Started

### View Live
Just open: **[https://manoj-2514.github.io/algoviz/](https://manoj-2514.github.io/algoviz/)**

No installation. No signup. No login. Works in any modern browser.

### Run Locally
```bash
# Clone the repo
git clone https://github.com/manoj-2514/algoviz.git

# Enter the folder
cd algoviz

# Open in browser (any of these work)
open index.html                    # macOS
start index.html                   # Windows

# Or use a local server (recommended)
python -m http.server 8000         # Python 3
npx serve .                        # Node.js
```

Then open `http://localhost:8000` in your browser.

---

## 🎨 Visualization Color Coding

### Sorting
| Color | Meaning |
|---|---|
| 🟠 Orange | Elements being compared |
| 🔴 Red | Elements being swapped / pivot |
| 🟢 Green | Element in final sorted position |
| 🔵 Blue | Default unsorted state |

### Searching
| Color | Meaning |
|---|---|
| 🟠 Orange | Element currently being checked |
| 🟢 Green | Element found |
| 🔴 Red | Element not found |
| 🔵 Blue | Current search range |

### Graph
| Color | Meaning |
|---|---|
| 🟠 Orange | Node currently being visited |
| 🔵 Blue | Node fully visited |
| 🟢 Green | Shortest path / MST complete |
| ⚫ Grey | Unvisited node |

---

## 📖 Educational Design

Every algorithm explanation follows a 4-component structure:

```
1. WHAT  — what is happening at this exact step
2. WHY   — why this step is necessary
3. ANALOGY — real-world comparison (cards, books, maps, water)
4. NEXT  — what the algorithm does after this step
```

### Quiz Question Types
```
Type 1 — Conceptual   : Big-O time/space complexity
Type 2 — Trace-based  : array/graph state after N steps
Type 3 — Scenario     : when to use this vs another algorithm
Type 4 — Edge case    : behavior on empty, sorted, single element
```

---

## 🤝 Contributing

Contributions are welcome!

```bash
# Fork the repo on GitHub
# Clone your fork
git clone https://github.com/YOUR-USERNAME/algoviz.git

# Create a feature branch
git checkout -b feature/your-feature-name

# Make changes, then commit
git add .
git commit -m "feat: description of your change"

# Push and open a Pull Request
git push origin feature/your-feature-name
```

### Guidelines
- Keep it vanilla JS — no frameworks, no build tools
- Don't modify existing animation logic
- Test on Chrome, Firefox, and Safari
- Ensure dark mode works for any new UI elements
- Use `av-` prefix for any new CSS classes

---

## 🐛 Found a Bug?

[Open an issue](https://github.com/manoj-2514/algoviz/issues/new) with:
- Which algorithm/page
- What you expected vs what happened
- Browser and OS

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 👤 Built By

**Manoj Kumar**
- GitHub: [@manoj-2514](https://github.com/manoj-2514)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/YOUR-LINKEDIN-ID)

---

*AlgoViz — Making DSA visual, intuitive, and actually fun to learn.* 🚀