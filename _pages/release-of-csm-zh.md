---
title: 下载
author: nevstop
date: 2022-02-06
category: information
layout: post
lang: zh
page_id: release-of-csm
permalink: /release-of-csm
---

<!-- Download 页面(md-page[√]) - English[100%] | Chinese [100%]
- [x] Beta 版本的下载链接
- [x] 下载CSM框架的最新版本的链接
- [x] 历史版本的更新记录
 -->

 <!--
https://github.com/NEVSTOP-LAB/Communicable-State-Machine/actions/workflows/Build_VIPM_Library.yml?query=branch%3Amain++
 -->

## 最新版本

_**v2023.Dec Release: Improvement and Bug Fix**_

点击下载 :arrow_forward:
[![Image](https://www.vipm.io/package/nevstop_lib_communicable_state_machine/badge.svg?metric=installs)](https://www.vipm.io/package/nevstop_lib_communicable_state_machine/) [![GitHub all releases](https://img.shields.io/github/downloads/NEVSTOP-LAB/Communicable-State-Machine/total)](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/releases/tag/v2023.Dec)

>
> :rocket: 如果想要下载 Pre-release 版本, 请访问: [NEVSTOP-LAB/Communicable-State-Machine 的 Action 页面](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/actions/workflows/Build_VIPM_Library.yml?query=branch%3Amain)
>
> **下载步骤**：
>
> - Step 1. 点击最新的 Build_VIPM_Library 的 Action
> - Step 2. 下拉到达 Artifacts 区域，点击 vip 文件下载
> - Step 3. 解压下载的 zip 文件
> - Step 4. 双击 vip 文件或通过 VIPM 打开安装
>

[**v2024.Feb Release: Toolbar Entry for CSM Tools**](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/releases/tag/v2024.Feb)

``` text
#GlobalEvent
[improve] improve release logic. Use watchdog for background thread exit
[improve] minor fix #254

#Utility
[add] #251 add "CSM - Filter Messages to Non-Existing Modules.vi"

#Tool
[add] #252 add a toolbar entry to launcher CSM tools

#Documentation
[fix] #246 fix vipm.io links
[improve] #245 improve user experience
[improve] Update example VIs' icons/Palette icons
```

## 历史更新记录

[**V2024.Jan Release: Global Event, Utility and bug fix**](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/releases/tag/v2024.Jan)

``` text
#Core
[update] #242 For async-message, if target turned invalid before response, no ¡°target error¡± throw out
[fix] Clear Last Message's Error before new remote message, to avoid some misinformation

#Arguments
[fix] Fix the error input of "CSM - Convert HexStr to Data.vi"
[fix] minor fix #237

#Global Event
[add] #240 add "Module Created" and "Module Destroyed" log to global log system
[fix] #238 Align global event ref lifecycle with a background thread, rather than the caller VI

#Utility
[add] Add "CSM - Remove Duplicated Following Messages.vi", to remove duplicated message
[add] Add "CSM - Replace Substitution Marks in Messages.vi", to help build multiple-line states easily

#Documentation
[add] Create web wiki for CSM: https://nevstop-lab.github.io/CSM-Wiki/
```

[**v2023.Dec Release: Improvement and Bug Fix**](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/releases/tag/v2023.Dec)

``` text
#Core
[Critical] #207 "Target Busy Error" is obsolete. Now a sync-call message will not generate "Target Busy Error" but waiting until timeout.
[fix] #219 #225 #226 fix bug that the cache system is ineffective when CSMs start/exit in the same microsecond
[fix] #197 fix the bug of timeout behavior of CSM - Send Message and Wait for Reply.vi
[fix] #196 fix the bug that status of agent(worker Mode) could not trigger registered action
[fix] #215 now CSM - Module Turns Invalid (CSM) support Agent & Chain
[fix] #217 fix the bug that Single Character could not be used as module name

#GlobalLog
[add] #214 add Error Handler which logs error in global log if any.
[update] #220 #221 Log Error Information in CSM - Generate User Global Log.vi
[fix] #212 Remove some meaningless items in log

#Utility
[add] #209 add Build Exit Messages of CSMs.vi
[add] #216 add two sync-up VI: CSM - Wait for All Modules to Exit.and CSM - Wait for All Modules to be Alive
[add] add Random Change Flag.vi for internal bug fix.

#Installer
[improvement] #203 Change post-install action window to JKISM
[update] #228 show relative path in post-install action window

#Template
[add] add CSM - No-Event Structure Template - Tiny.vi
[minor update] #211 #223
```

[**v2023.Nov: 2023.11.29.94143 (Nov 29, 2023)**](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/releases/tag/v2023.Nov)

``` text
#Core
[add] #144 add build-in chain of responsibility mode "$" as key words in module name.
[add] add CSM - Break Down Multiple States String.vi
[add] #184 add CSM - Keywords.vi for exposing keywords of CSM
[add] #161 Response/Async Response carry the Error information from target CSM module
[add] Allowed Messages(Empty for all) terminal for Parse State Queue++.vi
[improve] make Parse State Queue++.vi block diagram clear
[improve] #140 Improve CSM - Send Message and Wait for Reply.vi and CSM - Post Message.vi
[fix] #173 fix bug that sync message(-@) is blocking by mass of async message(->).
[fix] fix No source module name for "Macro: Exit"
[fix] show pre-state argument for Response(sync-call)
[fix] show pre-state/pre-argument for "Target Error","Target Timeout Error" or "Target Busy Error"

#Arguments
[add] Convert Error with Argument API and example

#Template
[critical] Change Error Status Arguments to SafeString as Default in template
[add] add a stub string constant which is for exiting sub-modules
[update] #186 show "Init State("Macro: Initialize")" control for templates
[update] init error shift register in front of loop
[fix] #179 Show documentation case by default

#documentation
[fix] #180 Update description of quick-drop VIs in documentation palette
```

[**v2023.Oct: 2023.10.29.195953 (Oct 29, 2023)**](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/releases/tag/v2023.Oct)

``` text
[critical]#169 show both source message and arguments for response/async response, which will broken old module but easy to fix.
[add] #158 Add State Table - DebugTool
[add] #156 Create CSM_Tool_Launcher entry in Tool Menu
[add] #154 Create stub folder [labview]\templates\Communicable State Machine(CSM) for template VIs
[add] Apache License 2.0 License
[add] update More template palette tool
[add] Example of demonstration of build-in error handling framework
[improve] #160 improve debug tools of CSM
[improve] #174 Show all keyword in template
[improve] #168 template: add case in Response/Async Response
[fix] #153 Small fix and update to templates
[fix] #150 Fix description in pages of vipm.io
[fix] #157 Fix QD of CSM_Tool_Launcher
[fix] #164 fix // is not included in Make Argument Safe.vi
[fix] #171 register status@* should exclude itself from list, to prevent recursive call.
```

[**v2023.Sep: 2023.10.2.123812 (Oct 03, 2023)**](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/releases/tag/v2023.10.2.123812)

``` text
    Release to vipm.io
```
