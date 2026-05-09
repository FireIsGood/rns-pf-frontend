# Rabbit and Steel Party Finder Online

> A web frontend to see lobbies in Rabbit and Steel.

You may view the site at [rns-pf.xyz](rns-pf.xyz)

This is a static site written in Svelte using a custom rust backend by [Functional
Lalafell](https://steamcommunity.com/profiles/76561198260481093) on the **mino_dev games** Discord
server

## Local Development

Install dependencies with your preferred package manager:

```bash
pnpm i
```

Add the `.env` file:

```bash
cp .env.example .env
```

Run the development server:

```bash
# default port: 2757
pnpm run dev
```

The server can be visited at [http://localhost:2757/](http://localhost:2757/) by default.

## Building

To build the production version:

```bash
pnpm run build
```

To preview the build:

```bash
pnpm run preview
```

The site will be built to `/build` and can be statically hosted.
