# Spotify Visuals Generator

*Generate cool visualizations based on your recent listening history!*

*Log in with your Spotify account and let me handle the rest!*

## Vision

Abstract images are created from your recently played songs on a rolling basis. Variations are generated on each image, then frame interpolation is used to create a smooth transition between each variation. This visualization is looped for a period of time, then your recently played music is reassessed and we seamlessly transition to the next visualization. The result is a neverending, captivating visual experience that reflects the energy and essence of your music choices, acting as a stunning computer screensaver, background visuals casted to your TV, or the backdrop for any scenario you can think of that could use a vibe boost!

Note that this is very much a work in progress, and completion of the full vision as outlined above may (will) require waiting for technology to catch up. The speed of this innovation is currently out of my control, but will hopefully be somewhat in my control soon if I play my cards right.

## Internals

This webapp was built using Vite and React, with NextUI for components and Tailwind CSS for making flexbox more complicated than it needs to be.

As of now, text generation is provided by Mistral AI's `Mixtral-8x7B-Instruct-v0.1` model, and text-to-image generation is provided by RunwayML's `stable-diffusion-v1-5` model. These models are accessed via Hugging Face's Inference API, allowing a serverless interface for fast prototyping.

*At the moment, use of Spotify's API requires me to manually authorize your email address.*

## Further reading

[text generation model](https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1)

[text-to-image generation model](https://huggingface.co/runwayml/stable-diffusion-v1-5)

[Hugging Face Inference API reference](https://huggingface.co/docs/api-inference/index)