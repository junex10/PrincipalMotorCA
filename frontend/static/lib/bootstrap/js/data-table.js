var table_datatable = '';

if ($("table.second").length) {

    $(document).ready(function () {
        table_datatable = $('table.second').DataTable({
            lengthChange: false,
            buttons: ['copy', 'excel', 'pdf', 'print', 'colvis'],
            language: {
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ registros",
                "sZeroRecords": "No se encontraron resultados",
                "sEmptyTable": "Ningún dato disponible en esta tabla",
                "sInfo": "",
                "sInfoEmpty": "",
                "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix": "",
                "sSearch": "Buscar:",
                "sUrl": "",
                "sInfoThousands": ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst": "Primero",
                    "sLast": "Último",
                    "sNext": "Siguiente",
                    "sPrevious": "Anterior"
                },
                "oAria": {
                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                }
            }
        });

        table_datatable.buttons().container()
            .appendTo($('.col-sm-6:eq(0)', table_datatable.table().container() ));

        $('.dataTables_filter input[type="search"]').css(
            {
                'width':'650px',
                'display':'block',
                'border-top':'none',
                'border-right':'none',
                'border-left':'none',
                'border-radius':'0px',
                'background-color':'rgba(0,0,0,0)'
            }
        );
        $('.dataTables_filter').css({
            'color':'var(--verde)'
        });
        $('.dataTables_paginate').css({
            'display':'block',
            'float':'right'
        });
    });
}