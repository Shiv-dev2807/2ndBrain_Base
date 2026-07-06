class DoublyNode:
    def __init__(self,data,next=None,prev=None):
        self.data = data
        self.next = next
        self.prev = prev
    
    def __str__(self):
        return str(self.data)


#! need access to both head and the tail

head = tail = DoublyNode(1)
print(head)


#!display

def display(head):
    curr = head
    elements = []
    while curr:
        elements.append(str(curr.data))
        curr = curr.next
    print(' <-> '.join(elements))

display(head)

#! insert at the beginning o(1)

def insertAtBeg(head,tail,data):
    new_node = DoublyNode(data,next=head)
    head.prev = new_node
    return new_node,tail

head,tail = insertAtBeg(head,tail,5)

display(head)


#! insert at the end o(1)

def insertAtEnd(head,tail,data):
    new_node = DoublyNode(data,prev=tail)
    tail.next = new_node
    return head, new_node

head, tail = insertAtEnd(head,tail,21)

display(head)