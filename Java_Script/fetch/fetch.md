fetch = has priority queue just made for fetch 
micro task queue | priority queue | fetch queue 


response = fetch('smtg')
2 parts = 

variables memory data space
data =
onfulfilled[] //promise resolved
onrejection[] //promise rejection


web browser/node = access web browser api or node base api handled
= network request goes from here
network request (cant directly,need resourcse from web or node)

goes to network and gets response it goes to => onfulfilled[]
404 and all errors goes to onfulfilled[] coz we get that errors when we go to the network


cannot go to network or does not get response or stuck response then
it goes to => onrejection[]