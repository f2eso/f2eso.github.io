---
title: 生成 Excel 工作表列标题
description:
tags:
  - algorithm
  - leetcode
date: 2020-11-02 11:07:46 +0800
---

完成一个转换函数，将数字转成对应的大写字母，满足下面的对应关系：

{% highlight text %}
1 => A
2 => B
3 => C
...
26 => Z
27 => AA
28 => AB
29 => AC
...
52 => AZ
53 => BA
54 => BB
...
{% endhighlight %}


## 回答

### 循环方式

用循环实现：

{% highlight js %}
function convert(num) {
  const result = [];

  let divided;

  do {
    const dividedNum = divided ? divided[0] : num;

    divided = isNaN(dividedNum) || dividedNum < 1 ? [-1, -1] : [~~(dividedNum / 26), dividedNum % 26];

    if (divided[1] === 0) {
      divided = [divided[0] - 1, 26];
    }

    if (divided[0] !== -1) {
      result.unshift(String.fromCharCode('A'.charCodeAt(0) - 1 + divided[1]));
    }
  } while (divided[0] / 26 > 0);

  return result.join('');
}
{% endhighlight %}

### 递归方式

用递归实现：

{% highlight js %}
function convert(num) {
  return num <= 26 ? String.fromCharCode('A'.charCodeAt(0) - 1 + num) : convert(~~((num - 1) / 26)) + convert(num % 26 || 26);
}
{% endhighlight %}


## 讲解

从描述中初步分析可以知道，需要做的事情大体为两步：将给定数字按照一定规则转换为大写字母；拼接转换后的大写字母为一个完整的字符串。

从「1」开始最初的连续 26 个整数与大写字母之间的对应关系很明确，让人觉得这是一道普通的十进制转二十六进制或二十七进制的进制转换题。然而，进一步观察就会发现，这里缺少了对于「0」的相关描述，所以在进位时肯定要做点特殊处理。

将数字转为大写字母，最直觉的方式，就是使用字符串数组：

{% highlight js %}
const LETTER_ARR = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G',
  'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z'
];

function getLetterByNum(num) {
  return LETTER_ARR[num - 1];
}
{% endhighlight %}

在 JS 中通过 `String.prototype.charCodeAt()` 方法能够获取到字符所对应的 Unicode 的编码单元，并且 26 个大写字母是连续的，所以可以改造为：

{% highlight js %}
function getLetterByNum(num) {
  return String.fromCharCode('A'.charCodeAt(0) - 1 + num);
}
{% endhighlight %}

在做进制转换时，需要在源和目标之间不断地进行求商和余数。结合上面的转换代码，用循环实现为：

{% highlight js %}
function convert(num) {
  const result = [];

  let divided;

  do {
    const dividedNum = divided ? divided[0] : num;

    // 将数字处理成 `[商, 余数]` 的格式
    divided = isNaN(dividedNum) || dividedNum < 1 ? [-1, -1] : [Math.floor(dividedNum / 26), dividedNum % 26];

    // 进位的特殊处理
    if (divided[1] === 0) {
      divided = [divided[0] - 1, 26];
    }

    if (divided[0] !== -1) {
      result.unshift(String.fromCharCode('A'.charCodeAt(0) - 1 + divided[1]));
    }
  } while (divided[0] / 26 > 0);

  return result.join('');
}
{% endhighlight %}

其中，`Math.floor(dividedNum / 26)` 可以用 `~~(dividedNum / 26)` 替代，用递归实现为：

{% highlight js %}
function convert(num) {
  return num <= 26 ? String.fromCharCode('A'.charCodeAt(0) - 1 + num) : convert(~~((num - 1) / 26)) + convert(num % 26 || 26);
}
{% endhighlight %}
