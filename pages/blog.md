---
layout: page
title: Blog Posts
permalink: /pages/blog/
---


{% for post in site.posts %}
## [{{ post.title }}]({{ site.baseurl }}{{ post.url }})

<time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %d, %Y" }}</time>
{% if post.abstract %}
### Abstract:
<div style="margin-left: 20px; margin-bottom: 15px; color: #555; font-size: 0.9em;">
{{ post.abstract }}
</div>
{% endif %}
{{ post.excerpt }}

[Read more]({{ site.baseurl }}{{ post.url }})

---
{% endfor %}

{% if site.posts.size == 0 %}
No posts yet! Check back soon.
{% endif %}