JKISM only supports the STRING TYPE as a parameter, but there is a wide variety of data that needs to be transmitted. Therefore, support for parameters is crucial. The table below lists some of the current ways in which different data types are supported, with some being built-in within CSM and others requiring additional installation through addons.

| Arguments | Type | Description |
|---|---|---|
| Safe String | Build-in | "->\| -> -@ & <- , ; []{}`"  wil be replaced with %[HEXCODE] |
| HexStr | Build-in | Data will be converted as variant and changed to Hex String as paramter |
|[ArrayData](https://github.com/NEVSTOP-LAB/CSM-Array-Parameter-Support) |Addons|Pass the StartPos with array-length of a cirlce buffer for numeric array data|
|[MassData](https://github.com/NEVSTOP-LAB/CSM-MassData-Parameter-Support) |Addons|Data will be converted to memory and saved in a cricle byffer. Pass the StartPos with length as parameter. |
|[API String Arguments](https://github.com/NEVSTOP-LAB/CSM-API-String-Arugments-Support) |Addons|Support plain string as CSM API parameter|
|[INI Static Variable Support](https://github.com/NEVSTOP-LAB/CSM-INI-Static-Variable-Support)|Addons|offering ${variable} support for CSM|
