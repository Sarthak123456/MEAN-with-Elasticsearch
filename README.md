# MEAN Stack CRUD Operations
A CRUD App in MEAN stack which stores data in Mongo as well as ElasticSearch and searches from Elastic Document.

###### Before Running this Project
Install npm packages using 'npm install' command from both Angular and NodeJS Project Folder(node_modules).

Install ElasticSearch using npm install elasticsearch --save 

Install Express, Mongoose and Body-Parser  using npm i express mongoose body-parser --save
Install Chart.js using npm install chart.js --save

MongoDb: http://localhost:3000/employees/

Angular: http://localhost:4200/

ElasticSearch: http://localhost:9200/sarthak/employee/_search?pretty

Query ElasticSearch: http://localhost:3000/employees/"query-character"



Script to run the project :

git clone https://github.com/Sarthak123456/MEAN-with-Elasticsearch.git

cd MEAN-with-Elasticsearch

cd AngularApp

npm install

ng serve -o 

Run elastic search on local machine using ./bin/elasticsearch

Open new terminal and run 

cd MEAN-with-Elasticsearch

cd NodeJS

node index.js 
