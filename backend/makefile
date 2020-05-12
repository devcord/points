cnf ?= config.env
include $(cnf)
export $(shell sed 's/=.*//' $(cnf))

compose-up:
	docker-compose up

compose-daemon:
	docker-compose up -d

compose-down:
	docker-compose down

compose-build:
	build compose-daemon
