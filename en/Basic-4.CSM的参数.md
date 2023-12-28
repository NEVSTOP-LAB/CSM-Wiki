JKISM 只支持 STRING TYPE 作为参数，但是需要传输的数据种类繁多。因此，对参数的支持至关重要。下表列出了当前支持不同数据类型的一些方法，其中一些是 CSM 内置的，而其他一些则需要安装额外的支持插件。

<!--

| 参数 | 类型 | 描述 |
|---|---|---|
| SafeStr | 内置 | “->\| -> -@ & <- ， ； []{} `”将被替换为%[HEXCODE] |
| HexStr | 内置 | 数据将被转换为十六进制字符串作为参数 |
|[MassData](https：//github.com/NEVSTOP-LAB/CSM-MassData-Parameter-Support) |插件|数据将被保存在循环缓冲区中。传递带有起始地址和数据长度|
|[API Arguments](https：//github.com/NEVSTOP-LAB/CSM-API-String-Arugments-Support) |插件|支持将纯字符串作为 CSM API 参数|
|[INI Static Variable](https：//github.com/NEVSTOP-LAB/CSM-INI-Static-Variable-Support)|插件|为 CSM 提供 ${variable} 支持|

-->

![table](_img/slides/Baisic-4.Arguments(CN).png)