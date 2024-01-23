# Xpell-Node - Real-Time Interpreter for Node.js and Web Applications


Xpell-Node is a real-time interpreter for Node.js application development, such application requires control on several modules  and AI engine to run within high FPS.

Xpell enables real-time translation from any command (XCommand) to platform specific command.



The way to communicate with Xpell engine is to send XCommand that will be analyzed and activate the appropriate module:

```
  [XCommand]
     - module (the name of the module to run the command)
     - created (date/timestamp of the command)
     - object - optional - the object within the module to run the command
     - op (the operation (method/function) to run within the module)
     - params (list of parameters)
```





# Credits & License

 ---

 Author: Fridman Fridman <tamirf@yahoo.com>

 License:  GPL-3 

 First Release: 22/07/2022

 Copyright Fridman Tamir 2022, all right reserved

 
 