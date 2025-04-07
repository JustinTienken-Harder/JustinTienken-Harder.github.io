---
layout: page
title: Projects
permalink: /pages/projects/
---

Here are some random projects that I've worked on in the past or recently.

- [Japanese Garden Map](#japanese-gardens-in-the-us--canada)
- [Japanese Garden Photo Library](#japanese-garden-photo-library--githubgitlab-namespace-abuse)
- [Papito's Website](#papitos-photo-legacy)
- [Rubik's Cube Reinforcement Learning](#rubiks-reinforcement-learning)
- [HAAR Cascades for Rubik's Cube Recognition](#haar-cascades-for-rubiks-recognition)
- [COVID19 Dashboard](#shiny-app-for-covid19-epidemic)


## Japanese Gardens in the US & Canada

A simple project where I scraped all the japanese gardens, with descriptions and locations. Uses google's example API key to avoid ever getting overcharded on my GCP account. They got my credit card after all.

I've actually been to quite a number of locations. This is probably the most robust map of Japanese Gardens in the United States. There are locations on here that are entirely on private property (such as the Japanese Ambassador to the United States' private garden), some inaccessible to the public such as Atlanta's Jimmy Carter Museum (which has an employee only japanese garden). Fortunately, the museum was closed, I hopped a couple fences, and accessed the Japanese garden which was... okay at best. One Japanese garden in south carolina was a triangle the size of 3'x 3' with a small plaque that said "Japanese Garden". 

But there are also some extremely high-quality gardens that go under the radar. Seattle is home to the Seattle Japanese Garden, an extremely pretty garden in it's own right -- but costs $20 to enter. Right nearby, there is the Kobuta Garden, which is, in my opinion, the best Japanese garden in the United States. An extremely beautiful garden which epitomizes the "strolling" garden style. The designers did a wonderful job integrating multiple views of different scenes all throughout the garden. The wandering, many forking paths allow the viewer to get lost in the garden, and review previously visited scenes in an entirely new perspective. The placement of foilage is a master class in forced perspective (even changing perspective of sounds, as tiny streams become waterfalls with parabolic backdrops), miniaturizattion, and asymmetry. Highly recommend going here.

Highly recommend checking out the gardens on google maps first. I've also uploaded photos from a few locations, in my other project:

## Japanese Garden Photo Library + Github/Gitlab Namespace Abuse

Project was to have a personal photo-library of Japanese Gardens that I've visited. I wanted a place to store all the photos in the highest quality possible. Google photo pricing is \(1.99\) /month for 100GB, or \(0.019\) per GB. Amazon's cheapest storage solutions for infrequent access is \(0.004\) per GB; however, because I want this to "live forever" (assuming the longevity of github/gitlab), and some trips easily generated over 2GB of photos (in full resolution), I decided to utilize a little namespace abuse to get my average price per GB per month to free. Github has (soft) repo limits of 2GB (up to 5GB in multiple pushes), while Gitlab has 10GB free per repository with 5GB pushes.

Each garden has it's own repository, I fork a base "webpage" design/layout that I was happy with (where you can click on the camera button to see the full resolution image). Have a script so that the (local) git repository sets multiple upstream sources, and I can push to both of them with a "git push". Have a script to make web-accessible images/thumbnails, with image processing to get reasonable post-processing RAW images for "nice looking" photos, and place everything in the right repo. Push it all up, and it automatically deploys a new webpage.

Because of this "abuse" in repositories/namespace of webpages, I did it on a different account. However, you can see some of the Gardens I've visited below:

- [Morikami](https://PhenomenalPanda.gitlab.io/Morikami/) and [Mirror](https://PhenomenalPanda.github.io/Morikami/)

## Papito's Photo Legacy

Pito was my grandpa -- named him when I was a baby, as I had trouble saying Paul (instead "peepoo"). He was a huge part of my life growing up, and he taught me to love mathematics from a young age (I was doing square roots by first grade, with his help). He always quizzed me with logic puzzles, and math problems when he took me to school. I stayed at his house all the time after he moved to Florida.

He worked at IBM his whole life, and loved computers and computer science. He would have loved to see, and hear, about all the fun machine learning projects that I've had the opportunity to work on. I wish I had the opportunity to talk with him about zero-shot unsupervised anomaly detection, and automated penetration testing with LLMs, and all those wonderful things. His humour and charm is sorely missed in my family.

He had a photo album of old family photos that he hosted. My mom took over hosting, and in 2024 my mom said it was getting too expensive (over 150 dollars a year). So I converted his site into a static-website, and transferred it to Github Pages.

In 2016, I was contacted by a student photographer in Colombia. He was doing a project on history of Colombia (through photography), and apparently Pito took some of the earliest colored photographs of Colombia (as the country is relatively poor, and technology is especially expensive) as well as some of the only surviving black and white photos of the countryside. You can see some of these photographs on his website which is now hosted by GitHub -- after many partial pushes to avoid the 2GB push limit. The website is also skirting on the edge of the 5GB repository size limit. There was much debugging performed so that the "Actions" of building the website could complete.

Recently, my cousin, Andre, and I are doing a Vue.JS redesign of the website to bring the page to modern times. ETA: non-disclosed.

[papitopaul.us](https://papitopaul.us)

## Rubik's Reinforcement Learning

Coded up a lightweight representation of a rubik's cube to try and build a CNN/DNN model to optimize a policy that can solve a rubik's cube. Experimented with A2C, A3C, DQN and other reinforment learning based algorithms (all hand coded). Explored, how cube representations impact policy performance (direct array numerical input, generate a 2*3 X 3*3 image grid of colors, etc), as well as how different algorithms perform. Got my taste of reward shaping, and the general troubles of Reinforcement Learning based approaches. 

A "failure" in the sense of a goal (cube-state to step-by-step instructions), but a wild success when it comes to learning how RL works, the theory, and how the algorithms work. What problems provide more trouble, as well as, how to improve RL systems. If I had to do the project again, I would do some reverse-RL by pre-training a policy on human data to get a good initial policy. This will substantially improve sample efficiency. Overall, it was a great learning experience.

## HAAR Cascades for Rubik's Recognition

Fun little project training a HAAR cascades to recognize Rubik's cubes in video. First little dabbling in classical computer vision. Involved me going out and taking pictures of Rubik's cubes in context (with hands, without hands, varied background). Got about 1,000 pictures of Rubik's cubes. Hand-labeled them all for object detection. Then trained a model with OpenCV 3.2 (the last version that allowed training HAAR cascades). As expected from the get-go, the performance was extremely poor, precision around 28%, with recall around 90%. So lots of false positives (which makes sense, as the Rubik's cube has a high variance in Integral Image features). Main purpose of the project was to compare and contrast the performance of Classical computer vision techniques with Contemporary techniques (at the time, YOLOv1 which required conversion from the Author's DNN framework DarkNet).

Was also the first project I converted into Javascript to showcase to my graduate school cohort to run in-browser. The FPS was around 35 FPS on a 2012 macbook pro, and ran on mobile. YOLOv1 had much better performance; however, was much slower, and required GPU based inference time. 

This project was helpful for building a "background removal" application at Unigroup. They wanted a "remove background" feature for their agents -- as many agents were doing their jobs at home (or in their cars). Unigroup's video stack for the agents to create quotes for the cost of moving a customer's house required a peer-to-peer connection (no server in the middle to facilitate post-processing), and so larger models like MobileNetv2 couldn't run in real-time on CPU hardware (their implementation had 2.5 FPS). I implemented face-detection with highly dampened momentum methods to keep track of agent faces during HAAR-Cascade false negatives. A WebASM multi-threaded port of OpenCV to achieve 60FPS on target hardware. We went with background blurring, and frame differencing to keep the rest of the Unigroup Agent in focus. Also, added watermarks to Agent cameras to show they were "official" agents of whatever localized moving company (Mayflower, United Van Lines, Allegiant Move Management, Move Rescue) they were a part of.

I'm currently going through my files to find the trained Rubik's HAAR cascade to show off. You can still see the momentum methods I implemented to keep "tracking" a cube if it ever got "lost" between frames.

[Deployed HERE!](https://justintienken-harder.github.io/Haar-Cascades/)

## Shiny APP for COVID19 Epidemic

Certainly, dated now. The original project was interested in estimating the SIR (Susceptible, Infectious, Recovered) model parameters, a simplified camparmental differential model used to understand the spread of infectious diseases, focusing on the dynamics of transmission to build a predictive model as the COVID19 epidemic unfolded. Dynamically pulled data from the NYT aggregated reporting to populate the model with data as new cases rolled in. Graphed nation-wide disease growth on an interactive map that allowed users to also look on a state/county level vs a nationwide/state level. The same applied for the SIR model predictions. Pulled in Census data to produce infections per capita information -- providing a "relative" view of how infectious COVID19 was based on how populated a county/state was.

Obviously the map/modeling is very dated, and the assumptions for the SIR model are no longer valid simplifying assumptions (namely, that the recovered population can't return to the Susceptible class).

Some changes if I were to remake the project in the current day:

- Run my own database to host the data.
- Pull data transformations from the client-side to the database side (currently extremely long loading times)
- More robust modeling of infectious diseases, where $R \to S$ is possible.
- Piecewise SIR modeling to showcase the effect that different interventions has on SIR parameters (lowering $S \to I$ conversion rates)
- Automate state vs state
- Better communication on the page about why we are interested in log-changes to infections/deaths, so users can be more informed at different graphing views.
- Include more accurate "first infection" points for SIR modeling in different states.

You can view the [dashboard here.](https://justinharder.shinyapps.io/Covid-19/)