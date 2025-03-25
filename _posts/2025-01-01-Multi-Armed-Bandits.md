---
layout: post
title: "Sequential Statistics and Multi-Armed Bandits"
date: 2025-01-01
categories: ["machine-learning"]
---

# Motivations and History

The multi-armed bandit problem can be hueristically summarized as: You walk into a casino with $N$ machines each with different potential payouts; you only have enough time to play 100 times. How can you maximizes the total sum of your payouts?

Casinos have negative expected value for playing the machines -- so clearly this doesn't motivate the problem; however, the visualization is quite clear.

If we return to the "original" mathematical formulation by Robbins[^robbins], before the term "multi-armed bandit" was coined, we get some historical context of the utilization of statisticians, and why sequential statistics (i.e., statistics computed as our data is acquired). 

### A little history:

Statisticians, in the industrial era, were contractors -- a lot like personal accountants in the modern era -- that were hired after experiments were already completed. A statistician was lucky - and expected - for others to collect the data from an experiment then perform an analysis once the experiment was completed. As time pushed forward, statisticians were consulted before experiments were conducted for design, and consulted again upon completion. 

Experiments are expensive! Recall in from your statistics classes that the power of a test (the higher the power, the higher the chance that your test detects a "true" effect, avoiding false negatives). Of the factors effecting the power of a statistical test, the effect size (the magnitude of the difference between the two groups) is important. This is demonstrated by this graph below. 

{% include scripts/bandits/statistical_power.html %}

As you can see 


{% include references/bandits.md %}
