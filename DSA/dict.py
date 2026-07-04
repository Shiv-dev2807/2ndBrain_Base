
#! key and value pair
#! creation

d = {}

d = {
    "name": "john",
    "age": 20
}

#! creation using constructor
d2 = dict(name="john",age=20)

#! creation from tuples
pairs = [
    ("a",1),
    ("b",2)
]
d3 = dict(pairs)


#! Acessing values
#! []
print(d3["b"]) # but error when missing key so use !GET()

#! get()
print(d3.get("a")) # if missing we get None

#! with default
print(d3.get("c",0)) # gives 0 if c is missing
