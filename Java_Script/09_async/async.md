default behaviour

java script 
    -> synchronous (one code then one code, line by line)
    -> single threaded (one thread)

execution context 
execute one line of code at a time
each operation waits for the last one to complete before execution
callstack memory heap


blocking code vs non blocking code

blocking = 
block the flow of program
read file sync 

non blocking =
does not block execution
read file async

example = user data store into data base msg = register with success 
blocking code = store then success
non blocking = without complete store success msg

so use them according to use cases 


diagram = js engine

execute 
callstack
global execution
memory heap(when executed unload function)
problem with async code (we need some mechanism to do this work and remind me afterwards) for that mechanisms webapi, node apis,etc

we example
async apis = set timeout, set interval,etc 

set timeout
function asked to set set timeout
call go to webapi(do other work while process this remind in 2 sec)
set time out function timeout after 2 sec execute this

registration into register call back (do in 2 sec, or 2 min, or at any event(button click,hover,etc)) register call back registers everything



web api gets dom api/node
apis, set timeout, interval, dom api, fetch()


task queue make js fast
register call back to => task queue
adds them to call stack
call back when comes, adds it to callstack(from top it adds)

high priority queue

1 [0,2] 3 =o/p 1,3,2
0 = timeout(even if instant it takes time)


fetch() = it also works on task queue same work
we kept another task queue with high priority
