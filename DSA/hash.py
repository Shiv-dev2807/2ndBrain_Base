#pre storing and fetching
freq = {}
arr = [1,2,1,3,2]

for num in arr:
    if num in freq:
        freq[num] += 1
    else:
        freq[num] = 1

print(freq.get(1,0))# if key exist returns the value, else returns 0