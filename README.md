# Stock Exchange Simulator
# Introduction
This is a web app that simulates stock exchanges, developed as a way to practice web development skills. The app has a frontend developed in React with TypeScript and a backend in Express Node.js and is inspired by the final project of the CS50 course from Harvard.

# Table of Contents

# FolderStructure
<!-- Get-PSTree -Exclude *node_modules > ..\dir_tree.txt -->
<!-- Abre o aqruivo, edita retirando tamanhos e mode, colar aqui -->
Mode   Hierarchy                          
----   ---------                        
d----- SimulacaoDeAcoes                 
-a---- ├── .gitignore                   
-a---- ├── package-lock.json            
-a---- ├── package.json                 
-a---- ├── README.md                     
d----- ├── frontend                      
-a---- │   ├── .gitignore              
-a---- │   ├── package-lock.json         
-a---- │   ├── package.json              1,32 Kb
-a---- │   ├── README.md                 3,28 Kb
-a---- │   ├── tsconfig.json            11,18 Kb
d----- │   ├── src                       1,82 Kb
-a---- │   │   ├── App.css             715 Bytes
-a---- │   │   ├── index.css           368 Bytes
-a---- │   │   ├── index.js            270 Bytes
-a---- │   │   ├── router.tsx          509 Bytes
d----- │   │   ├── utils               816 Bytes
d----- │   │   ├── routes              879 Bytes
d----- │   │   ├── Pages                 0 Bytes
d----- │   │   ├── Interfaces            0 Bytes
d----- │   │   ├── Components            0 Bytes
d----- │   │   └── Common               71 Bytes
d----- │   └── public                    1,67 Kb
-a---- │       ├── index.html            1,61 Kb
-a---- │       └── robots.txt           67 Bytes
d----- └── backend                     383,72 Kb
-a----     ├── .env                    266 Bytes
-a----     ├── .env.example             20 Bytes
-a----     ├── jsconfig.json            66 Bytes
-a----     ├── package-lock.json       381,76 Kb
-a----     ├── package.json              1,23 Kb
-a----     ├── teste.js                393 Bytes
d-----     ├── test                      0 Bytes
d-----     │   ├── utils                 1,84 Kb
d-----     │   ├── services              4,03 Kb
d-----     │   ├── routes               17,96 Kb
d-----     │   ├── middleware             5,2 Kb
d-----     │   ├── db                  242 Bytes
d-----     │   ├── CustomErrors          7,55 Kb
d-----     │   └── Controllers          11,52 Kb
d-----     ├── src                       1,29 Kb
-a----     │   ├── app.js                1,12 Kb
-a----     │   ├── server.js           172 Bytes
d-----     │   ├── utils                 1,54 Kb
d-----     │   ├── services              2,53 Kb
d-----     │   ├── routes              493 Bytes
d-----     │   ├── middleware            2,39 Kb
d-----     │   ├── db                      32 Kb
d-----     │   ├── CustomErrors          3,24 Kb
d-----     │   └── controllers           3,31 Kb
d-----     └── scripts                 720 Bytes
-a----         ├── backUpDB.js         363 Bytes
-a----         ├── restoreBackUp.js    357 Bytes
d-----         └── setUpDBForTests       5,19 Kb

# Features
Users can register and log in
Users get a dashboard summarizing their
<!-- Users can buy and sell stocks -->
<!-- Users can view their transaction history -->
<!-- Users can view stock prices in real-time -->

# Technologies Used
React with TypeScript for the frontend
Express Node.js for the backend
Sqlite3 for the database
API https://brapi.dev/ for quoting market data (documentation in https://brapi.dev/docs)
<!-- WebSocket for real-time updates -->

# Getting Started
Clone the repository.
Install dependencies by running npm install in both the frontend and backend directories.
Create a .env file in the backend directory and set the following environment variables:
<!-- makefile
Copy code -->
JWT_KEY==<your_jwt_secret>
Start the server by running npm start in the backend directory.
Start the client by running npm start in the frontend directory.

<!-- Demo
[Add a demo video or link to the deployed app here] -->

<!-- Contact
[Add contact information here] -->