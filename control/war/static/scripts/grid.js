			var grid, dataStore, store;
			require([
				"dojox/grid/EnhancedGrid",
				"dojo/store/Memory",
				"dojo/data/ObjectStore",
				"dojo/request",
				"dojo/domReady!"
			], function(EnhancedGrid, Memory, ObjectStore, request){
				request.get("data/employees.json", {
					handleAs: "json"
				}).then(function(data){

					store = new Memory({ data: data.items });
					dataStore = new ObjectStore({ objectStore: store });

					grid = new EnhancedGrid({
						store: dataStore,
						query: { id_emp: "*" },
						structure: [
							{ name: "ID", field: "id_emp", width: "84px", classes: "firstName" },
							{ name: "Name", field: "name", width: "84px", cellClasses: "lastName" },
							{ name: "Type", field: "type", width: "70px", cellStyles: "text-align: right;"}
						],
						rowSelector: '20px'
					}, "employeeGrid");
					// since we created this grid programmatically, call startup to render it
					grid.startup();
				});
			});
		