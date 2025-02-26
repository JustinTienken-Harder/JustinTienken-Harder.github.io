---
layout: default
title: Home
---

# Welcome to My Machine Learning Blog

I'm Justin Harder, a machine learning engineer and enthusiast. This blog is dedicated to my thoughts, experiments, and insights on machine learning, computer vision, and large language models.

## Recent Posts

{% for post in site.posts limit:5 %}
- [{{ post.title }}]({{ post.url }}) - {{ post.date | date: "%B %d, %Y" }}
{% endfor %}