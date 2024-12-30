//*** for frontend ***


fetch('/addPost', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    topic: 'example topic',
    data: 'example data'
  })
})
.then(response => response.text())
.then(data => console.log(data))
.catch(error => console.error(error));

fetch('/getPosts')
.then(response => response.text())
.then(data => console.log(data))
.catch(error => console.error(error));
