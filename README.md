# malis3-frontend

This is the frontend of malis3 system

## Requirements:
- NodeJS 14.x (latest LTS version)
- Yarn: you can install `yarn` by running `npm i -g yarn`

## Prepare the configuration file
- Clone the `.env.local.example` to a new file called `.env.local`
- Edit that file to fit your needs

## Run the project up in dev mode
```
yarn run dev
```

## Some note for developers
- For the windowOS, please run this command before cloning this project
```
git config --global core.autocrlf false
```
Before commiting your code to the main `develop` branch of the repository:
- Always make sure that the project can be built successfully before pushing, you can build the project using the command below
```
yarn run build
```
