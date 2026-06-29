# selects the max pushes to the end by adjacent swaping

arr = [13,46,24,52,20,9]

back = len(arr)-1
while back >= 0:
    for i in range(back):
        if arr[i] > arr[i+1]:
            arr[i], arr[i+1] = arr[i+1],arr[i]
    back-=1
        
print(arr)