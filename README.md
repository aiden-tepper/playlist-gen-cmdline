# Spotify Visuals Generator

Generate captivating visualizations from your Spotify listening history! Dive into a neverending visual experience that beautifully mirrors the energy and essence of your music choices. Perfect for screensavers, TV backdrops, or enhancing any space with a unique vibe.

## Introduction

Spotify Visuals Generator transforms your recently played Spotify tracks into abstract, dynamic visuals. Inspired by the classic music visualizers of yesteryear, this project aims to create a unique visual representation that matches one's music taste better and with more semantic understanding than any visualizer ever has. Whether you're a music enthusiast looking for a new way to experience your songs or a developer interested in creative coding (or, like me, interested in having a colorful distraction on your secondary monitor while you code something non-creative), this project is for you.

Abstract images are created from your recently played songs on a rolling basis. Variations are generated on each image, then frame interpolation is used to create a smooth transition between each variation. This visualization is looped for a period of time, then your recently played music is reassessed and we seamlessly transition to the next visualization. The result is a neverending, captivating visual experience that reflects the energy and essence of your music choices, acting as a stunning computer screensaver, background visuals casted to your TV, or the backdrop for any scenario you can think of that could use a vibe boost!

## Current State

Note that this is very much a work in progress, and completion of the full vision as outlined above may (will) require waiting for technology to catch up. The speed of this innovation is currently out of my control, but will hopefully be somewhat in my control soon if I play my cards right.

As of now, your most recent 25 songs are assigned classifications and colorful descriptors which are in turn used in an image generation prompt. Future work will resume when one of the following happens:

1) Text-to-video or image-to-video models are efficient enough for near-real time generation

2) Normal consumer computers are powerful enough to reasonably run these models locally

3) Cloud compute is reasonably cheap enough to support a fun project like this

*I want to stress that I have NO plans to integrate Apple Music. Feel free to email me if you feel as if this is immoral.*

## Internals

This web application is built with:

- **Frontend**: Vite and React, with NextUI for UI components and Tailwind CSS for styling and making flexbox more complicated than it needs to be.
- **Backend**: Super basic Vercel serverless functions for on-demand compute (mostly just making HTTP requests)
- **Text Generation**: Mistral AI's `Mixtral-8x7B-Instruct-v0.1` for text generation (coming up with colorful descriptors) based on previous listened-to songs.
- **Image Generation**: RunwayML's `stable-diffusion-v1-5` model for generating images based on the generated descriptors.
- **APIs**: Spotify for music data and Hugging Face Inference API for serverless model querying.

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- A Spotify account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/aiden-tepper/spotify-visuals-generator.git
```

2. Navigate to the project directory and install dependencies:

```bash
cd spotify-visuals-generator
npm install
```

3. Configure the Spotify API keys:

- Follow the instructions [here](https://developer.spotify.com/documentation/web-api/tutorials/getting-started) to get your API keys.
- Create a .env file in the root directory.
- Add your Spotify credentials:

```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
```

### Running the Application

```bash
npm run dev
```

Navigate to http://localhost:3000 in your browser to see the app running.

## Contact

For support or inquiries, feel free to contact me at aidenjtep@gmail.com or open an issue on GitHub. I welcome contributions of all kinds from bug fixes to feature enhancements -- let's get in touch!.

## License

This project is licensed under the MIT License - see the LICENSE.txt file for details.

## Further reading

[text generation model](https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1)

[text-to-image generation model](https://huggingface.co/runwayml/stable-diffusion-v1-5)

[Hugging Face Inference API reference](https://huggingface.co/docs/api-inference/index)