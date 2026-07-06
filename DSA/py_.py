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


#!sets
