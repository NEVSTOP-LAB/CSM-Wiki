---
layout: page
title: Home
id: home
permalink: /
---

# 欢迎！🌱

<p style="padding: 3em 1em; background: #f5f7ff; border-radius: 4px;">
  看看 <span style="font-weight: bold">[[你的第一篇笔记]]</span> 开始你的探索之旅吧。
</p>

这个数字花园模板是免费的、开源的，并且[可以在 GitHub 上找到](https://github.com/maximevaillancourt/digital-garden-jekyll-template)。

最简单的入门方法是阅读这个[逐步指南，解释如何从头开始设置](https://maximevaillancourt.com/blog/setting-up-your-own-digital-garden-with-jekyll)。

<strong>最近更新的笔记</strong>

<ul>
  {% assign recent_notes = site.notes | sort: "last_modified_at_timestamp" | reverse %}
  {% for note in recent_notes limit: 5 %}
    <li>
      {{ note.last_modified_at | date: "%Y-%m-%d" }} — <a class="internal-link" href="{{ site.baseurl }}{{ note.url }}">{{ note.title }}</a>
    </li>
  {% endfor %}
</ul>

<style>
  .wrapper {
    max-width: 46em;
  }
</style>
