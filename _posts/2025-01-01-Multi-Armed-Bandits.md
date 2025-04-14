---
layout: post
title: "Sequential Statistics and Multi-Armed Bandits"
date: 2025-01-01
categories: ["machine-learning"]
abstract: "History and motivations to the Multi-Armed Bandit problem. Includes lots of simulations and visualizations of how the UCB algorithm works. Touches on the many variations of the MAB problem. Play the slot machine simulation I made!"
---

[Read simplified version](/simplified/Multi-Armed-Bandits/)
## GAME!
Do you want to play the Multi-Armed bandit problem as an actual scenario? Place your bets on real slot machines, and explore how different algorithms perform with various distributions of payouts! Make your own machines, or generate random machines! It's pretty neat.

<h2><a href="https://justintienken-harder.github.io/statistical-slot-machines/"> LINK! </a></h2>

Go to my simulation of the MAB problem today!. 


## Motivations and History

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

This sort of operations research with sequential statistics is what resulted in many of Abraham Wald's early works to get a "restricted" classification in the later years of WW2 manufacturing in America. You can see dissertation of Wald's life and contributions from  Hans Weigl[^Weigl] .

Recall in from your statistics classes that the power of a test (the higher the power, the higher the chance that your test detects a "true" effect, avoiding false negatives). Of the factors effecting the power of a statistical test, the effect size (the magnitude of the difference between the two groups) is important. This is demonstrated by this graph below. 

{% include scripts/bandits/statistical_power.html %}

As you can see, when the population mean (the failure point of a 3D print with ABS vs PVC) is large, we can determine much earlier which material is better. In, fact, we could design the experiment to (with great probability) detect which material is worse if we a priori knew the population means/variance. Select a power level, a confidence size and we can produce a sample size to produce a rejection of the null hypothesis (that the two materials are the same).

In fact, here's a little calculator to do compute what sample size you need to a T-test. Notably, the logic in here is a bit different than the above illustration as the previous chart isn't doing a significance test, just a "do the sample means overlap". A subtle different.

{% include scripts/bandits/power_calculator.html %}

It's important to note, that you can't just run a statistical test at every stage of data collection, as multiple tests will introduce type 1 errors that compound the more you perform a statistical test (as you grow your sample size). This has largely been solved in the modern era, but it's historical implications still stand.

### Enter Regret, and "policies"

Clearly, there is a certain amount of waste (or potential unrealized gain) by performing a simple A/B test without some experimental design in mind. As the statistician got closer to the experiment, the design and goals of minimizing wasted resources makes it's appearance. These goals are crucially important for public health from a medical perspective. Delays in treatments and tests were an exarcerbator for the AIDS epidemic in the United States. While the AIDS epidemic was (to an extent) political, clearly, more efficient statistical methodology would have improved outcomes for getting testing and treatments to patients. 

Pivoting back to Robbins, an article dedicated to spurring further research in the area. He proposes a relatively simple coin toss situation:

> Let $A$ and $B$ denote two statistical populations (coins, urns, manufacturing processes, varieties of seed, treatments, etc.) specified respectively by univariate cumulative distribution functions $F(x)$ and $G(x)$ which are known only to belong to some class $D$. We shall suppose that the expectations
> 
> $$\alpha = \int_{-\infty}^{\infty} x\,dF(x), \quad \beta = \int_{-\infty}^{\infty} x\,dG(x)$$
> 
> exist. How should we draw a sample $x_1, x_2, \ldots, x_n$ from the two populations if our object is to achieve the greatest possible expected value of the sum $S_n = x_1 + \cdots + x_n$?
> 
> For example, let $A$ and $B$ denote two coins of unknown bias, and suppose that we are allowed to make $n$ tosses, with the promise of getting <span>$</span>1 for each head but nothing for tails. If $x_i = 1$ or $0$ according as heads or tails occurs on the $i$-th toss, then $S_n$ denotes the total sum which we are to receive, and $\alpha$ and $\beta$ ($0 \leq \alpha, \beta \leq 1$) are the respective probabilities of obtaining heads on a single toss of coins $A$ and $B$.

He shows that there are methods to get a larger payout on average with his strategy of: 
```
Turn 1: Choose A or B at random
If you recieve a dollar choose that option again
If you recieve 0 dollars, change to the opposite distribution
```

He shows that this strategy of play results in a larger payout on average across all bournolli distributions (heads = 1/tails =0 with some probability $/alpha/$)

#### Regret 

It's therefore useful to define a notion of cumulative Regret, i.e., how much our sequence of choices is worse than just playing the best machine from the start.

Formally, if we have $K$ arms (machines, options, or actions) indexed by $i \in \{1, 2, \ldots, K\}$, and each arm has an expected reward $\mu_i$, then the optimal arm is the one with the highest expected reward:

$$i^* = \arg\max_{i \in \{1,\ldots,K\}} \mu_i$$

Let $\mu^* = \mu_{i^*}$ be the expected reward of this optimal arm. If we play $T$ rounds, and at each round $t$ we choose an arm $I_t$ and receive reward $X_t$, then the expected cumulative regret is defined as:

$$R(T) = T\mu^* - \mathbb{E}\left[\sum_{t=1}^{T} X_t\right]$$

Alternatively, we can express this in terms of the expected number of times each suboptimal arm is played:

$$R(T) = \sum_{i=1}^{K} \mathbb{E}[N_i(T)](\mu^* - \mu_i)$$

where $N_i(T)$ is the number of times arm $i$ is played during the $T$ rounds.

The goal in a multi-armed bandit problem is to develop policies that minimize this regret, balancing exploration (trying different arms to learn their expected rewards) and exploitation (playing arms that are known to have high rewards).

Notably, the cumalitive regret is always positive. It should be clear that minimizing regret, also maximizes your cumulative reward.

This is the reward function that's analyzed to determine the "overall" quality of a function for some set of distributions it's applied to.  We can ask things like "how fast does the optimal policy converge to an asymptotically optimal policy", i.e., how quickly do we start to get good solutions? What about for a particular set of distributions that we sample from? I hope this highlights how complex research in this area can get.

Robbins showed later, that there is a strategy that is asymptotically optimal for an arbitrary set of distributions (Bournoulli, Normal, Exponential, etc) as long as your set of distributions have finite mean. We will not look at that derivation; however, it does set the groundwork for analyzing different strategies asymptotically (as the length of play goes to infinity). &Unrelated, the non-finite variance functions, are really strange. They were originally discovered in the physics of tectonic plates... They have an undefined mean, with an interesting corellary; the sample mean is divergent as we collect more and more samples. Peculiar.

#### The General Problem: A solution

One of the most heavily cited solutions is the "Upper Confidence Bound" approach. The popularity of the algorithm has got the be in the simplicity of it's implementation.

Any sort of adaptive strategy (a policy in the reinforcemnet learning literature) will have have a natural feedback loop:
```
1. Sample our Policy to determine what machine to pull
2. Go to the environment to perform that action
3. Receive reward for that action. 
4. Update our policy with the reward. 
5. Goto step 1
```

The UCB algorithm is a popular approach to balance exploration and exploitation in multi-armed bandit problems. At each time step $t$, UCB selects the arm with the highest upper confidence bound:

$$a_t = \arg\max_{i \in \{1,2,\ldots,K\}} \left[ \hat{\mu}_i(t) + c \sqrt{\frac{\ln (t)}{N_i(t)}} \right]$$

where:
- $a_t$ is the arm selected at time $t$
- $\hat{\mu}_i(t)$ is the empirical mean reward of arm $i$ up to time $t$
- $N_i(t)$ is the number of times arm $i$ has been played up to time $t$
- $c$ is an exploration parameter (typically $c = 2$)
- $K$ is the total number of arms

The UCB formula consists of two parts:
1. **Exploitation term**: $\hat{\mu}_i(t)$ - the current estimate of the arm's expected reward
2. **Exploration bonus**: $c \sqrt{\frac{\ln t}{N_i(t)}}$ - which gets smaller as we play an arm more frequently

This exploration bonus ensures that arms with high uncertainty and potential are tried sufficiently often. The UCB algorithm achieves an (instance dependent) regret bound of $O(\log T)$, which is asymptotically optimal for the multi-armed bandit problem.

Here's a quick little implementation in python with a little trick to compute the cumulative average for a dataset as we move through time.


```{python}
K = num_levers
T = length_of_trial

cumulative_average = lambda last_average, new_value, pulls: \
    last_average + (new_value - last_average)/(pulls)

moving_mean = 0
times_pulled = 0
options = [(cumulative_mean, times_pulled) for lever_number in K]

def pull(machine):
    # Here is where you would get the results from the environment or sample from the distribution.
    return Math.Normal.(1,1)

def UCB(cumulative_mean, times_pulled, time_in_process):
    #Hyperparameter for process C a constant. 2 is common.
    C = 2
    exploration_UCB = C*(Math.log(time_in_process) / times_pulled)^(1/2)
    return cumulative_mean + exploration_UCB


for t in T:
    if t < K:
        reward = pull (k)
        options[t] = (reward, 1)
    else:
        get_UCBs = [UCB(*machine_stats) for machine_stats in options]
        machine_to_pull = argmax(get_UCBs)
        reward = pull(machine_to_pull)
        old_mean, pulls = options[machine_to_pull]
        new_mean = cumulative_average(old_mean, reward, pulls+1)
        options[machine_to_pull] = (new_mean, pulls + 1)

```

There a couple things to notice: 

First, the "exploitation" term is really just the estimated mean from our samples from a machine. The exploration term really defines a "band" around this mean, where with a high degree of certainty, the true mean of the machine is to be found. The $c$ parameter determines how much exploration the algorithm performs. Due to the law of large numbers, the average of results obtained from a large number of independent random samples converges to the true value (if it exists), and so the exploitation term converges to the true mean.

Second, there are two important components of the "exploration" term. First, $\ln(t)$ grows logarithmically, while the number of times we have pulled an arm grows (for simplicity sake), $N_i(t)$ is proportional to $t$ (in fact, it's proportional to the posterior standard deviation, for normal distributions). So the exploration term asymptotically grows $O(\ln(t)/t)$, and it should be clear that the as we let this process run towards infinity, our exploration term converges to 0.

Most of the hard technical work, by Auer, et al[^Auer] in proving the policy's efficiency is showing the $\ln(t)$ term is JUST enough exploration to be optimal. And not just optimal, asymptotically as $\lim_{t \to \infty}$, but is also uniformly optimal.

I've created a visuallization of the algorithm in action for a bernoulli distribution (i.e., an unfair coin flip). There are better choices of the exploration term for this case, but the performance isn't bad.

{% include scripts/bandits/UCB_visualization.html %}

Some things to notice!:

- The more we sample from a distribution, the more the confidence/certainty interval decreases in size. 
- The more we exploit a particular distribution, the more OTHER confidence intervals grow in size
- As time progresses, the intervals
- At the start of the process (try rerunning the simulation a few times), the estimated mean can jump around a lot (and that can move our confidence intervals a lot). 
- If the estimated mean jumps a lot, the growth of other intervals "helps" make sure that we explore other (potentially more lucrative) options.
- By the end of the simulation -- we have a really good estimate of the best options; however, our estimates of less lucrative levers are poorer (due to less samples)


#### How does this compare to an A/B test?

Consider the scenario; a company is trying to determine if a website change results in more makeup sold. A traditional A/B experiment will serve this new website to a subset of viewers. They'll track spend on say, 500 users. Then compute if the new layout results in more sold products on average -- with some statistical garuntees. 

And depending on the p-values chosen, they'll either accept or reject the null hypothesis. When they accept (not enough data to determine different average spend), they might keep using the old layout. If they reject the null hypothesis, and the new layout results in better spend then they run with the new layout.

Short-term, there's the aforementioned issue of wasted resources/profit spent to perform this A/B test if it could have been determined after only, say 100 users. This could be significant money left on the table.

Here's the potential long-term regret (issues/advantages) this A/B test "policy" has.

The statistical test has it's own risks, there are Type 1 (False positive) and Type 2 (False Negative) hypothesis testing errors, i.e., the probabilities of which are determined by the significance level of your test (alpha, say p-value is 0.05), and the power of your test (beta, say 20%, pretty good). 

If everything runs hunky-dory (rejected the null hypothesis) and we've identified the best website layout, there is a 5% chance that our results were due to random chance (that p-value we chose), so whatever choice we run with from now until the end of time will result in less revenue per user. 

If we failed to reject the null hypothesis, then one of the website layouts IS better, and we have potentially worse revenue from now until the end of time.

To summarize in terms of asymptotic regret, when our A/B test correctly identifies the best website layout, we only have asymptotically constant regret (the regret for performing the test). But if our test comes up not-statistically significant or we had a type 1 error, then our regret is asymptotically linear, as in the more we keep using this layout, the more unrealized revenue per user.

#### Worst Case Scenario: Adversarial Bandits

The previous section highlights a key point. That different policies have a "worst case scenario". Worst case, A/B test has linear regret. For the UCB algorithm, this situation occurs when the gap between the means of the best arms are arbitrarily small, and achieves $O(\sqrt{t*\ln(t)})$; yet, when the gaps between the best arm and sub-optimal arms is relatively large, we get only logarithmic regret, the best possible. 

While I won't spend much time talking about it, there is another formulation of the problem where the rewards from the different possible machines are determined by an "adversary" that is trying to minimize our policy's success. For example, it might return rewards from distributions with extremely close expected means for UCB, or rewards are from distributions whose means change over time.

This is the most general "worst" case scenario, and there are algorithms here that are asymptotically optimal, such as the EXP3 algorithm (which you can see in my simulation at the top of the page). You might think; why would I not utilize EXP3 everytime instead of the UCB? These algorithms tend to be... extremely pessemistic about the best possible arm (as the best arm could change). They tend to underperform UCB in (many practical) applications. However, if you have rapid and unpredictable changes in the values of the arms, then EXP3 can cope much better than UCB. 

Situations where this occurs might be: Bots trying to boost clicks on an advertisement, diseases adapting to new treatments (looking at you super-bugs), or users getting bored with the exact same advertisement/content in a recommendation feed. 

#### Other Variations

If the expected value of a machine tends to change over time (examples: time-series data, seasonality, people getting bored with the same products on a page), then you have a non-stationary problems. You can modify UCB with good results by weighting more recent observations in the calculation of the expected mean (called discount factor), or applying a sliding window-approach.

There's also a variation where you want to optimize over, say, the design of a website in terms of components on the page. What menu's to show/hide, settings to have expanded, etc. This is the combinitorial bandit problem that's notably been utilized by Amazon.

There's a setting where the machines aren't pulled, but actions on a machine take continuous values -- such as hyper-parameters during training a machine learning model. This is the infinite-bandit problem.

In practice, there is usually a cast associated with the resource consumed by each action and the total cost is limited by a budget. This is the ["constrained contextual bandit"](https://papers.nips.cc/paper_files/paper/2015/hash/310dcbbf4cce62f762a2aaa148d556bd-Abstract.html)

## Warnings

While UCB is "optimal" in a certain sense, there are certain situations that other statistical methods should really be considered.  If you have way more products than users could possibly interact with (think netflix), recommender systems will perform much better with historical data. 

Consider our website example, and users have to login (and you know what gender the users are). Then if there is any conditional preference between layout A and B with gender than the MAB formulation will perform poorly. Example:

|Layout\Gender|Women 20%|Men 80%|
|A| $100 | $150 |
|B| $300 | $20  |

Then based on the proportion of users of the website, the expected value of layout A is $140 per user, while the expected value of layout B is $76 per user. 

However, it should be apparent that if you give layout B to women, and layout A to men, you will maximize your value. This is analyzed in conditional bandits -- but statistical modeling can take you a long way, while using the UCB will result in serving layout A to almost all users. 

There is research in the conditional Multi-Armed Bandit problem -- and the more things you condition on, the more intractible the problem becomes (curse of dimensionality); however; I've written enough as is.

### Policy minimizing Regret is not the same as optimal stopping

It should be noted that there is a difference between a policy/strategy that asymptotically minimizes regret and an approach that finds the best arm as quickly as possible. The first a statement of it's long-term regret minimization, the other is a statement at how well an algorithm explores options. This is important; as asymptotically, an A/B test can have constant regret (as we collect data, we can go until our confidence of the better option is very strong, then utilize the best option) -- but as we just established, there's better solutions out there.

Optimal stopping is the notion of finding the best lever as fast as possible, and stop pulling levers altogether (as the best option has been found). There are algorithms to accomplish this (at the cost of memory overhead). Such as this one from Pilarski[^pilarski] focusing on Bernulli distributions. Even situations when the reward is delayed (such as distributed systems where users take time to interact).

## END:

The multi-armed bandit problem and it's many variations is an active and engaging area of research. Hopefully, you've had some inspiration where the UCB (or other algorithms) might fit into automated decision making. If you enjoyed reading, please checkout [my little simulator][https://justintienken-harder.github.io/statistical-slot-machines/] where you can play some bandits, and see how you compare to some of the algorithms mentioned in the post! Since the code to my slots are available on my Github, and were shoddily thrown together with the main focus on getting the dynamic elements working, I wouldn't recommend copying my algorithm code raw-dog style.


{% include references/bandits.md %}
