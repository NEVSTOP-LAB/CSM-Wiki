---
title: Basic 2.Use CSM as application framework
author: nevstop
date: 2023-12-28
category: Basic
layout: post
---

In this scenario, inter-module communication solely relies on message string queue operations. You can generate a Message string using the "**Build Message with Arguments++.vi**" function. Alternatively, if you are familiar with the rules, you can directly utilize message description strings.

```
#CSM State Syntax
    // Local Message Example
    DoSth: DoA >> Arguments

    // Sync Call Example
    API: xxxx >> Arguments -@ TargetModule

    // Async Call Example
    API: xxxx >> Arguments -> TargetModule

    // Async Call without Reply Example
    API: xxxx >> Arguments ->| TargetModule

    // Broadcast normal status:
    Status >> StatusArguments  -><status>

    // Broadcast Interrupt status:
    Interrupt >> StatusArguments  -><interrupt>

    // Register Source Module's status to Handler Module
    Status@Source Module >> Handler Module@Handler Module -><register>

    // Unegister Source Module's status
    Status@Source Module >> Handler Module -><unregister>

#CSM Commenting
    To add a comment use "//" and all text to the right will be ignored

    UI: Initialize // This initializes the UI
    // Another comment line
```

Go to ***/Example/2. Caller is CSM Scenario*** to find an example for this scenario.
