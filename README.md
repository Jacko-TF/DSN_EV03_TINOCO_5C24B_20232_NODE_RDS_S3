# DSN_EV03_TINOCO_5C24B_20232_NODE_RDS_S3
---
## Guía de instalación

### Requerimientos:

    Node
    Git
    Docker y docker-compose
    Una cuenta AWS
    Una base de datos Mysql
    Un bucket en el servicio S3
    Un usuario con permisos en S3 y sus credenciales (puede usar credenciales de sus cuenta main pero es mejor crear un usuario con privilegios limitados en especial en producción)
    
### Instalación local
    
>Ejecutaremos los siguientes comandos

    git clone https://github.com/Jacko-TF/DSN_EV03_TINOCO_5C24B_20232_NODE_RDS_S3.git app
    cd app 
    npm install

>Antes de ejecutar nuestra aplicación debemos crear un archivo .env en el directorio frontend con el siguiente contenido, podemos usar como ejemplo el archivo .env.example

    PORT=
    HOST=
    DATABASE=
    USER=
    PASSWORD=
    DATABASE_PORT=
    MY_ACCESS_KEY_ID=
    MY_SECRET_ACCESS_KEY=
    S3_REGION=
    BUCKET_NAME=

>Ahora podemos ejecutar el comando

    npm start

>Veremos nuestra aplicación desde http://localhost:${PORT}/

---
### Instalación en Docker - Instancia EC2 de AWS
>Para instalacion en docker necesitaremos crear un archivo Dockerfile, para ello nos conectamos a una instancia de EC2 de Ubunto y luego de instalar Docker y docker-compose vamos a ejecutar

    mkdir app
    cd app
    vi Dockerfile
    
>En la línea de comandos de vi podemos editar colocando i , copiamos el siguiente contenido:

    FROM node:18.16
    RUN apt-get update && apt-get install -y nodejs npm
    RUN git clone -q https://github.com/Jacko-TF/DSN_EV03_TINOCO_5C24B_20232_NODE_RDS_S3.git node
    WORKDIR node
    RUN npm install > /dev/null
    EXPOSE 8000
    CMD ["npm","start"]

> Luego regresamos al directorio raiz y crearemos un arhivo compose.yml

    cd ..
    vi docker-compose.yml
    
> Vamos a colocar el siguiente contenidor:

    version: '3.9'

    services:
      node:
        build: ./app
        ports:
          - "8000:8000"
        environment:
          - PORT=
          - HOST=
          - DATABASE=
          - USER=
          - PASSWORD=
          - DATABASE_PORT=
          - MY_ACCESS_KEY_ID=
          - MY_SECRET_ACCESS_KEY=
          - S3_REGION=
          - BUCKET_NAME=
--- 
> Para ejecutar nuestro docker-compose usamos:

    docker-compose up --build
    
>De esta manera tendremos un crud de contactos ejecutandose en una instancia EC2 de AWS, con una base de datos RDS mysql y usamos como storage un bucket de S3.

![image](https://github.com/Jacko-TF/DSN_EV03_TINOCO_5C24B_20232_NODE_RDS_S3/assets/91491075/dffa87d5-6dc3-436b-a7f3-874acd683dcf)
