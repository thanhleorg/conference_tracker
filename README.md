
# 📅 CS Conference Deadlines @ [roars.dev/csconfs](https://roars.dev/csconfs/)

**CSConfs** is a simple and open-source website for tracking **Computer Science conference deadlines**, **notifications**, **locations**, and more! 🎯 csconfs uses conferences defined by [CSRankings](https://csrankings.org/) and [CORE](https://portal.core.edu.au/conf-ranks/). Enjoy tracking your CS conferences! 🎉 


---

## 🌐 Live Site

Visit here 👉 [https://roars.dev/csconfs/](https://roars.dev/csconfs/)

---

## 📂 Project Structure

- **Open**: This project is open-source on [**GitHub**](https://git.roars.dev/csconfs).  
- **Tech stuff**: This website is built using **React** and **Node.js**. It is a **static site** that fetches data from a **YAML** file and is hosted through **Github Pages**.
- **Data:** Main information is stored in **`public/data/conferences.yaml`**.

---

## 🤝 Contributions

We welcome contributions! 🛠️

### How to contribute:
> You can help **check**, **add**, or **fix** conference data in **`public/data/conferences.yaml`**.  Use the existing entries as examples to maintain formatting and consistency.

- **Fork** the repository.
- **Clone** your forked repository to your local machine.
- Make your changes in the `public/data/conferences.yaml` file.
- **Test** your changes locally (see below).
- **Commit** and **Push** your changes with a clear message.
- Create a **pull request** to the [original repository](https://git.roars.dev/csconfs).
- If you have questions or comments, feel free to open a [Github issue](https://github.com/dynaroars/csconfs/issues).


---

## 🧪 To Test Locally

1. **Install dependencies**:

```bash
# Check versions:
node -v  # v23.11.0 (on my Mac OS)
npm -v   # 11.3.0 (on my Mac OS)

# In the project root, e.g., ~/git/csconfs/ 
npm install
```

2. **Run the local server**:

```bash
npm run start
```

3. **View in browser**:

```
http://localhost:3000/
```

---

## 🚀 Deploy to GitHub Pages
> Deploy to `roars.dev/csconfs` (only for maintainers):

```bash
npm run deploy
```

- The script handles deployment to the `gh-pages` branch.
- Stay on the `main` branch—no manual branch switching needed!

---


Created with ❤️ by [Roars Lab](https://roars.dev)  
