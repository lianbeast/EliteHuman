<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://lianbeast.github.io/EliteHuman/">
    <img src="public/brand/mark-192.png" alt="Elite Human" width="110" height="110">
  </a>

  <h3 align="center">Elite Human</h3>

  <p align="center">
    <strong>Your Limits Is Your Mentality.</strong>
    <br />
    <em>Wear Discipline. Train Body. Discipline Mind. Elevate Spirit.</em>
    <br />
    <br />
    <a href="https://lianbeast.github.io/EliteHuman/">View the archive</a>
    &middot;
    <a href="https://lianbeast.github.io/EliteHuman/archive">Read the record</a>
    &middot;
    <a href="https://www.instagram.com/elitehuman/">Instagram</a>
  </p>
</div>

---

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#the-record">The Record</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

---

<!-- ABOUT THE PROJECT -->
## About The Project

[![Elite Human archive][product-screenshot]](https://lianbeast.github.io/EliteHuman/)

The `@elitehuman` archive. Every one of the 105 posts made between October 2015 and
November 2018, pulled off Instagram and kept as a monochrome editorial record —
original photographs, captions verbatim, typos and hashtags intact.

**Three routes, and that is the whole site:**

| Route | Page |
|---|---|
| `/` | Brand statement, selected marks, pillar breakdown |
| `/archive` (`?pillar=IRON\|MIND\|SPIRIT`) | All 105 marks, filterable, lightbox |
| `/post/:id` | One mark: full caption, likes, pillar, date, prev/next |

The pillar split is fixed by the archive itself and is not editorial: **IRON 83,
MIND 20, SPIRIT 2.**

Nothing here is rewritten into marketing copy. A post says what it said, and the
typos stay.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### The Record

Content is data, not source. `public/assets/posts.json` holds the 105 records;
`public/assets/img/` holds the original photographs. Refreshing the archive is a
scraper run, not a code change:

```sh
npm run scrape   # rewrites posts.json + img/ from @elitehuman
```

Captions are written to disk byte-for-byte as Instagram returned them. If a
caption is paraphrased anywhere in this repo or on the site, that is a bug.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![Vite][Vite-badge]][Vite-url]
* [![React][React.js]][React-url]
* [![Vitest][Vitest-badge]][Vitest-url]
* [![Apify][Apify-badge]][Apify-url]
* [![GitHub Pages][Pages-badge]][Pages-url]

Fonts are self-hosted via Fontsource — Spectral for body, Space Mono for labels,
Archivo Black for display. No font CDN, no runtime fetch.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- GETTING STARTED -->
## Getting Started

Static site, static host. Clone, install, run.

### Prerequisites

Node 20 or newer (CI builds on 22).

```sh
node --version
npm --version
```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/lianbeast/EliteHuman.git
   ```
2. Install packages
   ```sh
   cd EliteHuman
   npm install
   ```
3. Start the dev server
   ```sh
   npm run dev
   ```
   The site is served under a `/EliteHuman/` base path, so open
   <http://localhost:5173/EliteHuman/> — not the bare root.

> `vite.config.js` sets `base: '/EliteHuman/'` for GitHub Pages. Serving from
> another path means changing that one line.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- USAGE EXAMPLES -->
## Usage

```sh
npm run dev       # vite dev server on :5173
npm test          # vitest — router, scraper pillar classification
npm run build     # static bundle into ./dist
npm run preview   # serve the build on :4173
npm run scrape    # refresh posts.json + photographs from @elitehuman
npm run deploy    # build, then copy public/assets into dist/assets
```

`npm run scrape` needs an Apify actor run; the rest need nothing but Node.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- ROADMAP -->
## Roadmap

- [x] Full 105-post archive with pillar filtering
- [x] Per-post routes with verbatim captions
- [x] Brand motto in the header and footer lockups
- [x] GitHub Pages deploy on push to `main`
- [ ] Changelog
- [ ] More templates and examples

See the [open issues][issues-url] for the full list.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- CONTRIBUTING -->
## Contributing

This is a personal archive, not an open-source project. The record is fixed: 105
posts, original photographs, captions as written. Contributions that rewrite
history, re-crop brand artwork, or "improve" the copy will be declined.

If something is genuinely broken — a route 404s, a photograph fails to load, a
caption renders wrong — open an issue or send a fix.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- LICENSE -->
## License

No license file. The photographs, captions, wordmark and brand assets are
Elite Human's and are not covered by an open-source license. The site source is
all rights reserved.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- CONTACT -->
## Contact

**Elite Human** — [@elitehuman](https://www.instagram.com/elitehuman/)

Project link: [https://github.com/lianbeast/EliteHuman](https://github.com/lianbeast/EliteHuman)

Live site: [https://lianbeast.github.io/EliteHuman/](https://lianbeast.github.io/EliteHuman/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Best README Template][brt-url] — the structure of this file
* [Vite](https://vite.dev)
* [Apify](https://apify.com) — Instagram scraping
* [Fontsource](https://fontsource.org) — self-hosted fonts
* [GitHub Pages](https://pages.github.com)
* [Img Shields](https://shields.io)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/lianbeast/EliteHuman.svg?style=for-the-badge
[contributors-url]: https://github.com/lianbeast/EliteHuman/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/lianbeast/EliteHuman.svg?style=for-the-badge
[forks-url]: https://github.com/lianbeast/EliteHuman/network/members
[stars-shield]: https://img.shields.io/github/stars/lianbeast/EliteHuman.svg?style=for-the-badge
[stars-url]: https://github.com/lianbeast/EliteHuman/stargazers
[issues-shield]: https://img.shields.io/github/issues/lianbeast/EliteHuman.svg?style=for-the-badge
[issues-url]: https://github.com/lianbeast/EliteHuman/issues
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&logoColorB=555
[linkedin-url]: https://linkedin.com/in/lianbeast

[product-screenshot]: docs/hero.png

[Vite-badge]: https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=FFD028
[Vite-url]: https://vite.dev
[React.js]: https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://react.dev
[Vitest-badge]: https://img.shields.io/badge/Vitest-2-6E9F18?style=for-the-badge&logo=vitest&logoColor=8FD94F
[Vitest-url]: https://vitest.dev
[Apify-badge]: https://img.shields.io/badge/Apify-2-000000?style=for-the-badge&logo=apify&logoColor=00ADEF
[Apify-url]: https://apify.com
[Pages-badge]: https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=github&logoColor=white
[Pages-url]: https://pages.github.com

[brt-url]: https://github.com/othneildrew/Best-README-Template
