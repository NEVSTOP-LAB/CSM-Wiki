---
title: CSM Continuous Measurement and Logging Example
author: nevstop
date: 2024-01-02
layout: post
lang: en
page_id: CSM-Continuous-Measurement-and-Logging
toc: true
---

# CSM Continuous Measurement and Logging

[![Image](https://www.vipm.io/package/nevstop_lib_csm_continuous_meausrement_and_logging_example/badge.svg?metric=installs)](https://www.vipm.io/package/nevstop_lib_csm_continuous_meausrement_and_logging_example/)
[![Image](https://www.vipm.io/package/nevstop_lib_csm_continuous_meausrement_and_logging_example/badge.svg?metric=stars)](https://www.vipm.io/package/nevstop_lib_csm_continuous_meausrement_and_logging_example/)
[![GitHub all releases](https://img.shields.io/github/downloads/NEVSTOP-LAB/CSM-Continuous-Meausrement-and-Logging/total)](https://github.com/NEVSTOP-LAB/CSM-Continuous-Meausrement-and-Logging/releases)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Accomplish application of Continuous Measurement and Logging with CSM. It's much more simple, intuitive and graceful.

## Reusable Modules

### `Logging Module` : Logging 1D Waveform Data to tdms file.

| API | Description | Parameter |
| --- | --- | --- |
| `API: Update Settings` | Config API | Full path of data folder <br/> (Type: Plain String) |
| `API: Start` | Start logging. Create the tdms file in data folder with time-based file name. | N/A |
| `API: Log` | Log data to tdms file. | 1D Waveform array.  <br/> (Type: [MassData Arguments](https://github.com/NEVSTOP-LAB/CSM-MassData-Parameter-Support)) |
| `API: Stop` | Stop logging. | N/A |

**Example: (Suppose module name is "Logging")**

``` c
API: Update Settings >> c:\_data -> Logging
API: Log >> MassData-Start:89012,Size:1156 -> Logging
API: Start -> Logging
API: Stop -> Logging
```

### `Acquisition Module` : Generate Sine/Square Simulated signal data.

| API | Description | Parameter |
| --- | --- | --- |
| `API: Update Settings` | Config API | Cluster:{HW(String),Signal Type(Enum)}  <br/> (Type: HexStr) |
| `API: Update Settings v2.0` | Config API | HW:(string);Signal Type:(Sine Wave \| Square with Noise)  <br/> (Type: API String) |
| `API: Start` | Start data generation every 200ms. | N/A |
| `API: Stop` | Stop data generation. | N/A |


| Status | Description | Parameter |
| --- | --- | --- |
| Acquired Waveform | Simulated Data.  | 1D Waveform array. <br/> (Type: [MassData Arguments](https://github.com/NEVSTOP-LAB/CSM-MassData-Parameter-Support)) |

**Example: (Suppose module name is "Acquisition")**
```
API: Start -> Acquisition
API: Stop -> Acquisition
//With CSM-API-String-Arguments-Support, update 'Signal Type' with plain text description
API: Update Settings v2.0 >> Signal Type:Sine Wave -> Acquisition
```

### `Algorithm Module` : Algorithm on waveform data.

| API | Description | Parameter |
| --- | --- | --- |
| `API: FFT(Peak)` | Analyze waveform with FFT(peak) method | 1D Waveform array. <br/> (Type: [MassData Arguments](https://github.com/NEVSTOP-LAB/CSM-MassData-Parameter-Support)) |
| `API: FFT(RMS)` | Analyze waveform with FFT(RMS) method | HW:(string);Signal Type:(Sine Wave \| 1D Waveform array. <br/> (Type: [MassData Arguments](https://github.com/NEVSTOP-LAB/CSM-MassData-Parameter-Support)) |
| `API: Power Spectrum` | Get Power Spectrum of Waveform | 1D Waveform array. <br/> (Type: [MassData Arguments](https://github.com/NEVSTOP-LAB/CSM-MassData-Parameter-Support)) |

| Status | Description | Parameter |
| --- | --- | --- |
| FFT(Peak) | FFT(peak) spectrum Data. | 1D Waveform array. <br/> (Type: [MassData Arguments](https://github.com/NEVSTOP-LAB/CSM-MassData-Parameter-Support)) |
| FFT(RMS) | FFT(RMS) spectrum Data. | 1D Waveform array. <br/> (Type: [MassData Arguments](https://github.com/NEVSTOP-LAB/CSM-MassData-Parameter-Support)) |
| Power Spectrum | Power Spectrum Data. | 1D Waveform array. <br/> (Type: [MassData Arguments](https://github.com/NEVSTOP-LAB/CSM-MassData-Parameter-Support)) |

## Continuous Measurement and Logging Application

`Logging Module` and `Acquisition Module` don't know each other at all.
User interface module is needed for Continuous Measurement and Logging application.
To make it sample(and easy to compare with workers), UI Module is also acting as the controller of the application.

When you need to use real hardware for data acquisition, create another CSM module for your hardware with the same API/Status and replace the `Acquisition Module` in UI module.


### UI Module

Create UI, which is similar as [Workers Continuous Measurement and Logging Example](https://www.vipm.io/package/sc_workers_framework_core/)

![Alt text](assets/img/csm-cont-daq-logging-example/mainUI.png)

Create Block Diagram with CSM Template. Drop `Logging Module` and `Acquisition Module` as submodules.

![mainBD](assets/img/csm-cont-daq-logging-example/MainBD.png)

#### Start-Up Process (Macro: Initialize)

Initialize data and UI. Load configuration from xml file and send config to submodules. Register "Acquired Waveform" status of "Acquisition" to "UI: Update Waveforms" state of "UI". When "Acquired Waveform" status occurs, "UI" will go to "UI: Update Waveforms" automatically.

```
Data: Initialize
Initialize Core Data
Data: Load Configuration From Ini
Events: Register
UI: Initialize
UI: Front Panel State >> Open
Do: Update Settings
DO: Update Status >> Ready...
```

![Macro: Initialize](assets/img/csm-cont-daq-logging-example/Initialize%20Process.png)

#### Exit Process (Macro: Exit)

Stop submodules and UI module itself then.

```
Macro: Exit -@ Acquisition
Macro: Exit -@ Logging
Macro: Exit -@ Algorithm
UI: Front Panel State >> Close
Data: Cleanup
Events: Unregister
Exits
```

![Macro: Initialize](assets/img/csm-cont-daq-logging-example/Exit%20Process.png)

#### Start Process (Macro: Start)

Update UI and trigger submodule to work with start message. Register "Acquired Waveform" status of "Acquisition" to "API: Log" state of "Logging". When "Acquired Waveform" status occurs, "logging" will go to "API: Log" automatically.


```
//Register Status
Acquired Waveform@Acquisition >> API: Log@Logging -><register>
Acquired Waveform@Acquisition >> API: Power Spectrum@Algorithm -><register>
Acquired Waveform@Acquisition >> UI: Update Waveforms -><register>
Power Spectrum@Algorithm >> UI: Update FFT -><register>

//Local States
DO: Update Status >> Acquiring and Logging...
UI: Update When Start

//Send Message to Other CSM Modules
API: Start ->| Logging
API: Start ->| Acquisition
```

![Macro: Start](assets/img/csm-cont-daq-logging-example/Start%20Process.png)


#### Stop Process (Macro: Stop)

Update UI and stop submodules. Unregister "Acquired Waveform" status of "Acquisition".

```
//Local States
DO: Update Status >> Stopping...
UI: Update When Stop

//Send Message to Other CSM Modules
API: Stop ->| Logging
API: Stop ->| Acquisition

//Unregister Status
Acquired Waveform@Acquisition >> API: Log@Logging -><unregister>
Acquired Waveform@Acquisition >> API: Power Spectrum@Algorithm -><unregister>
Acquired Waveform@Acquisition >> UI: Update Waveforms -><unregister>
Power Spectrum@Algorithm >> UI: Update FFT -><unregister>
```

![Macro: Stop](assets/img/csm-cont-daq-logging-example/Stop%20Process.png)
