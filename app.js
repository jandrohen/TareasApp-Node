require('colors');

const {guardarDB, leerDB} = require("./helpers/guardarArchivo");
const {
    inquirerMenu,
    pausa,
    leerInput,
    listadoTareasBorrar,
    confirmar,
    mostrarListadoChecklist
} = require("./helpers/inquirer");

const Tareas = require("./models/tareas");

const main = async () => {

    let opt = '';
    const tareas = new Tareas();
    const tareasDb = leerDB();

    if (tareasDb) {
        tareas.cargarTareasFromArray(tareasDb);
    }

    do {
        //Imprimir el menu
        opt = await inquirerMenu();


        switch (opt) {
            case '1':
                //crear opción
                const desc = await leerInput('Descripción:');
                tareas.crearTarea(desc);
                console.log(desc)
                break;

            case '2':
                tareas.listadoCompleto();
                break;

            case '3': //Listar completadas
                tareas.listarPendientesCompletadas(true);
                break;

            case '4': //Listar pendientes
                tareas.listarPendientesCompletadas(false);
                break;

            case '5': //Completado | pendiente
                const ids = await mostrarListadoChecklist(tareas.listadoArr)
                console.log(ids)
                break;

            case '6': //Borrar
                const id = await listadoTareasBorrar( tareas.listadoArr );
                if (id !== '0') {
                    const ok = await confirmar('Está seguro?');
                    if (ok){
                        tareas.borrarTarea(id);
                        console.log('Tarea borrada');
                    }
                }
                break;
        }

        guardarDB(tareas.listadoArr);

        await pausa();

    }while (opt !== '0')

    // pausa()
}


main();

