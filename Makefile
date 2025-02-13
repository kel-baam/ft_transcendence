IMAGES 					= db-service redis:alpine client-service \
							auth-service user-service tournament-service matchmaking-service \
							dpage/pgadmin4:latest

VOLUMES					= dataBase auth_volume user_volume tournament_volume matchmaking_volume \
							client_volume

up : 
	docker compose -f docker-compose.yml up

down :
	docker compose -f docker-compose.yml down

start :
	docker compose -f docker-compose.yml start

stop :
	docker compose -f docker-compose.yml stop

clean_volumes :
	docker volume rm -f $(VOLUMES)

clean_images :
	docker rmi -f $(IMAGES)

fclean : down clean_volumes clean_images

reset : fclean up
