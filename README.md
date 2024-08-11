# Create Env Action

This is a Github Action that creates an environment variable file (.env, app.env, etc) from values supplied. It's features include:

1. Creating a new environment file from supplied values
2. Updating an existing environment file with new values

## Usage

To use, reference the latest released tag in your workflow file and supply your desired env values in the with block. An example is shown below:

```yaml
name: Deploy to VM
on:
  push:
    branches: ["main"]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      - name: Create .env
        uses: vicradon/create-env-action@v0.0.9
        with:
          action_input_file: .env.sample
          action_output_file: .env
          DB_HOST: ${{ secrets.DB_HOST }}
          DB_USER: ${{ secrets.DB_USER }}
          DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
          DB_NAME: ${{ secrets.DB_NAME }}
          DB_PORT: ${{ secrets.DB_PORT }}
          REDIS_HOST: ${{ secrets.REDIS_HOST }}
          REDIS_PORT: ${{ secrets.REDIS_PORT }}
          APP_NAME: ${{ secrets.APP_NAME }}

      - name: Upload env file
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          password: ${{ secrets.PASSWORD }}
          source: .env
          target: /app/.env

      - name: Deploy app
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          password: ${{ secrets.PASSWORD }}
          script: |
            cd /app
            ./deploy.sh
```

## Considerations

Github Actions will throw warnings for all the variables you set except the action_input_file and action_output_file. This is because we allow you to define any variable name you want and Github Actions does not know them.

## Contributing

Please feel free to raise issues or submit PRs.

## License

MIT
