# takes an element and places it in correct order

arr = [14, 9, 15, 12, 6, 8]

for i in range(1,len(arr)):
    j = i

    while j > 0 and arr[j] < arr[j-1]:
        arr[j],arr[j-1] = arr[j-1], arr[j]
        j-=1
    
print(arr)