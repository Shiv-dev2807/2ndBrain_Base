print("Hello")
#? str = "" or ''
#? +,-,/,%,**,//
#! variables x ,a,etc, ! boolean = True False | <,>,<=,>=,==,!= | and or not in is(checks if they are referring to same or not)

"""
if(condition):
    statements
elif(condition2):
    statements
else:
    statements"""


#! list = [1,2,3,4,4,5,6] (.append())

#!for loop = for i in range() | for n in nums
#indexing starts 0
#! while condition: i+=1 j-=1

#! for i, item in enumerate(arr):
#       print(i,item)

#!functions
"""

def a(a): parameter
    print()

a(h) argument
print(a(h)) = None (coz print is there in def, and not returning any value)

defa(a):
    return
!scope local, global

!side effect of function modifying outside variables etc | unmodifyied no side effect
"""


#! copy 
"""
from copy import deepcopy
a = [1,2,3,4]
b = deepcopy(a)
"""

#def s(a,b,c=2,d=4) default


#!file reading and writing
"""path = '/DSA/text.txt'

#!read
with open(path,'r') as f:
    print(f.readlines())
    print(f.read())
    for line in f:
        print(line)#new line
        print(line.rstrip())#without new line

#!write
with open('new_file.txt''w') as f:
    f.write("Hello")

#!append
with open('new_file.txt','a') as f:
    f.write("\nhi")"""






"""
#! OBJECT
#? AND
#! CLASSES

#==================================================================

class Human: #factory makes things 
    def __init__(self,age,name): #constructur of the class
        self.age = age
        self.name = name
    
    def __str__(self):
        return "A human " + self.name + "." + " humans age " + str(self.age) + "."
    
    #! own method

    def older_younger_than(self,age):
        if self.age > age:
            print("Our age is bigger than there age")
        elif self.age == age:
            print("Both age are equal")
        else:
            print("Our age is smaller than there age")


h = Human(4,"shiv") #object

#print(h)

print(h.age)
print(h.name)
print(h.__str__())
h.older_younger_than(5)"""

#====================================================================

#! help(print)


#!docstring | func | classes also,etc

# def mulab(a,b):
#     """
#     Hello this is doc string
#     """
#     return a,b

# (help(mulab))

#! list
"""l = [1,2,3]
l.append(4)
l.insert(0,5)
print(l) 
print(l.count(4))
print(l.count(45)) # not there so 0
l.reverse() # actually reverses the original list
print(l)
l.remove(5)
print(l)"""

#! slicing = l[1:2] | l[:3] | l[3:] | l[::-1] | l[0:9:2]
#! copy list = a = [:]

#! dictionaries
"""#key value
d = {'apple':'its a fruit',
     'banana':'hell'}
print(d)
print(d['apple'])
d['banana'] = 'shiv'
print(d['banana'])
del d['banana']
print()
d['cucumber'] = 'shhhh'
print(d)

print()
for k in d.keys():
    print(k)

print()
for v in d.values():
    print(v)

for k in d.keys():
    v = d[k]
    print(v)

d2 = {0:'shiv',1:'shivvvv'}"""
"""
#! strings
name = "shiv"
print(f"hi {name}")

#cant str + int
#! everything is an object in python
#! f"{h}" #also object classes can be used in fstring

print("Hello its {0}".format(name))

for c in "shiv":
    print(c)

#help(str)

print("I am shiv".split(" "))

print("shiv".isnumeric())#false
print("123".isnumeric())#true
print("ab1".isnumeric())#false

print("SHIV".lower())
print("gtgrtgrtgrtg".upper())

s = "hell"
print(s[0])#h
print(len(s)) #4

#! strings are immutable = not changeable
"""


"""#!tuple
t = (5,4)
print(t)
print(t[0])
for item in t:
    print(item)

#similar to list but tuples are immutable

#! sorted
print(sorted([2,9,5]))"""


"""#!sets
#? unorderd, no duplicates

s = {1,1,2,-4,1,2,9,9}
print(s)

#remove duplicates
set("I am trying to master dsa")
print(set("I am trying to master dsa"))

print(type({}))
print(type(set()))"""

"""#! errors/try/except

t = (1,2,3)
try:
    t[0] = 2
except:
    print("Caught it")

#try this if error do this"""
"""
#! get more specific

t = (1,2,3)
try:
    t[0] = 2
except TypeError: #wont work for syntaxerror if we try that
    print("caught it")"""


"""#!input

res = input("Hey please give us a number: ")
print(res) #only string
print(type(res))
ress = int(input("Enter only num: "))
print(ress)
print(type(ress))
#can also do
print(res.isnumeric())"""

#! list comprehension

"""l = [x for x in range(5)]
print(l)"""
""""n = [1,2,3,4,5]
l = [x**2 for x in n]
print(l)
"""

"""l = [x for x in range(21) if x%2==0]
print(l)

#!with else condition

l1 = [x if x%2==0 else 5 for x in range(5)]
print(l1)"""

"""
print([0]*5)

print([1,2]+[5,4,7])"""

"""#! zip

for a,b in zip(range(3),range(4,7)):
    print(a,b)# 0,4 | 1,5 | 2,6


print([(a,b) for a,b in zip(range(3),range(4,7))])

print({a:b for a,b in zip(range(3),range(4,7))})"""


#!ascii 
"""print(chr(65)) #A
print(chr(97)) #a
print(ord('A')) #65
print(ord('a')) #97"""

"""print({k:chr(k+64) for k in range(1,27)})

print()

print({k:chr(k+96) for k in range(1,27)})
"""

#!lambda function
#one time use throw them away mostly used in higher order functions like sort() map() filter() reduce()
"""double = lambda x:x*2

print(double(2))

max_value = lambda x,y: x if x>y else y
print(max_value(7,6))"""


#! map
"""def c(temp):
    return (temp * 9/5) +32

cle_temp = [0.0,10.0,20.0,30.0]

fer_temp = (map(c,cle_temp))

for i in fer_temp:
    print(i)

f_temp = list(map(c,cle_temp))
print(f_temp)"""

#! map takes function, collection we can take lambdafunction insted of main function

"""cle_temp = [0.0,10.0,20.0,30.0]
f_temp = list(map(lambda x:(x*9/5)+32,cle_temp))
print(f_temp)"""


#! filter takes function, collection returns all elements that passes a condition
#normal func or lambda

"""def is_passing(v):
    return v >= 60"""
"""grades = [92,43,32,90,85,73,64]
passgrade = list(filter(lambda x : x>=60,grades))"""

"""for g in passgrade:
    print(g)"""

#print(passgrade)


#! Reduce function = reduces element in a collections to a single value
"""from functools import reduce"""

"""def add(x,y):
    return x + y"""

"""
price = [19.99, 1.00, 5.75, 12.99, 10.99]

total = reduce(lambda x,y:x+y,price)
print(total)"""


#! modules
#from copy import deepcopy #module = copy, function = deepcopy
"""import copy as cp 

a = [1,2,3]
b = cp.deepcopy(a)
print(a)
print(a is b)"""

#built in libraries, hidden inside , installed default accessed using import

#import numpy as np

#! if want to list all the modules installed, use pip = it is a package manager 
#! !pip list | terminal = pip3 list

#! scripts = .py files
#! if want to import class or any another file = from human import Human
#? reuse multiple times the same file 