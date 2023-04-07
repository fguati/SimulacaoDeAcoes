CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(40) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senhaHash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL
  );

INSERT INTO users (nome, email, senhaHash, salt) 
VALUES  ("JRR Tolkien", "sul-africano"),
        ("Ursula LeGuin", "estadunidense"),
        ("Machado de Assis", "brasileira"),
        ("Júlio Cortázar", "argentino");


  
.exit