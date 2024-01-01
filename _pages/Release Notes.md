---
title: {{ site.data[lang].l10n.release_note }}
author: nevstop
date: 2023-12-31
layout: post
lang: en
page_id: release-notes-of-csm
---

**v2023.Dec: 2023.12.25.111604 (Dec 25, 2023)**

```
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

**v2023.Nov: 2023.11.29.94143 (Nov 29, 2023)**

    # Core
    [add] #144 add build-in chain of responsibility mode "$" as key words in module name.
    [add] add CSM - Break Down Multiple States String.vi
    [add] #184 add CSM - Keywords.vi for exposing keywords of CSM
    [add] #161 Response/Async Response carry the Error information from target CSM module
    [add] Allowed Messages(Empty for all) terminal for Parse State Queue++.vi
    [improve] make Parse State Queue++.vi block diagram clear
    [imporve] #140 Improve CSM - Send Message and Wait for Reply.vi and CSM - Post Message.vi
    [fix] #173 fix bug that sync message(-@) is blocking by mass of async message(->).
    [fix] fix No source module name for "Macro: Exit"
    [fix] show pre-state argument for Response(sync-call)
    [fix] show pre-state/pre-argument for "Target Error","Target Timeout Error" or "Traget Busy Error"

    # Arguments
    [add] Convert Error with Argument API and example

    # Template
    [critical] Change Error Status Arguments to SafeString as Default in template
    [add] add a stub string constant which is for exiting sub-modules
    [update] #186 show "Init State("Macro: Initialize")" control for templates
    [update] init error shift resgister in front of loop
    [fix] #179 Show documentation case by default

    # documentation
    [fix] #180 Update description of quick-drop VIs in documentation palette

**v2023.Oct: 2023.10.29.195953 (Oct 29, 2023)**

    [critical]#169 show both source message and arguments for response/async response, which will broken old module but easy to fix.
    [add] #158 Add State Table - DebugTool
    [add] #156 Create CSM_Tool_Launcher entry in Tool Menu
    [add] #154 Create stub folder [labview]\templates\Communicable State Machine(CSM) for template VIs
    [add] Apache License 2.0 License
    [add] update More template palette tool
    [add] Example of demostration of build-in error handling framework
    [improve] #160 improve debug tools of CSM
    [improve] #174 Show all keyword in template
    [improve] #168 template: add case in Response/Async Response
    [fix] #153 Small fix and update to templates
    [fix] #150 Fix description in pages of vipm.io
    [fix] #157 Fix QD of CSM_Tool_Launcher
    [fix] #164 fix // is not included in Make Argument Safe.vi
    [fix] #171 register status@* should exclude itself from list, to prevent recursive call.


**v2023.Sep: 2023.10.2.123812 (Oct 03, 2023)**

    Release to vipm.io