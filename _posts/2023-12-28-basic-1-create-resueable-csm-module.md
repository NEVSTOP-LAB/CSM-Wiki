---
title: Basic 1.Create Reuseable CSM Module
author: nevstop
date: 2023-12-28
category: Basic
layout: post
---

Creating a reusable module typically does not require message interaction with other modules; it only needs to provide an external interface and publish the state of the module. Therefore, as long as these two aspects are clearly described, one can call the reusable module without understanding its internal implementation details.

In CSM modules, all cases can be considered as messages for invocation, but it is recommended to use API category as external interfaces. When sending status updates, notify external entities of changes by sending either Status or Interrupt Status.

Go to _**/Example/1. Create a reusable module**_ to learn how to create a CSM module.
