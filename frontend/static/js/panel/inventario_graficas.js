/**
* @module Grafico que genera el inventario llenandose (abastecimiento)
* @param {*} container : DOM CONTAINER GRAPHIC
* @returns graphic
*/

const dataInventario = [
    ["2018-02-15", 1], ["2018-06-15", 7], ["2018-08-15", 3], ["2018-09-15", 4]
];
const inventario_graficas_llenado = () => {

    this.init;
    this.options;

    return {
        show: () => this.init.setOption(this.options),
        getReport: () => this.init,
        setReport: (container, rawData, head) => {
            this.init = echarts.init(container);

            this.options = {
                title: {
                    text: head.title,
                    subtext: head.subtitle,
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    bottom: 10,
                    left: 'center',
                },
                series: [
                    {
                        name: 'Venta(s)',
                        type: 'pie',
                        radius: '50%',
                        data: rawData,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ],
            };
            
            return this.init;
        }
    };
};