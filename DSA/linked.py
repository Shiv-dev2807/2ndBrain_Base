class Node:
    def __init__(self,data):
        self.data = data
        self.next = None

a = Node(10) #! head
b = Node(20)
c = Node(30)
a.next=b
b.next=c

head = a


#! insertion
def inse(n):
    ne = Node(n)
    ne.next = head.next
    head.next = ne
inse(11)



head.next = head.next.next


#! Traversal
while head:
    print(f"{head.data}-> ",end="")
    head = head.next


