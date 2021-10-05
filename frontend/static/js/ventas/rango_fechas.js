const { ipcRenderer } = require('electron');

const path = require('path');

const fecha_inicial_dom = $('#fecha_inicial');
const fecha_final_dom = $('#fecha_final');

const init = echarts.init($('#rango_fechas_graphic')[0]);

const options = {
    title: {
        text: 'Ventas',
        subtext: `Se han hecho 2 venta(s) en total`
    },
    toolbox: {
        show: true,
        feature: {
            magicType: { type: ['line', 'bar'] },
            saveAsImage: {}
        }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    calculable: true,
    xAxis: {
        type: 'category',
        boundaryGap: false,
        splitLine: {
            show: false
        }
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
            show: true
        }
    },
    dataZoom: [
        {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'empty'
        },
        {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'empty'
        },
    ],
    color: [
        "#3bc47d",
    ],
    series: [
        {
            name: 'Venta(s)',
            type: 'line',
            smooth: true,
            data: [["2018-05-10", 1], ["2020-05-10", 1]]
        }
    ]
};

init.setOption(options);

const validate = (value1, value2) => {
    if ((value1 !== '') && (value2 !== '')) {
        return true;
    }
    return false;
};

const respuesta = (val, data) => {
    if (val) {
        ipcRenderer.send('require::range_date_sale', data);

        ipcRenderer.on('graphicData::sales', (err, item) => {

            const dom = $('#rango_fechas_graphic');

            let rawData = [];
            let totalSale = 0;

            item.map((x, index) => {
                d = new Date(x.fecha_creacion);
                month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
                day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();

                stringDate = `${d.getFullYear()}-${month}-${day}`;

                totalSale += x.ventas;

                rawData.push([
                    stringDate,
                    x.ventas
                ]);
            });

            options.series[0].data = rawData;
            options.title.subtext = `Se han hecho ${totalSale} venta(s) en total`;

            init.setOption(options);
        });
    }
};

fecha_inicial_dom.on('change', function () {
    const val = validate(fecha_inicial_dom.val(), fecha_final_dom.val());

    respuesta(val, {
        init: fecha_inicial_dom.val(),
        end: fecha_final_dom.val()
    });
});

fecha_final_dom.on('change', function () {
    const val = validate(fecha_inicial_dom.val(), fecha_final_dom.val());

    respuesta(val, {
        init: fecha_inicial_dom.val(),
        end: fecha_final_dom.val()
    });
});
