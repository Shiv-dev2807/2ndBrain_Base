
#!Static arrays -> contiguous block of memory with fixed size
#! indexes 0 to len(arr)-1
a =[1,2,3,4,5]
print(a[2])
#mutable = can change the values in it

#check if x is there
if 5 in a:
    print("yes")

#! o(n) traversal
#! inserstion = lose an element, o(n)

#! delete
#! o(n) 


#! dynamic arrays
#!list array that can change size
#insert at end = append #! o(1)* most of the time and sometimes o(n) end of the array

#! pop o(1)
#! insert in any place o(n) start o(n)
#! remove from middle or start = o(n)


"""
! Operations Arr/list
append at end #! *o(1) # amortized (on average)
popping from end #! o(1)
insertion not from end #! o(n)
deletion not from end #! o(n)
modifying element #! o(1)
random access #! o(1)
checking if element exist #! o(n)
"""

#! strings = immutable 
#! mostly everything to do in strings is o(n)

"""
STRING 
append at end #! o(n)
popping from end #! o(n)
insertion not from end #! o(n)
deletion not from end #! o(n)
modifying element #! o(n)
random access #! o(1)
checking if element exist #! o(n)

"""



"""
#! ARRAYS
A = [1, 2, 3]

print(A)
===========================
A.append(5) #! o(1)

print(A)
===========================
A.pop() #! o(1)

print(A)
===========================
A.insert(2, 5) #! o(n)

print(A)
===========================
A[0] = 7 #! o(1) modify

print(A)
===========================
print(A[2]) #! o(1) accessing
===========================
if 7 in A: #! o(n)
  print(True)
===========================
print(len(A)) #! o(1)

=================================================================================

#! STRING
s = 'hello' #! o(n)

b = s + 'z'

print(b)
===========================
if 'f' in s: #! o(n)
  print(True)
===========================
print(s[2]) #! o(1)
===========================
len(s) #! o(1)
"""