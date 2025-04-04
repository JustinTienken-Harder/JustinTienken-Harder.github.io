---
layout: post
title: "Overcoming Insufficient Data"
date: 2025-01-01
categories: ["machine-learning"]
---

# The Common Problem:

You have some machine learning project, professional or hobbyist, and the data you have either isn't enough, or isn't sufficient to accomplish your goals. This is an all too frequent issue, as the quality of much data is aweful, insufficient, or otherwise unlabeled. Overcoming these challenges is far more common than most would like to admit. The focus in this post are particularly on language modeling and computer vision based issues.

## The situations:

Here are some situations you can find yourself in, and your creativity is the limit for potential solutions. Hopefully, I can cover some novel techniques to get past the threshold to turn your project from intractable to achievable.

1. Lack of data
2. Unlabeled Data
3. Quality of Data
4. Not enough Labelled data
5. Hard Problem
6. Problem is multi-faceted
7. Resource constraints

We'll take a look at solutions that can be broadly applied to most problems in the domain.

## Scrape

If you don't have data, or don't have enough data. You should scrape. There are forums for all sorts of domain specific things, products, ideas, concepts, fandoms. Need tens of thousands of unlabeled pokemon cards? What about real and fake pokemon cards? There are entire communities dedicated to these things. Build your scrapers, and let them rip. When you're not working, your scraper is. Do you need a way to quantify the severity level of security vulnerabilities that your automated security software finds? Scrape the entirety of hacker-one security report, reverse-engineer their GraphQL api to make the direct calls that populate the publically accessible pages which include CVSS security scores. You might not have the data, but other people do. 

Be smart about it. Be targeted. The data should ideally label itself.

Don't try and access non-public data; that's illegal. If your concern is how unlabeled it is, sometimes comments, tags, and file names can provide more than half-decent labels for your information. Or utilize one of the other techniques to bootstrap from 0 to hero. 

Dynamic pages are the most pain to utilize, but it's feasible to utilize browser-based simulation packages to scrape data. For example, HackerOne is a very dynamic website, but fortunately the URLs of security vulnerabilities are essentially sequentially enumerated. Utilizing a package like playwright allows you to simulate user interaction (clicking on certain elements that you might need; such as, "show more" or "see comments"), and you can wait for the DOM elements to load before getting the entire rendered page.

Sometimes you'll run into rate limits (return codes of, you're going too fast). It's best to think about them in advance, or just bake in a "rate limit" optimizer into your scraping algorithm. Here's a simple binary search optimizer, that finds your rate limit mad quick... well the vizualization for one.

{% include scripts/image_aug/optimizer.html %}

Learn to scrape everything and you might just be the next OpenAI.

## Augment

Augment. Think outside the standard TorchVision/Albumentations libraries, make 'em yourself if you have to. 

Do you only have one picture of your thing? If you swap your RGB channels you got 6 more examples. Switch to LAB space, then rotate your color channels, and you got 180*6 more examples. Ever erode/dialate/open/close/morphological gradient/top-hat/black-hat the lumosity channels of your image? What about CLAHE your image? Gaussian blur it? Sharpen? Poissoin noise, hell, set the JPG compression to somewhere between 35-100. You've got close to infinite instances of your one image. The risk is that you can overfit to this one instance of your image -- the value of a larger dataset is the variety of textures, backgrounds, angles and overall numerosity of the thing. But augmentation can take your 100 instance dataset to something more. Cut it out, affine transform your thing, then paste it on new backgrounds -- this technique is as old as HAAR cascades, and largely forgotten in the deep learning, humongo dataset era.

It will make your models more robust.

It will stretch your data to new limits. 

I once had a problem where I needed to remove glare from pokemon cards so that we could identify them and find damage on the cards. Is there a "glare" dataset? Nah. What about a premade data augmentation from albumentations/torchvision? Have you seen the glare that they have? No offense to the creators, it's probably highly performant, but holy does the glare look aweful.

(See example images).

So I rolled my own data augmentation to perform unsupervised learning for glare removal (or poor quality image, take a new one). I've coded it up in javascript, as the quality of the glare was just soooo great. One of the issues of glare is that you can easily oversaturate areas of an image. But because of how high-quality cameras and post-processing is, the rest of the image can still be quite color balanced. It's essentially a multivariate gaussian with random mean and covariance matrix, this is then convolved with random poisson noise that's mean subtracted to get the "texture" that can appear with glare on the slightly textured surface of a card. I loved this augmentation so much, I coded it up in javascript so you can check it out for yourself.

{% include scripts/image_aug/white_spot.html %}

## Weakly-Supervised Learning

This is probably one of the strongest techniques to bootstrap your models from nothing to something. Ideally in a supervised setting, your entire dataset has clean labels. You proceed with splitting your data, training your models sufficiently, choosing a good model from your train/test curves, stress test it on your validation set, and move your model to deployment. 

But, if you're lacking enough labelled data to get a performant model (as in, you can overfit to training data, but have mediocre test performance). Weakly-Supervised learning can bootstrap your model to next levels. 

The setup is simple. You first train the first model $M_1$ on your entire dataset (5-split cross validation can get you further), and now utilize this model to label more of your unlabeled data. Use these new labels to train a better model. Repeat again and again until deminishing returns. Filtering your newly-labelled data is super useful trick. There are many choices for filtering, and it's relatively extensively explored in the literature. But each problem has better performance between various options, it's worth trying multiple if resources allow.

- Only keep best confidence scored labels.

This is the "quality over quantity" mindset -- however, there's no garuntees that a high-confidence score is an accurate score. Deep neural networks are notorious for their overconfidence in predictions. (One way around this is to leave dropout on your network, and pass the same data through multiple times to produce "certainty" intervals around predictions -- it turns out that a DNN with dropout approximates a gaussian process when dropout is left on). Set a threshold and toss data that your model is not confident on. This can work pretty well on various domains. You can even set thresholds based on IOU scores on test data to determine what confidence scores has accurate bounding boxes. 

- Keep it all.

This is the "quantity over quality" mindset. This frequently just works, as much as you think it shouldn't. Modern deep-learning techniques can frequently outperform human-labels. This is especially true in computer vision techniques. 

- Drop your worst classes.

Very peculiar, rareish scenario. Sometimes your model will under-perform so much on some classes, that actually dropping those classes in the self-labelled set can improve performance on those poor classes. This is frequently due to mislabeling as something else. You'll probably want to oversample instances with these hard examples.

## Add irrelevant data

This may seem peculiar, but having a mixin-dataset for the same task can improve your model performance (especially if training from scratch). Need to detect new object classes? Keep the old classifier head, and make a new one for your current task. Mix in another well-established object detection data into your data loader, and you'll get increased performance on your task. It's sort of magical. 

Furthermore, if you don't have any negative instances (as in, there is always an object to detect in your data), then adding images of backgrounds will improve detection performance. There's a degree that object detectors are super-greedy. It'll reduce false-positives. It's always worth on classification tasks to include negetave examples with a "nothing" class for largely the same reasons. 

## Utilize Pre-Trained Models

It's always worth the time and effort to transfer learn. Almost to the point to train your own architecture on a different much larger dataset, then transfer learn (or "fine-tune") on the dataset that you're actually interested in. The learned internal representation of images (as in the features in the convolutions) on a different dataset transfer to new data super well. The same is true for LLMs. 

Don't underestimate pretrained models for data-labelling purposes. It's never been easier to transform an object detection dataset into a semantic segmentation dataset with the utility of the Segment Anything model. I highly recommend utilizing this model for data-labelling purposes. For limited contexts (such as dice on a table), the Segment anything model can bypass even building your own dice segmenter.

The introduction of pretrained vision-language models marks a new era for labelling data. The quality is still not up to snuff compared to 5 year old object detectors. However, for quickly labelling data, it can't be beat. Combined with segment anything, it's never been easier to isolate indiscriminate objects from an image, then get a language model to label what that thing is. 

The quality of the labels won't be the best; however, if you have enough unlabeled data, and training on this data doesn't get good performance, it's worth filtering the labels. 

A simple program that goes through your images+labels, flashes the label on the screen with a simple "left control is accept, right control is reject" you can get through thousands of images in an hour -- well on your way to bootstrapping to weakly supervision, and finally, greatness.

