# pull official base image
FROM public.ecr.aws/docker/library/postgres:14-alpine

# run create.sql on init
ADD create.sql /docker-entrypoint-initdb.d

