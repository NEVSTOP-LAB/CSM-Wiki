---
title: Communicable State Machine(CSM) Framework
layout: home
lang: en
permalink: /
---

[![Image](https://www.vipm.io/package/nevstop_lib_communicable_state_machine/badge.svg?metric=installs)](https://www.vipm.io/package/nevstop_lib_communicable_state_machine/)
[![Image](https://www.vipm.io/package/nevstop_lib_communicable_state_machine/badge.svg?metric=stars)](https://www.vipm.io/package/nevstop_lib_communicable_state_machine/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![GitHub all releases](https://img.shields.io/github/downloads/NEVSTOP-LAB/Communicable-State-Machine/total)](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/releases)
[![Build_VIPM_Library](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/actions/workflows/Build_VIPM_Library.yml/badge.svg?branch=main)](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/actions/workflows/Build_VIPM_Library.yml)
[![Check_Broken_VIs](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/actions/workflows/Check_Broken_VIs.yml/badge.svg?branch=main)](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/actions/workflows/Check_Broken_VIs.yml)

## Brief of Communicable State Machine(CSM)

Communicable State Machine(CSM) is a LabVIEW application framework that builds upon JKI State Machine(JKISM). It follows the pattern of JKISM and extends the keywords to describe message communication between modules, including concepts such as Sync-Message, Async-Message, Subscription/Unsubscription of status - essential elements for creating reusable code modules. For more information, please visit the CSM wiki: <https://nevstop-lab.github.io/CSM-Wiki/>

- For instructions on JKI State Machine(JKISM), visit: <http://jki.net/state-machine/>
- For information on Communicable State Machine(CSM), visit: <https://github.com/NEVSTOP-LAB>

![CSM Async Call](https://nevstop-lab.github.io/CSM-Wiki/assets/img/Homepage%20Image.png)

> 📓
> For more details, read the technical details section of the wiki.
>

## Features at a glance

- :anchor: Completely inherits the characteristics of JKISM, including extensibility, string-formatted messages, and state machines mechanism
- :anchor: Decouples modules through message communication, supporting both synchronous and asynchronous messages as well as state subscription/unsubscription
- :anchor: Both synchronous and asynchronous messages support responses and handle errors that occur during execution
- :anchor: CSM Modules actually are VIs, which can be called as sub-VIs
- :anchor: CSM Modules can be used not only within the CSM framework but also in non-CSM frameworks
- :anchor: Use plug-ins to enhance parameter passing capabilities beyond just carrying string data, which is a limitation of JKISM
- :anchor: Built-in Error Handling mechanism
- :anchor: Built-in worker mode for concurrency task implementation
- :anchor: Built-in responsibility of chain mode support
- :anchor: Debugging tools

>
> 📓 Note: There are numerous CSM debugging tools currently in development, so please stay tuned.
>

## Download

CSM is released as a VIPM Library, which you can download in the following ways:

- 🥇 **Recommended: Search for CSM through the VIPM and install**

<img src="assets/img/VIPM%20Search%20CSM.png" alt="vipm-search-csm" width="60%">

- **Download the package(.vip file) of CSM and click install**

  - Download the latest release of CSM from <https://www.vipm.io/> and click install:<br/>
    <https://www.vipm.io/package/nevstop_lib_communicable_state_machine/>
  - Download the latest release of CSM from GitHub and click install:<br/>
    <https://github.com/NEVSTOP-LAB/Communicable-State-Machine/releases>

> 📓
> For more information, please refer to the page [download](https://nevstop-lab.github.io/CSM-Wiki/release-of-csm).
>

## License

This work is open sourced under the Apache License, Version 2.0. You can find the details of the Apache 2.0 open source agreement in the [LICENSE](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/blob/main/LICENSE).

_**The following open source projects or services are used in this wiki website**:_

- [visual-studio-code](https://code.visualstudio.com/) as an editor
- [copilot](https://copilot.github.com/) as a hinting tool and to supplement some content
- [markdownlint](https://github.com/markdownlint/markdownlint) for syntax checking of markdown files
- [GitHub Pages](https://pages.github.com/) as a service for publishing pages
- [Jekyll](https://jekyllrb.com/) as a static website generator
- [sighingnow/jekyll-gitbook](https://github.com/sighingnow/jekyll-gitbook) as a theme
- [untra/polyglot](https://github.com/untra/polyglot), a Jekyll plugin for multilingual support
- [gildesmarais/jekyll-loading-lazy](https://github.com/gildesmarais/jekyll-loading-lazy), a Jekyll plugin for lazy load support
