create:
	docker build . -t table_plugin_image
delete:
	docker rmi table_plugin_image
run:
	docker run -d -p 8080:8080 --rm --name table_plugin_container table_plugin_image
stop:
	docker stop table_plugin_container