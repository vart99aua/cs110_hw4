
'use strict';
const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

const todos = [
    {   id: Math.random() + '',
        message: 'Go to class',
        completed: false
    },
    {   id: Math.random() + '',
        message: 'eat lunch',
        completed: false
    }
];

const server = http.createServer(function (req,res) {
    const parsedUrl = url.parse(req.url);
    const parsedQuery = querystring.parse(parsedUrl.query);
    const method = req.method;

    const filePath = "./public" + req.url;
    if(method === "GET"){

        if(req.url === "/inittodos"){
            let json = JSON.stringify(todos)
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(json);
        } 
        else if(req.url === '/searchtodo'){    
            let json = JSON.stringify(todos)
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(json);
        } 
        else fs.readFile(filePath, function (err, data) {
            if (err) {
                res.statusCode = 404;
                res.end('Page Not Found');
            }
            
            res.statusCode = 200;
            res.end(data);
            return;   
        }); 
    }
    if(req.url === '/savetodo'){
        if(method === "POST"){
           
            let body = '';
            req.on('data', function (chunk) {
                body += chunk;
            });
            req.on('end', function () {
                let jsonObj = JSON.parse(body);  // now that we have the content, convert the JSON into an object
                jsonObj.id = Math.random() + ''; // assign an id to the new object
                todos.push(jsonObj);   // store the new object into our array (our 'database')
                return res.end(JSON.stringify(jsonObj));
            });
            return;
        }
    }
    if(method === 'DELETE') {
        if(req.url.indexOf("/todos/") >= 0) {
            let id =  req.url.substr(7);
            for(let i = 0; i < todos.length; i++) {
                if(id === todos[i].id) {
                    todos.splice(i, 1);
                    res.statusCode = 200;
                    return res.end('Successfully removed');
                }
            }
        }else{
            res.statusCode = 404;
            return res.end('Data was not found');
        }
    }

    if(method === 'PUT') {
        if(req.url.indexOf("/todos/") >= 0) {
            let sentData = '';
            req.on('data', function (chunk) {
                sentData += chunk;
            });
            req.on('end', function () {
                let sentTodo = JSON.parse(sentData);  // now that we have the content, convert the JSON into an object
                let id =  req.url.substr(7);
                console.log(id);
                for(let i = 0; i < todos.length; i++) {
                    if(id === todos[i].id) {
                        todos[i].completed = sentTodo.completed;
                        res.statusCode = 200;
                        return res.end('Successfully updated');
                    }
                }
                res.statusCode = 404;
                return res.end("Error");
            });
            return;
        }
    }
    
}).listen(8081);
console.log("server star1ted at 8081");
