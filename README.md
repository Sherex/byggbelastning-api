# Byggbelastning API
GraphQL API for the Byggbelastning project.  
This queries the Byggbelastning DB for client information.

Currently it's primary use is to provide data for the Byggbelastning frontend, but will most likely be used as a general datasource later.  
For example as a datasource for PowerBI.

## Related repositories
- [byggbelastning-data-poller](https://github.com/vtfk/byggbelastning-data-poller)
- [byggbelastning-frontend](https://github.com/vtfk/byggbelastning-frontend)

## Usage
> Note: This project is still in development!
### Docker
> Note: There is currently no image on DockerHub
```sh
# Clone the repo, then cd into it
git clone https://github.com/vtfk/byggbelastning-api
cd byggbelastning-api/

# Run the compose-file to build the image and start a container
docker-compose up -d # --build # Use the --build option to force-build on new version

# Read and follow the logs for the created container
docker logs -f byggbelastning-api
```

### NodeJS
```sh
# Clone the repo, then cd into it
git clone https://github.com/vtfk/byggbelastning-api
cd byggbelastning-api/

# Install dependencies
npm install

# Rename template.env to .env then edit it
mv template.env .env

# Build the application
npm run build

# Start the application
npm start
```

## Development
```sh
# Clone the repo
git clone https://github.com/vtfk/byggbelastning-api
cd byggbelastning-api/

# Install dependencies
npm install

# Rename template.env to .env then edit it
mv template.env .env

# Start the app with hot-reload
npm run dev src/
```

## LICENSE
[MIT](LICENSE)