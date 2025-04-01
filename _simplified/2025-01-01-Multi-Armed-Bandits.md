---
layout: post
title: "Understanding Multi-Armed Bandits: A Simple Guide"
date: 2025-01-01
original_post: 2025-01-01-Multi-Armed-Bandits.md
simplified: true
---
This is a simplified version of: [Multi-Armed-Bandits](/posts/Multi-Armed-Bandits/)


# Play My Slot Machine Game!

Want to try your hand at something fun? I've created a game where you can play virtual slot machines and see how different strategies work! It's a great way to understand an important concept called the "Multi-Armed Bandit" problem.

<h2><a href="https://justintienken-harder.github.io/statistical-slot-machines/"> Click here to play! </a></h2>

# What Are Multi-Armed Bandits?

Imagine walking into a casino with 5 different slot machines. Each machine has its own secret pattern of payouts - some give you more wins than others, but you don't know which ones ahead of time.

You only have enough time to play 100 times total. How do you figure out which machines pay the best while also winning as much money as possible?

This is the "multi-armed bandit" problem (the name comes from "one-armed bandits," an old nickname for slot machines).

## The History Behind the Idea

This problem wasn't actually created for gambling! It has a fascinating history that goes back to serious problems in manufacturing and healthcare.

In the 1940s, statistician Herbert Robbins was looking at how to test manufacturing processes more efficiently. During World War II, statisticians like Abraham Wald were trying to figure out how to test military equipment without wasting resources.

As one researcher from that era explained:

> In olden times statisticians expected, and were expected, to try to do their best with data obtained by other people: it was rarely the case that the statistician had much influence on how, or how much, data were collected.

But as time went on, statisticians realized they could be more helpful by getting involved during the testing process itself, not just at the beginning and end. This led to the development of "sequential statistics" - methods that help you make decisions as you collect data, rather than waiting until the end.

## The Big Challenge

Here's the tricky part: you face a dilemma called "exploration vs. exploitation":

- **Exploration**: Trying different machines to learn which ones pay better
- **Exploitation**: Sticking with the machine you think is best to maximize winnings

If you spend too much time exploring (trying every machine equally), you might waste many pulls on bad machines. But if you exploit too early (picking one machine and sticking with it), you might miss out on finding the best machine.

# Why This Matters in Real Life

This isn't just about casinos! This same problem appears in many important situations:

- **Websites testing new designs**: Should they show more users the new design or stick with what works?
- **Doctors testing treatments**: How many patients should receive each treatment to quickly find the most effective one?
- **Online advertisers**: Which ads should they show to get the most clicks?

In all these cases, there's a cost to testing too many options, but also a cost to sticking with a suboptimal choice too early.

## How Statistical Power Affects Testing

When researchers test treatments or products, they need to know how many tests to run. This depends on how different the options really are. The visualization below shows this concept:

{% include scripts/bandits/statistical_power.html %}

Notice how the curves separate more when the difference between the two options is larger. This means:
- When two options are very different (like one treatment is much better than another), you can figure it out with fewer tests
- When options are similar, you need many more tests to be confident about which is better

You can even calculate exactly how many tests you would need using this calculator:

{% include scripts/bandits/power_calculator.html %}

# A Simple Solution: The UCB Strategy

One clever approach is called "Upper Confidence Bound" (UCB). Here's how it works in simple terms:

1. Try each machine at least once to get started
2. For each machine, track:
   - How much it pays on average
   - How many times you've played it

3. Then, for your next play, choose the machine with the highest score based on this formula:
   - The machine's average payout
   - PLUS an "exploration bonus" for machines you haven't tried much

The less you've played a machine, the bigger its exploration bonus. This means machines you haven't tried much get extra chances, but as you play them more, you rely more on their actual performance.

## See UCB in Action!

This visualization shows exactly how the UCB algorithm works with slot machines. The blue bars show how confident we are about each machine's true payout rate:

{% include scripts/bandits/UCB_visualization.html %}

When you watch this visualization, notice:
- Machines we play more often have shorter blue bars (we're more certain about their payouts)
- Machines we haven't played much have longer blue bars (we're less certain)
- Over time, the algorithm focuses more on the better machines
- But it still occasionally tries machines it hasn't played in a while

Try rerunning the simulation a few times to see how the strategy adapts to different situations!

## The Magic of UCB

What makes this approach so smart is that:

- In the beginning, it encourages trying all machines
- Over time, it naturally shifts toward playing the best machines more often
- It never completely abandons any machine (just in case one turns out better than expected)
- As you play more, it gets better and better at identifying the best machines

# How This Compares to Traditional Testing

A common approach to testing is the "A/B test" - try option A and option B equally, collect data, then pick the winner and stick with it forever.

The problem? If B is much better than A, you waste a lot of tries on A. And if you make the wrong choice at the end, you're stuck with it.

Robbins, one of the early researchers in this field, proposed a simple strategy for two options (like two coins):
```
Turn 1: Choose A or B at random
If you receive a win, choose that option again
If you receive a loss, change to the opposite option
```

He showed that this simple strategy results in higher winnings on average than just splitting your tests evenly!

# Try It Yourself!

This is why I created my simulation game - so you can see these concepts in action! You can:

- Play different slot machines yourself and develop your own strategy
- Watch how different automatic strategies (like UCB) perform
- Create your own machines with different payout patterns
- Compare your human intuition against mathematical strategies

When you play, notice how the computer strategies balance trying new machines versus sticking with good ones. Sometimes they might seem to make odd choices, but in the long run, they often outperform purely human judgment!

# When This Approach Works Best

The UCB approach works great when:
- All players/customers/patients are similar
- The "best" option doesn't change over time
- You have enough time to learn and adapt

But there are situations where other approaches work better:

- If men prefer option A and women prefer option B, treating everyone the same isn't optimal
- If people get bored of the same option over time, the "best" choice might change
- If you have thousands of options (like Netflix recommendations), you need more sophisticated approaches

# Conclusion

The multi-armed bandit problem shows us that sometimes the smartest approach isn't to find the "right answer" as quickly as possible, but to continuously learn and adjust as new information comes in.

As one historical researcher put it:

> Sequential analysis extends the statistician's influence a stage further, and allows for consultation with him while the observations are actually being obtained, giving him the opportunity, and the duty, of suggesting where fresh information should be sought, and of deciding when sufficient information has been obtained.

I hope you enjoy playing with my slot machine simulator! It's a fun way to experience these concepts firsthand and see how different strategies perform in action.

[Try the slot machine simulator here!](https://justintienken-harder.github.io/statistical-slot-machines/)
