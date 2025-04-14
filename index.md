---
layout: default
title: Home
---

# Welcome to My Machine Learning Blog

I'm Justin Harder, a machine learning engineer and enthusiast. This blog is dedicated to my thoughts, experiments, and insights on machine learning, computer vision, and large language models.

## Recent Posts

{% for post in site.posts limit:5 %}
- [{{ post.title }}]({{ site.baseurl }}{{ post.url }}) - {{ post.date | date: "%B %d, %Y" }}
  {% if post.abstract %}
  <div style="margin-left: 20px; margin-bottom: 15px; color: #555; font-size: 0.9em;">
    {{ post.abstract }}
  </div>
  {% endif %}
{% endfor %}