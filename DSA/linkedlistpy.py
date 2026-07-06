
#! add delete o(n) linked list
#! lookup = o(n)

#! o(1) = beginning of the list, removing, put at beginning


#! doubly linked list  delete o(1) if know the position
#? access at the front and at the back node

#! single linked list

class singlyNode:
    def __init__(self,data,next=None):
        self.data = data
        self.next = next
    
    def __str__(self):
        return str(self.data)

head = singlyNode(1)
a = singlyNode(3)
b = singlyNode(4)
c = singlyNode(7)

head.next = a
a.next = b
b.next = c

#print(head)

#Travers the list #!o(n)

curr = head
while curr:
    print(curr)
    curr = curr.next


#! display

def displayL(head):
    curr = head
    elements = []
    while curr:
        elements.append(str(curr.data))
        curr = curr.next
    print(' -> '.join(elements))

displayL(head)


#! search for node

def search(head,val):
    curr = head
    while curr:
        if val == curr.data:
            return True
        curr = curr.next
    
    return False

print(search(head,5))