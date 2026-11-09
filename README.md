# Percebera

Percebera is a community platform for exchanging skills and knowledge in Mozambique. People teach what they already know, learn what they want to learn, and no money changes hands.

Live demo: [https://percebera.web.app](https://percebera.web.app)

> This repository is a product demo. Profiles, stories, ratings and community numbers are illustrative. Offers, proposals and completed swaps are stored in the browser. The launch waitlist is real and sends submissions to the team.

## The model

- Direct skill swaps. No credits, escrow, commissions or subscriptions.
- A swap has two sides: each person teaches something and learns something.
- Discovery by skill, province and language.
- Offers, proposals, acceptance, completion and reviews after a swap.
- Trust shown in explicit levels: identity, community and professional credential.
- A WhatsApp handoff after an accepted proposal that recommends a username instead of exposing a phone number.

The interface is in Portuguese (Mozambique). Copy avoids em dashes, spam framing and direct email exposure.

## Stack

- React 18 and TypeScript
- Vite 6
- React Router 6
- Plain CSS with design tokens in `src/styles/global.css`
- IBM Plex Sans for interface text and IBM Plex Mono for labels

There is no backend, no authentication provider and no database in this demo. State is persisted with `localStorage`.

## Getting started

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev
```

The dev server runs at [http://127.0.0.1:8080](http://127.0.0.1:8080).

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start Vite on port 8080 |
| `npm run build` | Type check and build to `dist` |
| `npm run preview` | Preview the production build on port 8080 |

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/descobrir` | Discover offers |
| `/oferta/:offerId` | Offer detail |
| `/propor/:offerId` | Propose a swap |
| `/perfil/:personId` | Public profile |
| `/painel` | Personal dashboard and swaps |
| `/publicar` | Publish an offer |
| `/como-funciona` | How the model works |
| `/confianca` | Trust and safety |
| `/comunidade` | Community and stories |
| `/lista-de-espera` | Launch waitlist |

## Project structure

```text
src/
  components/   Shared UI, header, footer, forms and icons
  data/         Types and seed data
  lib/          Waitlist submission and small helpers
  pages/        One component per route
  store/        Application state and localStorage persistence
  styles/       Global design system CSS
```

## Demo data

Demo state is stored under the `percebera.state.v2` key in `localStorage`. Clearing site data resets the demo to the seed data in `src/data/seed.ts`.

Before real use, offers, proposals, reviews and accounts need a backend, server side authorization and moderation. None of that exists here yet.

## Launch waitlist

The waitlist form posts to FormSubmit at `simplyallan@outlook.com`. It collects an email, an optional LinkedIn profile and explicit consent. The first submission requires a one-time activation link in that inbox, after which submissions are delivered normally.

## Deployment

The site is deployed with Firebase Hosting in the `percebera` project:

```bash
npm run build
firebase deploy --only hosting --project percebera
```

`firebase.json` serves `dist` and rewrites all routes to `index.html`, so deep links work for the single page application. `.firebaserc` sets `percebera` as the default project.

Default Hosting URL: [https://percebera.web.app](https://percebera.web.app)
