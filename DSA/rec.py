# func calls it self until condition
# requires base condition


n = 5

def pri(n):
    if n == 0 or n == 1:
        return 1
    
    return n * pri(n-1)
print(pri(n))