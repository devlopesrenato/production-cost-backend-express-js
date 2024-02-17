CREATE TABLE IF NOT EXISTS exactmeasure (
    uuid uuid DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL UNIQUE,
    createby VARCHAR NOT NULL,
    createdate VARCHAR NOT NULL,
    modifyby VARCHAR NOT NULL,
    modifydate VARCHAR NOT NULL,
    ordenation VARCHAR NOT NULL UNIQUE,
    PRIMARY KEY (uuid)
);

CREATE TABLE IF NOT EXISTS simplemeasure (
    uuid uuid DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL UNIQUE,
    typemeasure VARCHAR NOT NULL,
    quantity VARCHAR NOT NULL,
    createby VARCHAR NOT NULL,
    createdate VARCHAR NOT NULL,
    modifyby VARCHAR NOT NULL,
    modifydate VARCHAR NOT NULL,    
    PRIMARY KEY (uuid)
);


CREATE TABLE IF NOT EXISTS feedstock (
    uuid uuid DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL UNIQUE,
    measurement VARCHAR NOT NULL,
    quantity VARCHAR NOT NULL,
    price VARCHAR NOT NULL,
    createby VARCHAR NOT NULL,
    createdate VARCHAR NOT NULL,
    modifyby VARCHAR NOT NULL,
    modifydate VARCHAR NOT NULL,    
    PRIMARY KEY (uuid)
);


CREATE TABLE IF NOT EXISTS production (
    uuid uuid DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL UNIQUE,
    price VARCHAR NOT NULL,
    categoryid VARCHAR NOT NULL,    
    createby VARCHAR NOT NULL,
    createdate VARCHAR NOT NULL,
    modifyby VARCHAR NOT NULL,
    modifydate VARCHAR NOT NULL,    
    PRIMARY KEY (uuid)
);

CREATE TABLE IF NOT EXISTS feedstockused (
    uuid uuid DEFAULT uuid_generate_v4(),
    feedstockid VARCHAR NOT NULL,    
    quantity VARCHAR NOT NULL,    
    productionid VARCHAR NOT NULL,    
    PRIMARY KEY (uuid)
);

-- work packaging and others
CREATE TABLE IF NOT EXISTS wpo (
    uuid uuid DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL UNIQUE,    
    quantity VARCHAR NOT NULL,
    price VARCHAR NOT NULL,
    createby VARCHAR NOT NULL,
    createdate VARCHAR NOT NULL,
    modifyby VARCHAR NOT NULL,
    modifydate VARCHAR NOT NULL,    
    PRIMARY KEY (uuid)
);

CREATE TABLE IF NOT EXISTS wpoused (
    uuid uuid DEFAULT uuid_generate_v4(),
    wpoid VARCHAR NOT NULL,    
    quantity VARCHAR NOT NULL,    
    productionid VARCHAR NOT NULL,    
    PRIMARY KEY (uuid)
);

CREATE TABLE IF NOT EXISTS users (
    uuid uuid DEFAULT uuid_generate_v4(),
    nickname VARCHAR NOT NULL UNIQUE,
    name VARCHAR NOT NULL,
    pass VARCHAR NOT NULL,
    PRIMARY KEY (uuid)
);

CREATE TABLE IF NOT EXISTS category (
    uuid uuid DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL UNIQUE,    
    createby VARCHAR NOT NULL,
    createdate VARCHAR NOT NULL,
    modifyby VARCHAR NOT NULL,
    modifydate VARCHAR NOT NULL,    
    PRIMARY KEY (uuid)
);

ALTER TABLE production
ADD categoryid VARCHAR NOT NULL
DEFAULT ('')

-- Drop tabela existente, se existir
DROP TABLE IF EXISTS settings;

-- Criação da tabela settings
CREATE TABLE settings (
    uuid uuid DEFAULT uuid_generate_v4()
    id SERIAL NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    value VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL,
    PRIMARY KEY (uuid)
);

INSERT INTO exactmeasure (uuid, name, createby, createdate, modifyby, modifydate, ordenation) values ('67fa3115-b75f-42af-a75b-cec78ea0cb26','ml','a2be8133-9f59-4afe-876c-11d322956731','1658766035713','a2be8133-9f59-4afe-876c-11d322956731','1658766035713','0');
INSERT INTO exactmeasure (uuid, name, createby, createdate, modifyby, modifydate, ordenation) values ('2a2c308a-13b6-4d5d-b5d7-9d228fcb6a6a','gramas','a2be8133-9f59-4afe-876c-11d322956731','1658766035713','a2be8133-9f59-4afe-876c-11d322956731','1658766035713','1');
INSERT INTO exactmeasure (uuid, name, createby, createdate, modifyby, modifydate, ordenation) values ('0a4dc529-2c55-44c0-8d3a-abc8ef460cbc','unidade','a2be8133-9f59-4afe-876c-11d322956731','1658766035713','a2be8133-9f59-4afe-876c-11d322956731','1658766035713','2');
INSERT INTO exactmeasure (uuid, name, createby, createdate, modifyby, modifydate, ordenation) values ('9857f07f-d471-4e1c-8667-21a29cb2355d','cm','a2be8133-9f59-4afe-876c-11d322956731','1658766035713','a2be8133-9f59-4afe-876c-11d322956731','1658766035713','3');


INSERT INTO users (nickname, name, pass) values ('admin', 'Administrador','Br@Admin2910');
INSERT INTO users (uuid,nickname, name, pass) values ('a2be8133-9f59-4afe-876c-11d322956731','', 'system','');
