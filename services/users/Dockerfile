# pull official base image
FROM python:3.10.3-slim-buster

# set working directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PTYHONUNBUFFERED 1

# install system dependencies
RUN apt-get update \
    && apt-get -y install netcat gcc postgresql \
    && apt-get clean

RUN apt update -y \ 
    && apt install -y build-essential libpq-dev

RUN pip3 install psycopg2-binary --no-binary psycopg2-binary

# add and install requirements
RUN pip install --upgrade pip
COPY ./requirements.txt .
COPY ./requirements-dev.txt .
RUN pip install -r requirements-dev.txt
EXPOSE 5000

# add app
COPY . .

# run server
# CMD python manage.py run -h 0.0.0.0

# add entrypoint.sh
COPY ./entrypoint.sh .
RUN chmod +x /usr/src/app/entrypoint.sh



