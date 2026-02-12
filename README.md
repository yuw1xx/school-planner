# 🎓 School Planner

![Version](https://img.shields.io/badge/version-1.0.0-blueviolet)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-success)

**School Planner** is a sleek, mobile-first web dashboard designed to help students organize their academic life. It functions as a "second brain," combining task management, grade tracking, scheduling, and focus tools into a single, app-like interface.

Built with pure **HTML, CSS, and JavaScript**, it requires no backend and saves all data locally to your device.

---

## ✨ Key Features

### 🏠 **Smart Dashboard**
* **Dynamic Greeting:** Changes based on the time of day.
* **Happening Now:** Instantly shows your current class or free time.
* **Up Next:** Displays your next immediate deadline.
* **App Dock:** Customizable shortcuts to your most-used links (Canvas, Gmail, etc.) with custom icons.

### ✅ **Task Management**
* **Categories:** Sort tasks by Homework, Exams, Projects, or Personal items.
* **Deadlines:** Tasks are automatically sorted by due date.
* **Swipe/Click to Delete:** Easy management of completed items.

### 🍅 **Focus Timer (Pomodoro)**
* **Customizable Intervals:** Preset focus modes (25m, 45m, 60m) and break times (5m, 15m).
* **Visual Ring:** SVG-based countdown animation.
* **Distraction Free:** Locks scrolling while the timer is active to prevent doom-scrolling.

### 📊 **Advanced Grade Calculator**
* **Multi-System Support:** Works with:
    * Percentage (%)
    * GPA (4.0 Scale)
    * GPA (Weighted 5.0)
    * Letter Grades (A-F)
    * UK Classification (1st, 2:1, etc.)
* **Target Calculator:** Calculates exactly what you need on your final exam to achieve your goal grade.

### 🎨 **Customization & Data**
* **Themes:** Switch between Violet, Emerald, Berry, and Ocean themes.
* **Privacy:** All data is stored in `localStorage`. Nothing leaves your device.
* **Backup:** Built-in JSON Export/Import to transfer data between devices.

---

## 🛠️ Installation & Usage

Since this project uses vanilla web technologies, you don't need to install Node.js or run a server.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yuw1xx/school-planner.git
    ```
2.  **Open the app:**
    * Navigate to the folder and double-click `index.html`.
    * The app will launch in your default browser.

#### Pro Tip
For the best experience on mobile, use Safari (iOS) or Chrome (Android) and select **"Add to Home Screen"**. The app is optimized with `user-scalable=no` and touch-friendly targets to feel like a native app.

---

## 💻 Tech Stack

* **HTML5:** Semantic structure.
* **CSS3:** CSS Variables, Flexbox, Grid, and complex animations.
* **JavaScript (ES6+):** Logic for the calculator, timer, and DOM manipulation.
* **Google Fonts:** "Google Sans Flex" and "Material Symbols Rounded".

---

## 🤝 Contributing

Contributions are welcome! If you have ideas for new widgets or themes:

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/NewWidget`).
3.  Commit your Changes (`git commit -m 'Add some NewWidget'`).
4.  Push to the Branch (`git push origin feature/NewWidget`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
