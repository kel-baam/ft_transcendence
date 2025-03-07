IMAGES 					= db-service redis:alpine client-service \
							auth-service user-service game-service  \
							 tournament-service matchmaking-service \

# VOLUMES					= dataBase auth_volume user_volume tournament_volume matchmaking_volume \
# 							client_volume game_volume

up : 
	docker compose -f docker-compose.yml up --build

down :
	docker compose -f docker-compose.yml down

start :
	docker compose -f docker-compose.yml start

stop :
	docker compose -f docker-compose.yml stop

# clean_volumes :
# 	docker volume rm -f $(VOLUMES)

clean_images :
	docker rmi -f $(IMAGES)

fclean : down  clean_images

reset : fclean up
