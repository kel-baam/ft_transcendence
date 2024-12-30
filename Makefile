up :
	docker compose up 

Down : 
		docker ps -a -q | xargs -r docker rm -f && \
		docker images -q | xargs -r docker rmi -f && \
		docker volume ls -q | xargs -r docker volume rm && \
		docker network ls | grep -v "bridge|host|none" | awk '{if(NR>1)print $1}' | xargs -r docker network rm