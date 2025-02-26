---
layout: page
title: Blog Posts
permalink: /pages/blog/
---

# Blog Posts

{% for post in site.posts %}
## [{{ post.title }}]({{ site.baseurl }}{{ post.url }})

<time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %d, %Y" }}</time>

{{ post.excerpt }}

[Read more]({{ site.baseurl }}{{ post.url }})

---
{% endfor %}

{% if site.posts.size == 0 %}
No posts yet! Check back soon.
{% endif %}