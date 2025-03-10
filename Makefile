IMAGES 					= db-service redis:alpine client-service \
							auth-service user-service game-service  \
							 tournament-service matchmaking-service \

up : 
	docker compose -f docker-compose.yml up --build -d

down :
	docker compose -f docker-compose.yml down

start :
	docker compose -f docker-compose.yml start

stop :
	docker compose -f docker-compose.yml stop


clean_images :
	docker rmi -f $(IMAGES)

fclean : down  clean_images

reset : fclean up