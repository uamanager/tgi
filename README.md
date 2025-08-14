# TGI Job Worker

## Getting Started with Docker

This project can be easily run locally using Docker and Docker Compose. Follow the instructions below to get the application running on your local machine.

### Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Docker**: [Download and install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: Usually included with Docker Desktop, or [install separately](https://docs.docker.com/compose/install/)

To verify your installation, run:
```bash
docker --version
docker-compose --version
```

### Quick Start

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd tgi
   ```

2. **Build and start the application**:
   ```bash
   docker-compose up --build
   ```

   This command will:
   - Build the Docker image using the project's Dockerfile
   - Start the application container
   - Expose the application on port 3000

3. **Access the application**:
   - Open your browser and navigate to: `http://localhost:3000/docs`
