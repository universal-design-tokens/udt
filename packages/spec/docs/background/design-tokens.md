# Design tokens
>Design tokens are indivisible pieces of a design system such as colors, spacing, typography scale.
>
>Design tokens were created by [Salesforce](https://www.lightningdesignsystem.com/design-tokens/), and the name comes from [Jina](https://www.sushiandrobots.com/).
>
>_from the [Design Tokens Working Group README](https://github.com/design-tokens/working-group)_

While the underlying data of a design token is typically represented as key-value pair in code, it is important to understand that there is a bigger picture. As Jina once said:

>Design Tokens are a methodology. IMHO, saying “design tokens are just variables” is like saying “responsive design is just media queries”. It’s a technology-agnostic architecture and process for scaling design across multiple platforms and devices, including native, and more.
>
>_[@jina on 14. November 2018](https://twitter.com/jina/status/1062808011301965825)_

Identifiying and distilling the common visual design attributes, allows them to be expressed in a platform-agnostic way. Tools like [Theo](https://github.com/salesforce-ux/theo) and [Style Dictionary](https://amzn.github.io/style-dictionary/) exist, which can convert a centrally maintained set of design tokens into a variety of output formats (e.g. SASS variables, iOS Swift code, JavaScript constants, etc.). This allows design system teams to have a "single source of truth" for this information and maintain consistency across a variety of platforms.

## Options and decision design tokens
In his "[Tokens in Design Systems](https://medium.com/eightshapes-llc/tokens-in-design-systems-25dd82d58421)" article, Nathan Curtis distinguishes between "options", which are essentially the available values, and "decisions", which are the options applied to a particular context. For example, all of a company's brand colors might be considered _option_ tokens. A _decision_ token then, is one that expresses the choice to apply a particular color from that palette to some part of a UI - e.g. a button background color.

Both Theo and StyleDictionary support "aliases", which allow one token to reference the value of another. So, you can model "option" tokens as design tokens with an explicit value and "decision" tokens as ones that are aliases for one of the options.

## Organising design tokens
Design tokens are usually organsed into groups or taxonomies. For instance, Style Dictionary's documentation recommends organising tokens by ["Category / Type / Item" (CTI)](https://amzn.github.io/style-dictionary/#/properties?id=category-type-item). However, the exact set of categories, groups, etc. and how they are named will generally differ from one design system to another. Naming is hard!

## Further reading

* "[Design Tokens for Dummies](https://uxdesign.cc/design-tokens-for-dummies-8acebf010d71)" by Louis Chenais
* "[Awesome Design Tokens](https://github.com/sturobson/Awesome-Design-Tokens)" by Stu Robson
* "[What Are Design Tokens](https://github.com/sturobson/Awesome-Design-Tokens)" by Robin Rendle
