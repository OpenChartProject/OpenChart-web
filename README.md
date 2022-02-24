[![](https://imgur.com/bhQKKSZ.png)](https://discord.gg/wSGmN52)

Join the Discord for announcements and be part of the discussion!

--------------

[![](branding/banner_small.png)](http://openchart.io)

OpenChart is a free, open source, web-based tool for creating rhythm game charts and maps. OpenChart is currently in active development.

We plan to add support for the following games:

- [Etterna](https://etternaonline.com/) / [Stepmania](https://www.stepmania.com/)
- [Quaver](https://quavergame.com/)
- [Osu! (mania)](https://osu.ppy.sh/)

You can view the editor here: http://openchart.io/

# Motivation

The primary goal for OpenChart is to create an editor which is:

1. Easy to use
2. Open source
3. Available for all platforms
4. Supports several rhythm games
5. Supports n-key charting (4k, 6k, 7k, etc.)

There are several other bullet points that could be added but it really just boils down to this: Provide the community with a transparent, accessible editor that makes it easy to share charts/maps between games.

# Getting Started

## Prereq's

You will need:

- Node
    - v14 is preferred but other versions will likely work
- yarn
- Docker

## Setup

The only setup that needs to be done is to install the dependencies:

```
yarn
```

## Serving Files Locally

The preferred method is to use Docker and serve the files through nginx. There are issues using `parcel serve`, mainly due to the fact that noteskins are copied to the `dist/` dir manually.

Start by opening two terminals. The first will watch and rebuild for changes:

```
yarn watch
```

The second will run nginx and serve the files at http://localhost:8000/

```
docker run \
    --rm \
    -v "`pwd`/dist:/usr/share/nginx/html:ro" \
    -p "8000:80" \
    nginx
```

# License

The OpenChart project is dual-licensed.

All code and non-branding related assets are protected under the GNU GPLv3 license. See the [LICENSE](LICENSE) for more information.

Branding images are protected under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License. This applies to any artifacts located in the [branding/](branding) folder. See the [README](branding/README.md) for more information.
