# 450 DSA Cracker

A clean, responsive, and lightweight **Hugo + Tailwind CSS** web app to help you crack Data Structures & Algorithms, one problem at a time — based on [Love Babbar’s 450 DSA Sheet](https://www.geeksforgeeks.org/dsa-sheet-by-love-babbar/).

> 🚀 **Live**: [https://450dsa.bytezone.in](https://450dsa.bytezone.in)
> 📈 **Hosted at zero cost**

---

## 📚 Overview

The **450 DSA Cracker** is a self-paced tracker for competitive programmers and job seekers. It presents 450 handpicked problems in a topic-wise manner with built-in progress tracking, difficulty filters, and a beautiful UI.

---

## 🔥 Features

* ✅ Track your progress across 15+ DSA topics
* 🧠 Difficulty-based filtering: Easy / Medium / Hard
* 🔍 Search across all problems
* 🌙 Dark mode for better night-time experience
* 📀 Save progress locally using browser storage
* ⚡ Blazing fast and mobile responsive
* 🧙️‍ Built entirely with static tools — no backend required

---

## 🛠️ Built With

* [Hugo](https://gohugo.io/) – static site generator
* [Tailwind CSS](https://tailwindcss.com/) – utility-first CSS framework
* [npm](https://www.npmjs.com/) – used to manage Tailwind build

---

## 🧑‍💻 Local Development Setup

You can run this project locally in a few simple steps.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/450dsa-cracker.git
cd 450dsa-cracker
```

### 2. Install Hugo

Follow the instructions at [https://gohugo.io/getting-started/installing/](https://gohugo.io/getting-started/installing/)

To verify installation:

```bash
hugo version
```

### 3. Install Node.js and Tailwind dependencies

Make sure Node.js and npm are installed. Then:

```bash
npm install
```

To build Tailwind CSS in development mode:

```bash
npm run dev
```

### 4. Start Hugo Server

```bash
hugo server -D
```

Now visit [http://localhost:1313](http://localhost:1313) in your browser.

---

## 📁 Project Structure

```
.
├── assets/            # Tailwind CSS input
├── content/           # Markdown files for all DSA problems
├── layouts/           # Hugo templates
├── static/            # Static assets (favicon, icons)
├── themes/            # Custom or external Hugo themes
├── tailwind.config.js # Tailwind config
├── config.toml        # Hugo site config
├── package.json       # Tailwind/npm scripts
└── ...
```

---

## 🚀 Deployment

You can host this for free using:

* [GitHub Pages](https://pages.github.com/)
* [Netlify](https://www.netlify.com/)
* [Cloudflare Pages](https://pages.cloudflare.com/)

To build a production version:

```bash
hugo --minify
```

This will generate static files inside the `public/` directory which you can deploy.

---

## 🤝 How to Contribute

Contributions are welcome! Here’s how:

1. 🍜 Fork the repo
2. 🛠️ Create a new branch: `git checkout -b feature/my-feature`
3. 🧪 Make your changes and test locally
4. 📀 Commit your changes: `git commit -m "Add my feature"`
5. 🚀 Push to your fork: `git push origin feature/my-feature`
6. 🔀 Submit a Pull Request

### Common Areas to Contribute

* Add more filtering features
* Improve responsive UI
* Refactor Hugo templates
* Optimize Tailwind usage
* Add new problem categories or enhancements

---

## 👨‍💼 Creator

**Mukesh Kumar Mandal**
🌐 [LinkedIn](https://www.linkedin.com/in/mukimondal/)
📧 [mkuser608@gmail.com]mkuser608@gmail.com)

Problem set inspired by [Love Babbar's 450 DSA Sheet](https://www.geeksforgeeks.org/dsa-sheet-by-love-babbar/)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE)

> Free to use, improve, and share ✨

---

## 📌 Acknowledgements

* [GeeksforGeeks](https://www.geeksforgeeks.org/) for problem references
* [Hugo](https://gohugo.io/)
* [Tailwind CSS](https://tailwindcss.com/)
* Open-source community ❤️
