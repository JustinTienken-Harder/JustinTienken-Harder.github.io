---
layout: post
title: "Sequential Statistics and Multi-Armed Bandits"
date: 2025-01-01
categories: ["machine-learning"]
---

# Motivations and History

The multi-armed bandit problem can be hueristically summarized as: You walk into a casino with $N$ machines each with different potential payouts; you only have enough time to play 100 times. How can you maximizes the total sum of your payouts?

Casinos have negative expected value for playing the machines -- so clearly this doesn't motivate the problem; however, it is a compelling narrative for the abstract setup of the problem.

If we return to the paper where the "original" mathematical formulation was proposed by Robbins[^robbins], then we get some historical context of the utilization of statisticians, and why sequential statistics (i.e., statistics computed as our data is acquired). The true motivations of the technique come from material conditions of the era.

> The first important departure from fixed sample size came in
> the field of industrial quality control, with the double sampling in
> spection method of Dodge and Romig. Here there is only one
> population to be sampled, and the question at issue is whether the
> proportion of defectives in a lot exceeds a given level. A preliminary
> sample of $n_1$ objects is drawn from the lot and the number $x$ of defectives
> noted. If $x$ is less than a fixed value a the lot is accepted without
> further sampling, if $x$ is greater than a fixed value $b$ $(a<b)$ the
> lot is rejected without further sampling, but if $a<x<b$ then a second
> sample, of size $w_2$, is drawn, and the decision to accept or reject the
> lot is made on the basis of the number of defectives in the total sample
> of $n_i+n_2$ objects. The total sample size $n$ is thus a random variable
> with two values, $n_1$ and $n_1+n_2$, and the value of $n$ is stochastically
> dependent on the observations. 

### A little (more) history:

Furthermore, Johnson[^Johnson] provides more insight into the development of a statistician's role in the experimental process. He writes: 

> In olden times statisticians expected,and were expected,to try to do their best
> with data obtainedby other people: it was rarely the case that the statistician had
> much influence on how, or how much,data were collected. As a result of growing
> appreciation of the value of statistical advice, it became more and more usual to seek
> this advice before starting to obtain observations.But even so, once the statistician
> had given his advice, he was not usually consulted again until the work had been
> finished and the complete set of required observations obtained. To a certain extent,
> sequential analysis extends the statistician's influence a stage further, and allows for
> consultation with him while the observations are actually being obtained, giving him
> the opportunity, and the duty,ofs uggesting where fresh information should be sought,
> and of deciding when sufficient informationhas been obtained. It is true that a
> major objective of sequential analys is existing at present seems to be that of making
> this intervention automatic; nevertheless, it is not difficult to understand that the
> acceptance of sequential analysis as a tool can facilitate acceptance of live statistical
> intervention while an investigation is in process of completion

As an aside, there's even another variant of sequential statistical testing utilized in times before. Imagine you are trying to determine the optimal mix of fertilizer for your plants. You test one variable for significant results, say potassium amounts to mix into soil. Then we test the next variable (such as nitrogen concentrations). We proceed in this fashion until all your variables have been tested and determine some "optimal" mixture. It's a somewhat rudimentary form of optimization, but was utilized in the 1800s, and still utilized today (see: control variable). We'll circle back on this method as bandit methods become more complex.

Anyway, this sort of sequential statistics is quite natural from a (fischerian) statistician intimately close to the experiments.

Experiments are expensive! Suppose you're testing manufacturing processes on your 3D printer, maybe it's fill patterns, or material changes to build a robust action figure for mass assembly. It's really expensive to just 3D print, say 100 of, the two different figures and put them through the stress tests. Early on into the run (with say, as few as 5 prints of each), we might be able to determine that printing your action figure with ABC plastic results in structural failure, while PVC is more robust.

This sort of operations research with sequential statistics is what resulted in many of Abraham Wald's early works to get a "restricted" classification in the later years of WW2 manufacturing in America. You can see dissertation of Wald's life and contributions from  Hans Weigl [^Weigl] 

Recall in from your statistics classes that the power of a test (the higher the power, the higher the chance that your test detects a "true" effect, avoiding false negatives). Of the factors effecting the power of a statistical test, the effect size (the magnitude of the difference between the two groups) is important. This is demonstrated by this graph below. 

{% include scripts/bandits/statistical_power.html %}

As you can see, when the population mean (the failure point of a 3D print with ABS vs PVC) is large, we can determine much earlier which material is better. In, fact, we could design the experiment to (with great probability) detect which material is worse if we a priori knew the population means/variance. Select a power level, a confidence size and we can produce a sample size to produce a rejection of the null hypothesis (that the two materials are the same).

In fact, here's a little calculator to do compute what sample size you need to a T-test. Notably, the logic in here is a bit different than the above illustration as the previous chart isn't doing a significance test, just a "do the sample means overlap". A subtle different.

{% include scripts/bandits/power_calculator.html %}

It's important to note, that you can't just run a statistical test at every stage of data collection, as multiple tests will introduce type 1 errors that compound the more you perform a statistical test (as you grow your sample size). This has largely been solved in the modern era, but it's historical implications still stand.

### Enter Regret, and "policies"

Clearly, there is a certain amount of waste (or potential unrealized gain) by performing a simple A/B test



{% include references/bandits.md %}
