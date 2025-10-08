FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file
COPY server/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the server code
COPY server/ ./server/

# Set environment variables
ENV FLASK_APP=server/app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["flask", "run"]