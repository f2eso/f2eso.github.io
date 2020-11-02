---
title: 贡献指南
banner:
  url: pages/help/contribution/banner
  description: Contribution
image: pages/help/contribution/banner
---

<blockquote>
  <p>人人为我，我为人人。</p>
  <footer><cite><a href="https://zh.wikipedia.org/wiki/%E6%88%91%E7%82%BA%E4%BA%BA%E4%BA%BA%EF%BC%8C%E4%BA%BA%E4%BA%BA%E7%82%BA%E6%88%91" target="_blank" rel="external nofollow">维基百科</a></cite></footer>
</blockquote>

我们的成长在一定程度上受益于他人的经验总结与分享，因而在此倡议大家积极参与本站的建设以帮助到更多的人！

下面说下需要提升与完善的地方——

## 面试题库
{:#interview}

本站的面试题相关数据来自开源项目「[Interview Hacker](https://github.com/f2eso/interview){:target="_blank"}{:rel="external nofollow"}」，它是一个基于 [YAML](https://yaml.org/){:target="_blank"}{:rel="external nofollow"} 和 [Markdown](https://daringfireball.net/projects/markdown/){:target="_blank"}{:rel="external nofollow"} 的开放式数据库。

所有的面试题都存放在 GitHub [仓库](https://github.com/f2eso/interview){:target="_blank"}{:rel="external nofollow"}的 [`data/questions`](https://github.com/f2eso/interview/tree/master/data/questions){:target="_blank"}{:rel="external nofollow"} 目录下。此目录下的文件夹为面试题所归属的「[主题](/interview/subjects/)」，它们分别为：

<table class="table table-bordered">
  <thead>
    <tr>
      <th>文件夹</th>
      <th>主题</th>
      <th>描述</th>
    </tr>
  </thead>
  <tbody>
    {% for subject in site.data.interview.subjects %}
      <tr>
        <td><code>{{ subject[0] }}</code></td>
        <td><a href="/interview/subjects/{{ subject[0] }}/">{{ subject[1].title }}</a></td>
        <td>{{ subject[1].description | default: "-" }}</td>
      </tr>
    {% endfor %}
  </tbody>
</table>

每个主题目录下的文件夹是面试题，再往下则是某个面试题相关的数据文件。因此，一个面试题的数据文件路径是 `data/questions/{主题}/{面试题}/{数据文件}`。

主题和面试题的文件夹名字要尽可能简短，且尽量不是句子，更不能是问句；面试题相关数据文件的命名方式与作用如下：

| 文件 | 作用 | 必需 |
| --- | --- | --- |
| `metadata.yml` | 问题标题等元数据 | 是 |
| `readme.md` | 问题描述 | 是 |
| `answer.md` | 问题回答 | 否 |
| `explain.md` | 问题讲解 | 否 |
{:.table.table-bordered}

在严格遵守上述内容的前提下，可以通过提 [PR](https://github.com/f2eso/interview/pulls){:target="_blank"}{:rel="external nofollow"} 新建或修改一个主题、面试题及其相关的数据文件。
