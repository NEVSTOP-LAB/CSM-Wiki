---
title: Communicable State Machine(CSM)
permalink: /
layout: home
lang: en
---

[![Image](https://www.vipm.io/package/nevstop_lib_communicable_state_machine/badge.svg?metric=installs)](https://www.vipm.io/package/nevstop_lib_communicable_state_machine/)
[![Image](https://www.vipm.io/package/nevstop_lib_communicable_state_machine/badge.svg?metric=stars)](https://www.vipm.io/package/nevstop_lib_communicable_state_machine/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![GitHub all releases](https://img.shields.io/github/downloads/NEVSTOP-LAB/Communicable-State-Machine/total)](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/releases)

Communicable State Machine(CSM) is a LabVIEW application framework that builds upon JKI State Machine(JKISM). It follows the pattern of JKISM and extends the keywords to describe message communication between modules, including concepts such as Sync-Message, Async-Message, Subscription/Unsubscription of status - essential elements for creating reusable code modules. For more information, please visit the CSM wiki: https://github.com/NEVSTOP-LAB/Communicable-State-Machine/wiki

- For instructions on JKI State Machine(JKISM), visit: [http://jki.net/state-machine/](http://jki.net/state-machine/)
- For information on Communicable State Machine(CSM), visit: [https://github.com/NEVSTOP-LAB](https://github.com/NEVSTOP-LAB)

**CSM Templates**

![image](assets/img/CSM%20Without%20Event%20Structure%20Template.png)

<!-- Template Description:
[English](src/help/NEVSTOP/Communicable%20State%20Machine(CSM)/Template%20Description(EN).md) | [中文](src/help/NEVSTOP/Communicable%20State%20Machine(CSM)/Template%20Description(CN).md) -->

**CSM API**

![image](assets/img/CSM%20Palette.png)

<!-- API Description:
[English](src/help/NEVSTOP/Communicable%20State%20Machine(CSM)/VI%20Description(EN).md) | [中文](src/help/NEVSTOP/Communicable%20State%20Machine(CSM)/VI%20Description(CN).md) -->

{% for lang in site.languages %}
    {% assign lang_name = site.data[lang].l10n.lang_name %}
    {% if lang == site.active_lang %}
{{ lang_name }}
    {% else %}
        {% if lang == site.default_lang %}
<a href=" {{ page.url }}">{{ lang_name }}</a>
        {% else %}
<a href="/{{ lang }}{{ page.url }}">{{ lang_name }}</a>
        {% endif %}
    {% endif %}
{% endfor %}