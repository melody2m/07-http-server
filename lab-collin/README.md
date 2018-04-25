In this assignment we create an HTTP server that handles various requests, mostly involving the user's query string in the URL and the cowsay API.

The GET route to the /cowsay returns a cowsay with the user's message that was encoded in the querystring.

The GET route to /api/cowsay returns a JSON object of cowsay text from the querystring message.

The POST route to /api/cowsay expects a JSON object with a text property and returns a JSON object of a cowsay using that text.

There are various error cases in the above when an invalid query is made.



