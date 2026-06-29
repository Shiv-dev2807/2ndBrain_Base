# select minimum and swap

arr = [13, 46, 24, 52, 20, 9]

for i in range(len(arr)-1):
    min_in = i

    for j in range(i+1,len(arr)):
        if arr[j] < arr[min_in]:
            min_in = j
    arr[i],arr[min_in] = arr[min_in],arr[i]       

print(arr) 