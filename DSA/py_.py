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

def mulab(a,b):
    """
    Hello this is doc string
    """
    return a,b

(help(mulab))