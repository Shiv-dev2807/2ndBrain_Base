# creation
arr = [1,2,2,3,4,5]
arr1 = [1,"one",True,False,2.3,[1,2]]

#? indexing
#acessed using index 0 to len(nums)-1
print(arr[0])


#? slicing
print(arr[1:4]) # inclusive, exclusive
# arr[:3], arr[2:], arr[::-1] reverse

# ! slicing used in patterns =>
"""
Sliding window
Reverse problems
Subarray extraction
"""

"""
!
| Operation  | Example          | Complexity     |
| ---------- | ---------------- | -------------- |
| Access     | arr[i]           | O(1)           |
| Append     | arr.append(x)    | O(1) amortized |
| Pop last   | arr.pop()        | O(1)           |
| Pop middle | arr.pop(i)       | O(n)           |
| Insert     | arr.insert(i, x) | O(n)           |
| Delete     | del arr[i]       | O(n)           |
| Search     | x in arr         | O(n)           |
"""


#! list methods
arr.append(10)
print(arr)
# arr.pop(i) for index
arr.pop() #last item
print(arr)
arr.remove(2)#remove 1st occurance

#! utilities
# len(arr), arr.sort(), arr.reverse()

#!copy ways
"""
a = [1,2,3]
b = a.copy()
b = a[:]
b = list(a)
"""

#! List comprehensions

# 3 different ways
"""
1. Normal

res = []
for i in range(5):
    res.append(i*i)
"""

"""
2. Comprehension with no condition
res = [i*i for i in range(5)]
"""

"""
With Condition
even = [i for i in range(10) if i % 2 == 0]
"""



#! Patterns
"""
Two Pointers
Sliding Window
Stack using list
Queue (Not ideal but works)
"""

#!Shallow vs deep copy
"""
!Shallow
a = [[1,2],[3,4]]
b = a.copy()  # inner lists still shared

!Deep
import copy
b = copy.deepcopy(a)
"""

"""
!Big-O Mental Model (VERY IMPORTANT)

Think like this:

Access → fast (O(1))
Insert/delete middle → slow (O(n))
Search → slow (O(n))
Append/pop end → fast (O(1))

👉 This is why arrays are great for:

indexing problems
prefix sums
sliding window
two pointers

but bad for:

frequent middle insert/delete
"""

"""
!Must know patterns:
Two pointers
Sliding window
Prefix sum
Sorting + searching
Stack usage
Frequency counting
"""